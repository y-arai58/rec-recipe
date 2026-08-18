import type { Tag } from "@/domain/models/tag"

export type RecommendedDish = {
  id: string
  name: string
  tags: Tag[]
  score: number
  /** 選択条件と一致したタグID。DishCard で強調表示する */
  matchedTagIds: string[]
}

export type RecommendResult = {
  dishes: RecommendedDish[]
  /** 条件を1つも選ばなかった場合 true（結果は実質ランダム） */
  isRandom: boolean
  /** 加点に使った季節の表示名（"夏" など） */
  seasonLabel: string
}
