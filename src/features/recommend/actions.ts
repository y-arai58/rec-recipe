"use server"

import { getAllDishesWithTags } from "@/lib/data"
import type { RecommendedDish, RecommendResult } from "./types"
import { RecommendInputSchema } from "./validation"

const RESULT_COUNT = 5

/** 選択タグIDとのマッチ数でスコアリングし、上位 RESULT_COUNT 件を返す */
export async function getRecommendations(selectedTagIds: string[]): Promise<RecommendResult> {
  const parsed = RecommendInputSchema.safeParse({ selectedTagIds })
  if (!parsed.success) {
    return { dishes: [] }
  }

  const selected = new Set(parsed.data.selectedTagIds)
  const dishes = getAllDishesWithTags()

  const scored: RecommendedDish[] = dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    tags: dish.tags,
    score: dish.tagIds.filter((id) => selected.has(id)).length,
  }))

  // スコア降順 → 同スコアはシャッフル（毎回少し変わる多様性）
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return Math.random() - 0.5
  })

  // スコア0の料理はフィルタしない（タグ未選択の場合も結果を返す）
  const top = scored.slice(0, RESULT_COUNT)

  return { dishes: top }
}
