import type { DishWithTags } from "@/domain/models/dish"
import type { DishIngredient, Ingredient } from "@/domain/models/ingredient"
import { choosePacks, formatAmount } from "./shopping"
import type { MealPlan, PlannedDay, ShoppingItem, StorageAlert } from "./types"

export const MIN_DAYS = 3
export const MAX_DAYS = 7
/** data/dish-ingredients.json の分量が何人分で書かれているか */
export const BASE_SERVINGS = 2

/** 材料データを持つ料理 */
export type PlannableDish = {
  dish: DishWithTags
  items: DishIngredient[]
}

export type PlanOptions = {
  days: number
  servings: number
  /** 質問フローで選んだタグ。献立の好みを反映する */
  selectedTagIds?: string[]
  candidates: PlannableDish[]
  getIngredient: (id: string) => Ingredient | undefined
  /** テストで結果を固定するための乱数源 */
  random?: () => number
}

// スコアの重み。買い物1回で回すには「食材の使い回し」が効く必要があるので、
// 好みの一致より食材の共有をやや強く見る。
const WEIGHT_TAG_MATCH = 2
/**
 * 使い回し率（既に買う食材 / その料理の買う食材）への重み。
 * 「共有した個数」で測ると材料の少ない料理ばかりが勝ってしまい、
 * 肉だけの献立が5日続くので、割合で評価する。
 */
const WEIGHT_SHARED_RATIO = 4
/** 新しく買う食材が増えることへの弱いペナルティ */
const WEIGHT_NEW_INGREDIENT = -0.15
/** 野菜が入っている料理を少し優先する（栄養の偏りを避ける） */
const WEIGHT_VEGETABLE = 0.5
/** 1品で数える野菜の上限。野菜だらけの料理が勝ちすぎないようにする */
const VEGETABLE_COUNT_CAP = 3
/** 同じ主菜食材を使い回すのは安いが、続けすぎると飽きるので回数に応じて減点 */
const WEIGHT_REPEATED_MAIN = -1.2
/** 同スコアの並びをばらすための微小なゆらぎ */
const TIE_BREAK_SCALE = 0.01

/** 主菜になる食材のカテゴリ。同じ主菜の偏りを見る判定に使う */
const MAIN_CATEGORIES = new Set(["meat", "seafood"])

function mainIngredientId(
  items: DishIngredient[],
  getIngredient: (id: string) => Ingredient | undefined,
): string | undefined {
  return items.find((item) => {
    const ingredient = getIngredient(item.ingredientId)
    return ingredient !== undefined && MAIN_CATEGORIES.has(ingredient.category)
  })?.ingredientId
}

/** 買い物リストに載る（＝常備品でない）材料IDだけを返す */
function shoppableIds(
  items: DishIngredient[],
  getIngredient: (id: string) => Ingredient | undefined,
): string[] {
  return items
    .filter((item) => getIngredient(item.ingredientId)?.pantry === false)
    .map((item) => item.ingredientId)
}

/** その料理に入っている野菜の数（上限つき） */
function vegetableCount(
  items: DishIngredient[],
  getIngredient: (id: string) => Ingredient | undefined,
): number {
  const count = items.filter(
    (item) => getIngredient(item.ingredientId)?.category === "vegetable",
  ).length
  return Math.min(count, VEGETABLE_COUNT_CAP)
}

/**
 * 買い物1回でまわす N 日分の献立を組み立てる。
 *
 * 1. 好みのタグに合う料理を1品目に選ぶ
 * 2. 以降は「すでに買うことになっている食材を使い回せる料理」を優先して足す
 * 3. 日持ちの短い食材を使う料理を前半に配置する
 * 4. 必要量をパック単位に切り上げて買い物リストにする
 * 5. 傷む前に使い切れない食材と、余る食材を警告する
 */
export function buildMealPlan(options: PlanOptions): MealPlan {
  const {
    days,
    servings,
    selectedTagIds = [],
    candidates,
    getIngredient,
    random = Math.random,
  } = options

  const selectedSet = new Set(selectedTagIds)
  const scale = servings / BASE_SERVINGS

  const tagScoreOf = (dish: DishWithTags) =>
    dish.tagIds.filter((tagId) => selectedSet.has(tagId)).length

  // ── 1〜2. 食材を共有する料理を貪欲に選ぶ ───────────────────────────
  const remaining = [...candidates]
  const chosen: PlannableDish[] = []
  const basket = new Set<string>()
  /** 主菜食材ごとの採用回数 */
  const mainUsage = new Map<string, number>()

  const targetCount = Math.min(days, remaining.length)

  while (chosen.length < targetCount) {
    let bestIndex = 0
    let bestScore = Number.NEGATIVE_INFINITY

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i]
      const ids = shoppableIds(candidate.items, getIngredient)
      const shared = ids.filter((id) => basket.has(id)).length
      const fresh = ids.length - shared
      const sharedRatio = ids.length === 0 ? 0 : shared / ids.length
      const mainId = mainIngredientId(candidate.items, getIngredient)
      const mainRepeats = mainId === undefined ? 0 : (mainUsage.get(mainId) ?? 0)

      const score =
        tagScoreOf(candidate.dish) * WEIGHT_TAG_MATCH +
        sharedRatio * WEIGHT_SHARED_RATIO +
        fresh * WEIGHT_NEW_INGREDIENT +
        vegetableCount(candidate.items, getIngredient) * WEIGHT_VEGETABLE +
        mainRepeats * WEIGHT_REPEATED_MAIN +
        random() * TIE_BREAK_SCALE

      if (score > bestScore) {
        bestScore = score
        bestIndex = i
      }
    }

    const [picked] = remaining.splice(bestIndex, 1)
    chosen.push(picked)
    for (const id of shoppableIds(picked.items, getIngredient)) basket.add(id)

    const pickedMainId = mainIngredientId(picked.items, getIngredient)
    if (pickedMainId !== undefined) {
      mainUsage.set(pickedMainId, (mainUsage.get(pickedMainId) ?? 0) + 1)
    }
  }

  // ── 3. 日持ちの短い食材を使う料理を前半へ ────────────────────────
  const shortestShelfLife = (entry: PlannableDish): number => {
    const lives = entry.items
      .map((item) => getIngredient(item.ingredientId))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined)
      .filter((ingredient) => !ingredient.pantry && ingredient.shelfLifeDays !== null)
      .map((ingredient) => ingredient.shelfLifeDays as number)
    return lives.length === 0 ? Number.POSITIVE_INFINITY : Math.min(...lives)
  }

  const ordered = [...chosen].sort((a, b) => shortestShelfLife(a) - shortestShelfLife(b))

  const plannedDays: PlannedDay[] = ordered.map((entry, index) => ({
    day: index + 1,
    dish: entry.dish,
    ingredients: entry.items
      .map((item) => ({
        ingredient: getIngredient(item.ingredientId),
        amount: item.amount * scale,
      }))
      .filter(
        (planned): planned is { ingredient: Ingredient; amount: number } =>
          planned.ingredient !== undefined && !planned.ingredient.pantry,
      ),
  }))

  // ── 4. 食材ごとの必要量と「最後に使う日」を集計 ──────────────────
  const required = new Map<
    string,
    { ingredient: Ingredient; amount: number; lastUsedDay: number }
  >()
  const pantryIngredients = new Map<string, Ingredient>()

  ordered.forEach((entry, index) => {
    const day = index + 1
    for (const item of entry.items) {
      const ingredient = getIngredient(item.ingredientId)
      if (ingredient === undefined) continue

      if (ingredient.pantry) {
        pantryIngredients.set(ingredient.id, ingredient)
        continue
      }

      const current = required.get(ingredient.id)
      if (current === undefined) {
        required.set(ingredient.id, {
          ingredient,
          amount: item.amount * scale,
          lastUsedDay: day,
        })
      } else {
        current.amount += item.amount * scale
        current.lastUsedDay = day
      }
    }
  })

  // ── 5. パック単位に切り上げて買い物リストへ ──────────────────────
  const shoppingList: ShoppingItem[] = [...required.values()]
    .map(({ ingredient, amount, lastUsedDay }) => {
      const selection = choosePacks(ingredient, amount)
      return {
        ingredient,
        requiredAmount: amount,
        purchasedAmount: selection.purchasedAmount,
        packs: selection.packs,
        totalPrice: selection.totalPrice,
        leftoverAmount: Math.max(0, selection.purchasedAmount - amount),
        lastUsedDay,
      }
    })
    .sort((a, b) => a.ingredient.category.localeCompare(b.ingredient.category))

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.totalPrice, 0)

  return {
    days: plannedDays,
    shoppingList,
    pantryIngredients: [...pantryIngredients.values()],
    totalPrice,
    alerts: buildAlerts(shoppingList),
    servings,
  }
}

/** 余りが「気になる量」とみなす割合 */
const LEFTOVER_RATIO_THRESHOLD = 0.3
/** 余り警告を出す対象の日持ち上限（日） */
const PERISHABLE_DAYS = 7

function buildAlerts(shoppingList: ShoppingItem[]): StorageAlert[] {
  const alerts: StorageAlert[] = []

  for (const item of shoppingList) {
    const { ingredient, lastUsedDay, leftoverAmount, purchasedAmount } = item
    const shelfLife = ingredient.shelfLifeDays

    if (shelfLife !== null && lastUsedDay > shelfLife) {
      alerts.push({
        kind: "spoilage",
        ingredient,
        lastUsedDay,
        leftoverAmount,
        message: ingredient.freezable
          ? `${ingredient.name}は日持ち${shelfLife}日。${lastUsedDay}日目に使う分は買った日に冷凍しておく`
          : `${ingredient.name}は日持ち${shelfLife}日。${lastUsedDay}日目に使う分は買い足しを検討`,
      })
    }

    const isPerishable = shelfLife !== null && shelfLife <= PERISHABLE_DAYS
    const ratio = purchasedAmount > 0 ? leftoverAmount / purchasedAmount : 0
    if (isPerishable && leftoverAmount > 0 && ratio >= LEFTOVER_RATIO_THRESHOLD) {
      alerts.push({
        kind: "leftover",
        ingredient,
        lastUsedDay,
        leftoverAmount,
        message: `${ingredient.name}が${formatAmount(leftoverAmount)}${ingredient.unit}余る。${
          ingredient.freezable ? "冷凍するか別の料理に回す" : "早めに使い切る"
        }`,
      })
    }
  }

  // 傷むリスクのほうが重いので先に出す
  return alerts.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "spoilage" ? -1 : 1))
}
