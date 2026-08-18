// @vitest-environment node
import { describe, expect, it } from "vitest"
import type { DishWithTags } from "@/domain/models/dish"
import type { Tag } from "@/domain/models/tag"
import { scoreDishes } from "./scoring"

// ── テスト用フィクスチャ ────────────────────────────────────────────

const makeTag = (id: string, category: Tag["category"] = "genre"): Tag => ({
  id,
  name: id,
  category,
})

const makeDish = (id: string, tagIds: string[]): DishWithTags => ({
  id,
  name: `dish-${id}`,
  tagIds,
  tags: tagIds.map((t) => makeTag(t)),
})

const DISHES: DishWithTags[] = [
  makeDish("d1", ["tag-a", "tag-b", "tag-c"]),
  makeDish("d2", ["tag-a", "tag-b"]),
  makeDish("d3", ["tag-a"]),
  makeDish("d4", ["tag-x", "tag-y"]),
  makeDish("d5", []),
  makeDish("d6", ["tag-a", "tag-b", "tag-c", "tag-d"]),
]

// ── テスト ────────────────────────────────────────────────────────

describe("scoreDishes", () => {
  it("一致タグ数が多い料理が先に来る", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a", "tag-b", "tag-c"],
      dishes: DISHES,
    })

    // d6(4タグ中3一致=3), d1(3/3=3), d2(2), d3(1), d4(0), d5(0) の順
    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score)
    expect(result[1].score).toBeGreaterThanOrEqual(result[2].score)

    const top2Ids = new Set([result[0].id, result[1].id])
    expect(top2Ids.has("d1") || top2Ids.has("d6")).toBe(true)
  })

  it("selectedTagIds が空でも limit 件返る", () => {
    const result = scoreDishes({
      selectedTagIds: [],
      dishes: DISHES,
      limit: 3,
    })
    expect(result).toHaveLength(3)
    expect(result.every((d) => d.score === 0)).toBe(true)
  })

  it("limit パラメータが効く", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a"],
      dishes: DISHES,
      limit: 2,
    })
    expect(result).toHaveLength(2)
  })

  it("dishes が limit より少ない場合は全件返る", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a"],
      dishes: DISHES.slice(0, 2),
      limit: 10,
    })
    expect(result).toHaveLength(2)
  })

  it("excludeIds の料理は結果に含まれない", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a", "tag-b", "tag-c"],
      dishes: DISHES,
      excludeIds: ["d1", "d6"],
    })
    const ids = result.map((d) => d.id)
    expect(ids).not.toContain("d1")
    expect(ids).not.toContain("d6")
  })

  it("excludeIds で全件除外した場合は空配列を返す", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a"],
      dishes: DISHES.slice(0, 1),
      excludeIds: ["d1"],
    })
    expect(result).toHaveLength(0)
  })

  it("score フィールドが正しく設定される", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a", "tag-b"],
      dishes: [makeDish("x", ["tag-a", "tag-b", "tag-c"])],
      limit: 1,
    })
    expect(result[0].score).toBe(2)
  })

  it("返り値は元の DishWithTags プロパティを含む", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a"],
      dishes: [makeDish("z", ["tag-a"])],
      limit: 1,
    })
    const dish = result[0]
    expect(dish.id).toBe("z")
    expect(dish.name).toBe("dish-z")
    expect(dish.tags).toHaveLength(1)
  })

  it("matchedTagIds は選択条件と一致したタグだけを含む", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-a", "tag-c", "tag-zzz"],
      dishes: [makeDish("x", ["tag-a", "tag-b", "tag-c"])],
      limit: 1,
    })
    expect(result[0].matchedTagIds).toEqual(["tag-a", "tag-c"])
    expect(result[0].score).toBe(2)
  })

  it("一致タグが無い場合 matchedTagIds は空配列", () => {
    const result = scoreDishes({
      selectedTagIds: ["tag-none"],
      dishes: [makeDish("x", ["tag-a"])],
      limit: 1,
    })
    expect(result[0].matchedTagIds).toEqual([])
  })

  it("random を固定すると同じ入力で同じ順序を返す", () => {
    const fixedRandom = () => 0.5
    const run = () =>
      scoreDishes({ selectedTagIds: ["tag-a"], dishes: DISHES, random: fixedRandom }).map(
        (d) => d.id,
      )

    expect(run()).toEqual(run())
  })

  it("スコアの並びは乱数に影響されない", () => {
    // シャッフルキーが降順になるような乱数を与えてもスコア順は保たれる
    let n = 0
    const result = scoreDishes({
      selectedTagIds: ["tag-a", "tag-b", "tag-c"],
      dishes: DISHES,
      random: () => {
        n += 1
        return 1 / n
      },
    })

    const scores = result.map((d) => d.score)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })

  it("提示済みを除外して呼び直すと重複しない次の候補が出る", () => {
    const first = scoreDishes({ selectedTagIds: ["tag-a"], dishes: DISHES, limit: 2 })
    const seen = first.map((d) => d.id)
    const second = scoreDishes({
      selectedTagIds: ["tag-a"],
      dishes: DISHES,
      excludeIds: seen,
      limit: 2,
    })

    expect(second).toHaveLength(2)
    for (const dish of second) {
      expect(seen).not.toContain(dish.id)
    }
  })
})
