import type { DishIngredients, Ingredient } from "@/domain/models/ingredient"
import rawDishIngredients from "../../data/dish-ingredients.json"
import rawIngredients from "../../data/ingredients.json"

/**
 * 食材マスターと料理別材料へのアクセス層。
 * `lib/data.ts` と同様、実行時の検証は行わない（`ingredient-data.test.ts` が担保）。
 */

const ingredients = (rawIngredients as { ingredients: Ingredient[] }).ingredients
const dishIngredients = (rawDishIngredients as { dishIngredients: DishIngredients[] })
  .dishIngredients

const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]))
const itemsByDishId = new Map(dishIngredients.map((entry) => [entry.dishId, entry.items]))

export function getAllIngredients(): Ingredient[] {
  return ingredients
}

export function getIngredientById(id: string): Ingredient | undefined {
  return ingredientById.get(id)
}

/** 料理IDに紐づく材料（2人分）。材料データが無い料理は空配列 */
export function getDishIngredients(dishId: string): DishIngredients["items"] {
  return itemsByDishId.get(dishId) ?? []
}

/** 材料データを持つ料理IDの集合。献立プランナーの候補になる */
export function getPlannableDishIds(): Set<string> {
  return new Set(itemsByDishId.keys())
}
