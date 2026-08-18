import { getAllDishesWithTags } from "@/lib/data"
import { getDishIngredients, getIngredientById } from "@/lib/ingredient-data"
import type { PlannableDish } from "./planning"

/** 材料データを持つ料理だけを献立プランナーの候補として返す */
const plannableDishes: PlannableDish[] = getAllDishesWithTags()
  .map((dish) => ({ dish, items: getDishIngredients(dish.id) }))
  .filter((entry) => entry.items.length > 0)

export function getPlannableDishes(): PlannableDish[] {
  return plannableDishes
}

export { getIngredientById }
