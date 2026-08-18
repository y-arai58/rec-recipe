import type { DishWithTags } from "@/domain/models/dish"
import type { Ingredient } from "@/domain/models/ingredient"
import type { PurchasedPack } from "./shopping"

export type PlannedIngredient = {
  ingredient: Ingredient
  amount: number
}

export type PlannedDay = {
  /** 1日目 = 1 */
  day: number
  dish: DishWithTags
  /** その日に使う材料（常備品を除く） */
  ingredients: PlannedIngredient[]
}

export type ShoppingItem = {
  ingredient: Ingredient
  /** 献立を作るのに必要な量 */
  requiredAmount: number
  /** パック単位でしか買えないため実際に買う量 */
  purchasedAmount: number
  packs: PurchasedPack[]
  totalPrice: number
  /** 使い切れずに残る量 */
  leftoverAmount: number
  /** この食材を最後に使う日（1始まり） */
  lastUsedDay: number
}

export const SPOILAGE_KINDS = ["spoilage", "leftover"] as const
export type SpoilageKind = (typeof SPOILAGE_KINDS)[number]

export type StorageAlert = {
  kind: SpoilageKind
  ingredient: Ingredient
  /** spoilage: 何日目に使う予定か */
  lastUsedDay: number
  /** leftover: 何単位余るか */
  leftoverAmount: number
  message: string
}

export type MealPlan = {
  days: PlannedDay[]
  shoppingList: ShoppingItem[]
  /** 買い物リストから外した常備品 */
  pantryIngredients: Ingredient[]
  totalPrice: number
  alerts: StorageAlert[]
  /** 何人分で計算したか */
  servings: number
}
