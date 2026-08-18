// @vitest-environment node
import { describe, expect, it } from "vitest"
import { DISH_ROLES, getRole, ROLE_TAG_ID } from "@/domain/models/tag"
import rawData from "../../data/dishes.json"
import { getAllDishes, getAllDishesWithTags, getAllTags, getDishWithTags } from "./data"
import { DishesDataSchema } from "./data-schema"

/**
 * `lib/data.ts` は実行時に Zod を通さない（クライアントバンドルを軽くするため）。
 * data/dishes.json がスキーマを満たすことはこのテストで担保する。
 */
describe("data/dishes.json", () => {
  it("スキーマを満たす", () => {
    expect(() => DishesDataSchema.parse(rawData)).not.toThrow()
  })

  it("料理IDが重複していない", () => {
    const ids = getAllDishes().map((dish) => dish.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("タグIDが重複していない", () => {
    const ids = getAllTags().map((tag) => tag.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("料理が参照するタグIDはすべてタグマスターに存在する", () => {
    const known = new Set(getAllTags().map((tag) => tag.id))
    const unknown = getAllDishes().flatMap((dish) =>
      dish.tagIds.filter((tagId) => !known.has(tagId)),
    )
    expect(unknown).toEqual([])
  })

  it("すべての料理にタグが1つ以上付いている", () => {
    const untagged = getAllDishes().filter((dish) => dish.tagIds.length === 0)
    expect(untagged).toEqual([])
  })

  it("すべての料理に role タグがちょうど1つ付いている", () => {
    const roleTagIds = new Set(DISH_ROLES.map((role) => ROLE_TAG_ID[role]))
    const broken = getAllDishes()
      .map((dish) => ({
        name: dish.name,
        roles: dish.tagIds.filter((tagId) => roleTagIds.has(tagId)),
      }))
      .filter((entry) => entry.roles.length !== 1)
    expect(broken).toEqual([])
  })

  it("メインとして提案できる料理と、付け合わせの候補が両方ある", () => {
    const roles = getAllDishes().map((dish) => getRole(dish.tagIds))
    // どちらかが空だとレコメンドが成立しない
    expect(roles.filter((role) => role === "onedish" || role === "main").length).toBeGreaterThan(0)
    expect(roles.filter((role) => role === "side").length).toBeGreaterThan(0)
    expect(roles.filter((role) => role === "soup").length).toBeGreaterThan(0)
    expect(roles.filter((role) => role === "staple").length).toBeGreaterThan(0)
  })
})

describe("data access", () => {
  it("getAllDishesWithTags は tagIds と同数のタグを解決する", () => {
    for (const dish of getAllDishesWithTags()) {
      expect(dish.tags).toHaveLength(dish.tagIds.length)
    }
  })

  it("getAllDishesWithTags は毎回同じ配列を返す（再計算しない）", () => {
    expect(getAllDishesWithTags()).toBe(getAllDishesWithTags())
  })

  it("getDishWithTags は存在しないIDに undefined を返す", () => {
    expect(getDishWithTags("dish-does-not-exist")).toBeUndefined()
  })
})
