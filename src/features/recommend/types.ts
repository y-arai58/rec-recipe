import type { Tag } from "@/domain/models/tag"

export type RecommendedDish = {
  id: string
  name: string
  tags: Tag[]
  score: number
}

export type RecommendResult = {
  dishes: RecommendedDish[]
}
