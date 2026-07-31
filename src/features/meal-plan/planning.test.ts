// @vitest-environment node
import { describe, expect, it } from "vitest"
import type { DishWithTags } from "@/domain/models/dish"
import type { Ingredient } from "@/domain/models/ingredient"
import { getIngredientById } from "@/lib/ingredient-data"
import { buildMealPlan, MAX_DAYS, MIN_DAYS, type PlannableDish } from "./planning"
import { getPlannableDishes } from "./queries"

// ── テスト用フィクスチャ ────────────────────────────────────────────

const makeIngredient = (over: Partial<Ingredient> & Pick<Ingredient, "id">): Ingredient => ({
  name: over.id,
  category: "vegetable",
  unit: "個",
  packs: [{ size: 1, price: 100, label: "1個" }],
  shelfLifeDays: 10,
  freezable: false,
  pantry: false,
  ...over,
})

const INGREDIENTS: Ingredient[] = [
  makeIngredient({ id: "onion", name: "玉ねぎ", shelfLifeDays: 21 }),
  makeIngredient({ id: "carrot", name: "にんじん", shelfLifeDays: 21 }),
  makeIngredient({
    id: "moyashi",
    name: "もやし",
    shelfLifeDays: 2,
    unit: "袋",
    packs: [{ size: 1, price: 40, label: "1袋" }],
  }),
  makeIngredient({
    id: "pork",
    name: "豚こま切れ肉",
    category: "meat",
    unit: "g",
    shelfLifeDays: 2,
    freezable: true,
    packs: [
      { size: 300, price: 430, label: "300gパック" },
      { size: 600, price: 760, label: "600g 大容量パック" },
    ],
  }),
  makeIngredient({
    id: "chicken",
    name: "鶏もも肉",
    category: "meat",
    unit: "g",
    shelfLifeDays: 2,
    freezable: true,
    packs: [{ size: 300, price: 450, label: "300gパック" }],
  }),
  makeIngredient({ id: "soy", name: "醤油", category: "seasoning", pantry: true }),
]

const ingredientMap = new Map(INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]))
const getIngredient = (id: string) => ingredientMap.get(id)

const makeDish = (id: string, tagIds: string[] = []): DishWithTags => ({
  id,
  name: `dish-${id}`,
  tagIds,
  tags: [],
})

const CANDIDATES: PlannableDish[] = [
  {
    dish: makeDish("pork-stirfry", ["tag-genre-chinese"]),
    items: [
      { ingredientId: "pork", amount: 200 },
      { ingredientId: "moyashi", amount: 1 },
      { ingredientId: "soy", amount: 1 },
    ],
  },
  {
    dish: makeDish("nikujaga", ["tag-genre-japanese"]),
    items: [
      { ingredientId: "pork", amount: 200 },
      { ingredientId: "onion", amount: 1 },
      { ingredientId: "carrot", amount: 1 },
    ],
  },
  {
    dish: makeDish("chicken-teri", ["tag-genre-japanese"]),
    items: [
      { ingredientId: "chicken", amount: 300 },
      { ingredientId: "soy", amount: 1 },
    ],
  },
  {
    dish: makeDish("onion-soup", []),
    items: [{ ingredientId: "onion", amount: 2 }],
  },
  {
    dish: makeDish("carrot-salad", []),
    items: [{ ingredientId: "carrot", amount: 2 }],
  },
]

const plan = (over: Partial<Parameters<typeof buildMealPlan>[0]> = {}) =>
  buildMealPlan({
    days: 3,
    servings: 2,
    candidates: CANDIDATES,
    getIngredient,
    random: () => 0.5,
    ...over,
  })

// ── テスト ────────────────────────────────────────────────────────

describe("buildMealPlan", () => {
  it("指定した日数ぶんの献立を返す", () => {
    expect(plan({ days: 3 }).days).toHaveLength(3)
    expect(plan({ days: 5 }).days).toHaveLength(5)
  })

  it("候補が日数より少なければ候補の数だけ返す", () => {
    const result = plan({ days: 7 })
    expect(result.days).toHaveLength(CANDIDATES.length)
  })

  it("同じ料理を2回出さない", () => {
    const ids = plan({ days: 5 }).days.map((day) => day.dish.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("日番号は1から連番になる", () => {
    expect(plan({ days: 4 }).days.map((day) => day.day)).toEqual([1, 2, 3, 4])
  })

  it("日持ちの短い食材を使う料理が先に来る", () => {
    // もやし(2日)・肉(2日)を使う料理が、玉ねぎ(21日)だけの料理より前
    const result = plan({ days: 5 })
    const dayOf = (id: string) => result.days.find((day) => day.dish.id === id)?.day ?? 99

    expect(dayOf("pork-stirfry")).toBeLessThan(dayOf("onion-soup"))
    expect(dayOf("chicken-teri")).toBeLessThan(dayOf("carrot-salad"))
  })

  it("常備品は買い物リストに出さず、別枠にまとめる", () => {
    const result = plan({ days: 5 })
    const ids = result.shoppingList.map((item) => item.ingredient.id)

    expect(ids).not.toContain("soy")
    expect(result.pantryIngredients.map((ingredient) => ingredient.id)).toContain("soy")
  })

  it("同じ食材を使う複数の料理ぶんをまとめて1行にする", () => {
    const result = plan({ days: 5 })
    const pork = result.shoppingList.filter((item) => item.ingredient.id === "pork")

    expect(pork).toHaveLength(1)
    // 豚こま 200g を使う料理が2品 → 400g 必要
    expect(pork[0].requiredAmount).toBe(400)
  })

  it("必要量をパック単位に切り上げて買う", () => {
    const result = plan({ days: 5 })
    for (const item of result.shoppingList) {
      expect(item.purchasedAmount).toBeGreaterThanOrEqual(item.requiredAmount)
    }
  })

  it("人数を増やすと必要量も増える", () => {
    const forTwo = plan({ days: 3, servings: 2 })
    const forFour = plan({ days: 3, servings: 4 })

    const required = (result: typeof forTwo, id: string) =>
      result.shoppingList.find((item) => item.ingredient.id === id)?.requiredAmount ?? 0

    expect(required(forFour, "pork")).toBe(required(forTwo, "pork") * 2)
  })

  it("合計金額は買い物リストの合計と一致する", () => {
    const result = plan({ days: 5 })
    const sum = result.shoppingList.reduce((total, item) => total + item.totalPrice, 0)
    expect(result.totalPrice).toBe(sum)
  })

  it("日持ちを超えて使う食材を警告する", () => {
    const result = plan({ days: 5 })
    const spoilage = result.alerts.filter((alert) => alert.kind === "spoilage")

    // 日持ち2日の肉を3日目以降に使う献立が必ず出る
    expect(spoilage.length).toBeGreaterThan(0)
    for (const alert of spoilage) {
      expect(alert.lastUsedDay).toBeGreaterThan(alert.ingredient.shelfLifeDays as number)
    }
  })

  it("冷凍できる食材の警告では冷凍を案内する", () => {
    const result = plan({ days: 5 })
    const freezable = result.alerts.find(
      (alert) => alert.kind === "spoilage" && alert.ingredient.freezable,
    )
    expect(freezable?.message).toContain("冷凍")
  })

  it("警告は傷むリスクのほうを先に並べる", () => {
    const kinds = plan({ days: 5 }).alerts.map((alert) => alert.kind)
    const lastSpoilage = kinds.lastIndexOf("spoilage")
    const firstLeftover = kinds.indexOf("leftover")
    if (lastSpoilage !== -1 && firstLeftover !== -1) {
      expect(lastSpoilage).toBeLessThan(firstLeftover)
    }
  })

  it("好みのタグに合う料理を選ぶ", () => {
    const result = plan({ days: 1, selectedTagIds: ["tag-genre-chinese"] })
    expect(result.days[0].dish.id).toBe("pork-stirfry")
  })

  it("random を固定すると同じ献立を返す", () => {
    const ids = () => plan({ days: 4 }).days.map((day) => day.dish.id)
    expect(ids()).toEqual(ids())
  })

  it("各日の材料一覧に常備品を含めない", () => {
    for (const day of plan({ days: 5 }).days) {
      expect(day.ingredients.every((entry) => !entry.ingredient.pantry)).toBe(true)
    }
  })
})

// ── 実データでの検証 ───────────────────────────────────────────────

describe("実データでの献立作成", () => {
  const candidates = getPlannableDishes()

  it("献立プランナーの候補が十分にある", () => {
    expect(candidates.length).toBeGreaterThanOrEqual(MAX_DAYS)
  })

  it("3〜7日のどの日数でも献立と買い物リストが作れる", () => {
    for (let days = MIN_DAYS; days <= MAX_DAYS; days++) {
      const result = buildMealPlan({
        days,
        servings: 2,
        candidates,
        getIngredient: getIngredientById,
        random: () => 0.5,
      })

      expect(result.days).toHaveLength(days)
      expect(result.shoppingList.length).toBeGreaterThan(0)
      expect(result.totalPrice).toBeGreaterThan(0)
    }
  })

  it("実データでも同じ料理が重複しない", () => {
    const result = buildMealPlan({
      days: MAX_DAYS,
      servings: 2,
      candidates,
      getIngredient: getIngredientById,
      random: () => 0.5,
    })
    const ids = result.days.map((day) => day.dish.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("野菜が入らない献立にならない", () => {
    const result = buildMealPlan({
      days: 5,
      servings: 2,
      candidates,
      getIngredient: getIngredientById,
      random: () => 0.5,
    })

    const withVegetable = result.days.filter((day) =>
      day.ingredients.some((entry) => entry.ingredient.category === "vegetable"),
    )
    expect(withVegetable.length).toBeGreaterThanOrEqual(4)
  })

  it("同じ主菜の肉ばかりにならない", () => {
    const result = buildMealPlan({
      days: 5,
      servings: 2,
      candidates,
      getIngredient: getIngredientById,
      random: () => 0.5,
    })

    const mains = result.days
      .map(
        (day) =>
          day.ingredients.find((entry) => ["meat", "seafood"].includes(entry.ingredient.category))
            ?.ingredient.id,
      )
      .filter((id): id is string => id !== undefined)

    expect(new Set(mains).size).toBeGreaterThanOrEqual(3)
  })

  it("食材の使い回しが効いている（買う食材の種類が料理数×材料数より少ない）", () => {
    const result = buildMealPlan({
      days: MAX_DAYS,
      servings: 2,
      candidates,
      getIngredient: getIngredientById,
      random: () => 0.5,
    })

    const totalUses = result.days.reduce((sum, day) => sum + day.ingredients.length, 0)
    expect(result.shoppingList.length).toBeLessThan(totalUses)
  })
})
