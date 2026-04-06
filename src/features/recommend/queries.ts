import type { DishWithTags } from "@/domain/models/dish"
import { getAllDishesWithTags } from "@/lib/data"

/** features 層からタグ付き全料理を取得する。将来的なキャッシュ差し込み口。 */
export function getDishesForRecommend(): DishWithTags[] {
  return getAllDishesWithTags()
}
