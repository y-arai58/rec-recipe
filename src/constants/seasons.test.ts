// @vitest-environment node
import { describe, expect, it } from "vitest"
import { getSeason, getSeasonTagIds } from "./seasons"

describe("getSeason", () => {
  it("月から季節を判定する", () => {
    expect(getSeason(3)).toBe("spring")
    expect(getSeason(5)).toBe("spring")
    expect(getSeason(6)).toBe("summer")
    expect(getSeason(8)).toBe("summer")
    expect(getSeason(9)).toBe("autumn")
    expect(getSeason(11)).toBe("autumn")
  })

  it("12月・1月・2月は冬", () => {
    expect(getSeason(12)).toBe("winter")
    expect(getSeason(1)).toBe("winter")
    expect(getSeason(2)).toBe("winter")
  })
})

describe("getSeasonTagIds", () => {
  it("夏はさっぱり系を併せて優先する", () => {
    expect(getSeasonTagIds(7)).toEqual(["tag-season-summer", "tag-season-refreshing"])
  })

  it("冬は温かい系を併せて優先する", () => {
    expect(getSeasonTagIds(1)).toEqual(["tag-season-winter", "tag-season-warm"])
  })

  it("春秋は季節タグのみ", () => {
    expect(getSeasonTagIds(4)).toEqual(["tag-season-spring"])
    expect(getSeasonTagIds(10)).toEqual(["tag-season-autumn"])
  })

  it("通年タグは含めない", () => {
    for (const month of [1, 4, 7, 10]) {
      expect(getSeasonTagIds(month)).not.toContain("tag-season-yearround")
    }
  })
})
