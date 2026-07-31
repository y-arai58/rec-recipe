export const INGREDIENT_CATEGORIES = [
  "vegetable",
  "meat",
  "seafood",
  "soy",
  "egg",
  "dairy",
  "staple",
  "seasoning",
  "other",
] as const

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number]

/**
 * 店頭での購入単位。
 * にんじんは1本ずつ売っていないし、肉は大容量パックのほうが単価が安い。
 * 「必要な量」ではなく「買える単位」でしか買えないことを表現する。
 */
export type PackOption = {
  /** このパックに入っている量（Ingredient.unit 基準） */
  size: number
  /** 目安価格（円・税込） */
  price: number
  /** 売り場での見え方（"3本入り袋" など） */
  label: string
}

export type Ingredient = {
  id: string
  name: string
  category: IngredientCategory
  /** 分量の単位。"本" "個" "g" "枚" "パック" など */
  unit: string
  /** 購入できるパックの一覧。size 昇順で持つ */
  packs: PackOption[]
  /**
   * 買ってから使い切りたい日数（冷蔵前提）。
   * null は常温で長期保存できるもの（調味料・乾物）。
   */
  shelfLifeDays: number | null
  /** 冷凍すれば日持ちを延ばせるか */
  freezable: boolean
  /** 常備している前提で買い物リストに載せないもの（塩・醤油など） */
  pantry: boolean
}

/** 1皿（2人分）に使う食材と分量 */
export type DishIngredient = {
  ingredientId: string
  /** 2人分の分量。Ingredient.unit 基準 */
  amount: number
}

export type DishIngredients = {
  dishId: string
  items: DishIngredient[]
}
