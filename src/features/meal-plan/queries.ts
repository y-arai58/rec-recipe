import { getRole, MAIN_ROLES } from "@/domain/models/tag"
import { getAllDishesWithTags } from "@/lib/data"
import { getDishIngredients, getIngredientById } from "@/lib/ingredient-data"
import type { PlannableDish } from "./planning"

const MAIN_ROLE_SET = new Set(MAIN_ROLES)

/**
 * 献立プランナーの候補。
 * 材料データを持ち、かつメインになる料理（丼・麺などの一皿完結 or 主菜）だけを使う。
 * 副菜・汁物・主食はその日の主役にはならない。
 */
const plannableDishes: PlannableDish[] = getAllDishesWithTags()
  .filter((dish) => {
    const role = getRole(dish.tagIds)
    return role !== undefined && MAIN_ROLE_SET.has(role)
  })
  .map((dish) => ({ dish, items: getDishIngredients(dish.id) }))
  .filter((entry) => entry.items.length > 0)

export function getPlannableDishes(): PlannableDish[] {
  return plannableDishes
}

export { getIngredientById }
