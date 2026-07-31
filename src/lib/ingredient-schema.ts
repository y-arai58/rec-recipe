import { z } from "zod"
import { INGREDIENT_CATEGORIES } from "@/domain/models/ingredient"

/**
 * data/ingredients.json と data/dish-ingredients.json のスキーマ。
 * `lib/data-schema.ts` と同じ理由で、import してよいのはテストとスクリプトだけ。
 */

const PackOptionSchema = z.object({
  size: z.number().positive(),
  price: z.number().nonnegative(),
  label: z.string(),
})

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(INGREDIENT_CATEGORIES),
  unit: z.string(),
  packs: z.array(PackOptionSchema).min(1),
  shelfLifeDays: z.number().positive().nullable(),
  freezable: z.boolean(),
  pantry: z.boolean(),
})

export const IngredientsDataSchema = z.object({
  ingredients: z.array(IngredientSchema),
})

export const DishIngredientsSchema = z.object({
  dishId: z.string(),
  items: z
    .array(
      z.object({
        ingredientId: z.string(),
        amount: z.number().positive(),
      }),
    )
    .min(1),
})

export const DishIngredientsDataSchema = z.object({
  _comment: z.string().optional(),
  dishIngredients: z.array(DishIngredientsSchema),
})
