import { z } from "zod"
import { TAG_CATEGORIES } from "@/domain/models/tag"

/**
 * data/dishes.json のスキーマ定義。
 *
 * ここを実行時（ブラウザ）で走らせると Zod がクライアントバンドルに載るため、
 * import してよいのはテストとスクリプトだけ。アプリ本体は `lib/data.ts` を使う。
 * 検証は `src/lib/data.test.ts` が CI で担保する。
 */

const TagCategorySchema = z.enum(TAG_CATEGORIES)

/** { "id": string, "name": string, "category": TagCategory } */
export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: TagCategorySchema,
})

/** { "id": string, "name": string, "tagIds": string[], "imageUrl"?: string, "sourceUrl"?: string } */
export const DishSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagIds: z.array(z.string()),
  imageUrl: z.url().optional(),
  sourceUrl: z.url().optional(),
})

/** { "dishes": Dish[], "tags": Tag[] } */
export const DishesDataSchema = z.object({
  dishes: z.array(DishSchema),
  tags: z.array(TagSchema),
})

export type DishesData = z.infer<typeof DishesDataSchema>
