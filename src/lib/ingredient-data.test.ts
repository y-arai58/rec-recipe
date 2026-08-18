// @vitest-environment node
import { describe, expect, it } from "vitest"
import rawDishIngredients from "../../data/dish-ingredients.json"
import rawIngredients from "../../data/ingredients.json"
import { getAllDishes } from "./data"
import {
  getAllIngredients,
  getDishIngredients,
  getIngredientById,
  getPlannableDishIds,
} from "./ingredient-data"
import { DishIngredientsDataSchema, IngredientsDataSchema } from "./ingredient-schema"

describe("data/ingredients.json", () => {
  it("スキーマを満たす", () => {
    expect(() => IngredientsDataSchema.parse(rawIngredients)).not.toThrow()
  })

  it("食材IDが重複していない", () => {
    const ids = getAllIngredients().map((ingredient) => ingredient.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("packs は size の昇順で並んでいる", () => {
    for (const ingredient of getAllIngredients()) {
      const sizes = ingredient.packs.map((pack) => pack.size)
      expect(sizes).toEqual([...sizes].sort((a, b) => a - b))
    }
  })

  it("大きいパックほど単価が安い", () => {
    for (const ingredient of getAllIngredients()) {
      const unitPrices = ingredient.packs.map((pack) => pack.price / pack.size)
      for (let i = 1; i < unitPrices.length; i++) {
        expect(unitPrices[i]).toBeLessThanOrEqual(unitPrices[i - 1])
      }
    }
  })

  it("常温保存でない食材には日持ちが設定されている", () => {
    const perishableCategories = new Set(["vegetable", "meat", "seafood", "soy", "egg", "dairy"])
    for (const ingredient of getAllIngredients()) {
      if (perishableCategories.has(ingredient.category)) {
        expect(ingredient.shelfLifeDays).not.toBeNull()
      }
    }
  })
})

describe("data/dish-ingredients.json", () => {
  it("スキーマを満たす", () => {
    expect(() => DishIngredientsDataSchema.parse(rawDishIngredients)).not.toThrow()
  })

  it("料理IDが重複していない", () => {
    const ids = [...getPlannableDishIds()]
    expect(ids.length).toBe(rawDishIngredients.dishIngredients.length)
  })

  it("参照している料理IDはすべて dishes.json に存在する", () => {
    const known = new Set(getAllDishes().map((dish) => dish.id))
    const unknown = [...getPlannableDishIds()].filter((dishId) => !known.has(dishId))
    expect(unknown).toEqual([])
  })

  it("参照している食材IDはすべて食材マスターに存在する", () => {
    const unknown: string[] = []
    for (const dishId of getPlannableDishIds()) {
      for (const item of getDishIngredients(dishId)) {
        if (getIngredientById(item.ingredientId) === undefined) {
          unknown.push(`${dishId}:${item.ingredientId}`)
        }
      }
    }
    expect(unknown).toEqual([])
  })

  it("各料理に常備品でない材料が1つ以上ある", () => {
    for (const dishId of getPlannableDishIds()) {
      const shoppable = getDishIngredients(dishId).filter(
        (item) => getIngredientById(item.ingredientId)?.pantry === false,
      )
      expect(shoppable.length).toBeGreaterThan(0)
    }
  })

  it("同じ料理の中で同じ食材を2回書いていない", () => {
    for (const dishId of getPlannableDishIds()) {
      const ids = getDishIngredients(dishId).map((item) => item.ingredientId)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it("材料データを持たない料理は空配列を返す", () => {
    expect(getDishIngredients("dish-does-not-exist")).toEqual([])
  })
})
