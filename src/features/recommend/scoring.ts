import type { DishWithTags } from "@/domain/models/dish"
import { type DishRole, getRole } from "@/domain/models/tag"

const DEFAULT_LIMIT = 5

export type ScoringOptions = {
  selectedTagIds: string[]
  dishes: DishWithTags[]
  /** 再レコメンド時に除外する料理ID */
  excludeIds?: string[]
  limit?: number
  /** 同スコア内シャッフルの乱数源。テストでは固定値を渡せる */
  random?: () => number
}

export type ScoredDish = DishWithTags & {
  score: number
  /** 選択条件と実際に一致したタグID。「なぜこれが選ばれたか」の表示に使う */
  matchedTagIds: string[]
}

/**
 * 指定した役割の料理だけを返す。
 * レコメンドはメイン（onedish / main）だけを提案し、
 * 副菜・汁物・主食は付け合わせ（pairing.ts）として出す。
 */
export function filterByRoles(dishes: DishWithTags[], roles: DishRole[]): DishWithTags[] {
  const allowed = new Set(roles)
  return dishes.filter((dish) => {
    const role = getRole(dish.tagIds)
    return role !== undefined && allowed.has(role)
  })
}

/**
 * 選択タグIDと料理タグの一致数でスコアリングし、上位 limit 件を返す。
 * - スコア降順ソート
 * - 同スコア内はランダムシャッフル（再レコメンド時の多様性）
 * - excludeIds に含まれる料理は除外
 */
export function scoreDishes(options: ScoringOptions): ScoredDish[] {
  const {
    selectedTagIds,
    dishes,
    excludeIds = [],
    limit = DEFAULT_LIMIT,
    random = Math.random,
  } = options

  const selectedSet = new Set(selectedTagIds)
  const excludeSet = new Set(excludeIds)

  // シャッフル用のキーは料理ごとに1回だけ確定させる。
  // 比較関数の中で乱数を引くと比較の一貫性が壊れ、ソート結果が不定になるため。
  const scored = dishes
    .filter((dish) => !excludeSet.has(dish.id))
    .map((dish) => {
      const matchedTagIds = dish.tagIds.filter((id) => selectedSet.has(id))
      return {
        dish: { ...dish, score: matchedTagIds.length, matchedTagIds },
        shuffleKey: random(),
      }
    })

  scored.sort((a, b) => {
    if (b.dish.score !== a.dish.score) return b.dish.score - a.dish.score
    return a.shuffleKey - b.shuffleKey
  })

  return scored.slice(0, limit).map((entry) => entry.dish)
}
