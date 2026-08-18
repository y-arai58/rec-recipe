// @vitest-environment node
import { describe, expect, it } from "vitest"
import type { DishWithTags } from "@/domain/models/dish"
import type { Tag, TagCategory } from "@/domain/models/tag"
import { pickSides, slotsFor } from "./pairing"

// ── テスト用フィクスチャ ────────────────────────────────────────────

/** タグIDの接頭辞からカテゴリを決める（tag-genre-japanese → genre） */
const makeTag = (id: string): Tag => ({
  id,
  name: id,
  category: id.split("-")[1] as TagCategory,
})

const makeDish = (id: string, tagIds: string[]): DishWithTags => ({
  id,
  name: id,
  tagIds,
  tags: tagIds.map(makeTag),
})

/** 乱数は結果を固定するため常に0 */
const noRandom = () => 0

const JAPANESE_MAIN = makeDish("焼き魚", [
  "tag-genre-japanese",
  "tag-protein-seafood",
  "tag-role-main",
])

const SIDES: DishWithTags[] = [
  makeDish("おひたし", ["tag-genre-japanese", "tag-protein-vegetable", "tag-role-side"]),
  makeDish("コールスロー", ["tag-genre-western", "tag-protein-vegetable", "tag-role-side"]),
  makeDish("味噌汁", ["tag-genre-japanese", "tag-protein-tofu", "tag-role-soup"]),
  makeDish("コーンスープ", ["tag-genre-western", "tag-protein-vegetable", "tag-role-soup"]),
  makeDish("炊き込みご飯", ["tag-genre-japanese", "tag-protein-chicken", "tag-role-staple"]),
]

// ── テスト ────────────────────────────────────────────────────────

describe("slotsFor", () => {
  it("主菜には副菜と汁物を合わせる", () => {
    expect(slotsFor(JAPANESE_MAIN)).toEqual(["side", "soup"])
  })

  it("サラダが主役のときは主食と汁物を合わせる", () => {
    const saladMain = makeDish("コブサラダ", ["tag-genre-salad", "tag-role-main"])
    expect(slotsFor(saladMain)).toEqual(["staple", "soup"])
  })

  it("サラダうどんのように主食を含む一皿完結ものには主食を足さない", () => {
    const saladNoodle = makeDish("サラダうどん", [
      "tag-genre-salad",
      "tag-base-noodle",
      "tag-role-onedish",
    ])
    expect(slotsFor(saladNoodle)).toEqual(["side", "soup"])
  })
})

describe("pickSides", () => {
  it("役割の枠ごとに1品ずつ、副菜と汁物を返す", () => {
    const sides = pickSides({ main: JAPANESE_MAIN, candidates: SIDES, random: noRandom })

    expect(sides.map((side) => side.role)).toEqual(["side", "soup"])
    expect(sides.map((side) => side.name)).toEqual(["おひたし", "味噌汁"])
  })

  it("ジャンルが揃った付け合わせを優先する", () => {
    const westernMain = makeDish("ハンバーグ", [
      "tag-genre-western",
      "tag-protein-mixed",
      "tag-role-main",
    ])
    const sides = pickSides({ main: westernMain, candidates: SIDES, random: noRandom })

    expect(sides.map((side) => side.name)).toEqual(["コールスロー", "コーンスープ"])
  })

  it("メインとタンパク源がかぶる付け合わせは避ける", () => {
    const tofuMain = makeDish("麻婆豆腐", [
      "tag-genre-japanese",
      "tag-protein-tofu",
      "tag-role-main",
    ])
    const sides = pickSides({ main: tofuMain, candidates: SIDES, random: noRandom })

    // 和食で揃う「味噌汁」は豆腐がかぶるので、コーンスープが選ばれる
    expect(sides.find((side) => side.role === "soup")?.name).toBe("コーンスープ")
  })

  it("excludeIds に入っている料理は選ばない", () => {
    const sides = pickSides({
      main: JAPANESE_MAIN,
      candidates: SIDES,
      excludeIds: ["おひたし", "味噌汁"],
      random: noRandom,
    })

    expect(sides.map((side) => side.name)).toEqual(["コールスロー", "コーンスープ"])
  })

  it("枠を埋められる候補がなければその枠を飛ばす", () => {
    const soupOnly = SIDES.filter((dish) => dish.tagIds.includes("tag-role-soup"))
    const sides = pickSides({ main: JAPANESE_MAIN, candidates: soupOnly, random: noRandom })

    expect(sides).toHaveLength(1)
    expect(sides[0].role).toBe("soup")
  })

  it("季節タグが一致する付け合わせを優先する", () => {
    const candidates = [
      makeDish("冷奴", ["tag-genre-japanese", "tag-season-summer", "tag-role-side"]),
      makeDish("きんぴら", ["tag-genre-japanese", "tag-role-side"]),
    ]
    const sides = pickSides({
      main: JAPANESE_MAIN,
      candidates,
      seasonTagIds: ["tag-season-summer"],
      random: noRandom,
    })

    expect(sides[0].name).toBe("冷奴")
  })
})
