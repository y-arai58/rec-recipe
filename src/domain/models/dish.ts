import type { Tag } from "./tag"

export type Dish = {
  id: string
  name: string
  tagIds: string[]
  imageUrl?: string
  sourceUrl?: string
}

export type DishWithTags = Dish & {
  tags: Tag[]
}
