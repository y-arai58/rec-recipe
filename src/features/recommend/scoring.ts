import type { DishWithTags } from "@/domain/models/dish"

const DEFAULT_LIMIT = 5

export type ScoringOptions = {
  selectedTagIds: string[]
  dishes: DishWithTags[]
  /** 再レコメンド時に除外する料理ID */
  excludeIds?: string[]
  limit?: number
}

export type ScoredDish = DishWithTags & { score: number }

/**
 * 選択タグIDと料理タグの一致数でスコアリングし、上位 limit 件を返す。
 * - スコア降順ソート
 * - 同スコア内はランダムシャッフル（再レコメンド時の多様性）
 * - excludeIds に含まれる料理は除外
 */
export function scoreDishes(options: ScoringOptions): ScoredDish[] {
  const { selectedTagIds, dishes, excludeIds = [], limit = DEFAULT_LIMIT } = options

  const selectedSet = new Set(selectedTagIds)
  const excludeSet = new Set(excludeIds)

  const scored: ScoredDish[] = dishes
    .filter((dish) => !excludeSet.has(dish.id))
    .map((dish) => ({
      ...dish,
      score: dish.tagIds.filter((id) => selectedSet.has(id)).length,
    }))

  // スコア降順 → 同スコア内をシャッフル
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  return scored.slice(0, limit)
}
