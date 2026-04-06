"use server"

import { getDishesForRecommend } from "./queries"
import { scoreDishes } from "./scoring"
import type { RecommendResult } from "./types"
import { RecommendInputSchema } from "./validation"

/**
 * 選択タグIDをもとに料理をレコメンドする Server Action。
 * @param selectedTagIds ユーザーが質問フローで選択したタグID配列
 * @param excludeIds 再レコメンド時に除外する料理ID配列
 */
export async function getRecommendations(
  selectedTagIds: string[],
  excludeIds: string[] = [],
): Promise<RecommendResult> {
  const parsed = RecommendInputSchema.safeParse({ selectedTagIds })
  if (!parsed.success) {
    return { dishes: [] }
  }

  const dishes = getDishesForRecommend()
  const results = scoreDishes({
    selectedTagIds: parsed.data.selectedTagIds,
    dishes,
    excludeIds,
  })

  return {
    dishes: results.map((d) => ({
      id: d.id,
      name: d.name,
      tags: d.tags,
      score: d.score,
    })),
  }
}
