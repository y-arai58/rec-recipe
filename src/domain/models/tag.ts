export const TAG_CATEGORIES = ["genre", "volume", "base", "cookTime", "protein", "season"] as const

export type TagCategory = (typeof TAG_CATEGORIES)[number]

export type Tag = {
  id: string
  name: string
  category: TagCategory
}
