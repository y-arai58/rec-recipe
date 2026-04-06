import { unstable_cache } from "next/cache"
import type { DishWithTags } from "@/domain/models/dish"
import { getAllDishesWithTags } from "@/lib/data"

const getCachedDishes = unstable_cache(
  async (): Promise<DishWithTags[]> => getAllDishesWithTags(),
  ["dishes-for-recommend"],
)

/** features 層からタグ付き全料理を取得する（キャッシュ済み）。 */
export async function getDishesForRecommend(): Promise<DishWithTags[]> {
  return getCachedDishes()
}
