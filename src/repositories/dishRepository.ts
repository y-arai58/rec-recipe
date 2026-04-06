import type { DishWithTags } from "@/domain/models/dish"
import { getAllDishes, getDishWithTags } from "@/lib/data"

/** 全料理の ID 一覧を返す */
export function getAllDishIds(): string[] {
  return getAllDishes().map((d) => d.id)
}

/** ID で料理（タグ付き）を取得する。存在しない場合は undefined */
export function findDishById(id: string): DishWithTags | undefined {
  return getDishWithTags(id)
}
