import { z } from "zod"
import type { Dish, DishWithTags } from "@/domain/models/dish"
import type { Tag } from "@/domain/models/tag"
import { TAG_CATEGORIES } from "@/domain/models/tag"
import rawData from "../../data/dishes.json"

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const TagCategorySchema = z.enum(TAG_CATEGORIES)

/**
 * dishes.json の Tag エントリのスキーマ
 * { "id": string, "name": string, "category": TagCategory }
 */
const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: TagCategorySchema,
})

/**
 * dishes.json の Dish エントリのスキーマ
 * { "id": string, "name": string, "tagIds": string[], "imageUrl"?: string, "sourceUrl"?: string }
 */
const DishSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagIds: z.array(z.string()),
  imageUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
})

/**
 * dishes.json 全体のスキーマ
 * { "dishes": Dish[], "tags": Tag[] }
 */
const DishesDataSchema = z.object({
  dishes: z.array(DishSchema),
  tags: z.array(TagSchema),
})

// ---------------------------------------------------------------------------
// Parsed data (validated at module load time)
// ---------------------------------------------------------------------------

const parsedData = DishesDataSchema.parse(rawData)

// ---------------------------------------------------------------------------
// Data access utilities
// ---------------------------------------------------------------------------

export function getAllDishes(): Dish[] {
  return parsedData.dishes
}

export function getAllTags(): Tag[] {
  return parsedData.tags
}

export function getDishById(id: string): Dish | undefined {
  return parsedData.dishes.find((dish) => dish.id === id)
}

export function getDishWithTags(id: string): DishWithTags | undefined {
  const dish = getDishById(id)
  if (!dish) return undefined

  const tagMap = new Map(parsedData.tags.map((tag) => [tag.id, tag]))
  const tags = dish.tagIds
    .map((tagId) => tagMap.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined)

  return { ...dish, tags }
}

export function getAllDishesWithTags(): DishWithTags[] {
  const tagMap = new Map(parsedData.tags.map((tag) => [tag.id, tag]))
  return parsedData.dishes.map((dish) => {
    const tags = dish.tagIds
      .map((tagId) => tagMap.get(tagId))
      .filter((tag): tag is Tag => tag !== undefined)
    return { ...dish, tags }
  })
}
