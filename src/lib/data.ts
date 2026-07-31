import type { Dish, DishWithTags } from "@/domain/models/dish"
import type { Tag } from "@/domain/models/tag"
import rawData from "../../data/dishes.json"

/**
 * data/dishes.json へのアクセス層。
 *
 * このモジュールは Client Component からも読まれるため、実行時の検証は行わない。
 * Zod を module scope で走らせるとスキーマ定義ごとクライアントバンドルに載ってしまう。
 * JSON がスキーマを満たすことは `data.test.ts`（CI で実行）が保証する。
 */

type DishesData = {
  dishes: Dish[]
  tags: Tag[]
}

const data = rawData as DishesData

// タグ結合は何度呼んでも同じ結果になるため、モジュール読み込み時に1回だけ組み立てる
const tagMap = new Map(data.tags.map((tag) => [tag.id, tag]))

function withTags(dish: Dish): DishWithTags {
  const tags = dish.tagIds
    .map((tagId) => tagMap.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined)
  return { ...dish, tags }
}

const dishesWithTags: DishWithTags[] = data.dishes.map(withTags)
const dishWithTagsById = new Map(dishesWithTags.map((dish) => [dish.id, dish]))

// ---------------------------------------------------------------------------
// Data access utilities
// ---------------------------------------------------------------------------

export function getAllDishes(): Dish[] {
  return data.dishes
}

export function getAllTags(): Tag[] {
  return data.tags
}

export function getDishById(id: string): Dish | undefined {
  return dishWithTagsById.get(id)
}

export function getDishWithTags(id: string): DishWithTags | undefined {
  return dishWithTagsById.get(id)
}

export function getAllDishesWithTags(): DishWithTags[] {
  return dishesWithTags
}
