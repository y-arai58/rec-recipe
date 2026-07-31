// @vitest-environment node
import { describe, expect, it } from "vitest"
import type { Ingredient } from "@/domain/models/ingredient"
import { choosePacks, formatAmount } from "./shopping"

const carrot: Ingredient = {
  id: "ing-carrot",
  name: "にんじん",
  category: "vegetable",
  unit: "本",
  packs: [
    { size: 1, price: 80, label: "1本" },
    { size: 3, price: 180, label: "3本入り袋" },
  ],
  shelfLifeDays: 21,
  freezable: true,
  pantry: false,
}

const chicken: Ingredient = {
  id: "ing-chicken-thigh",
  name: "鶏もも肉",
  category: "meat",
  unit: "g",
  packs: [
    { size: 300, price: 450, label: "300gパック" },
    { size: 600, price: 780, label: "600g 大容量パック" },
  ],
  shelfLifeDays: 2,
  freezable: true,
  pantry: false,
}

const moyashi: Ingredient = {
  id: "ing-moyashi",
  name: "もやし",
  category: "vegetable",
  unit: "袋",
  packs: [{ size: 1, price: 40, label: "1袋" }],
  shelfLifeDays: 2,
  freezable: false,
  pantry: false,
}

describe("choosePacks", () => {
  it("必要量が0なら何も買わない", () => {
    const result = choosePacks(carrot, 0)
    expect(result.packs).toEqual([])
    expect(result.totalPrice).toBe(0)
  })

  it("1本ずつ買えない食材でも必要量を満たすまで買う", () => {
    // なす: 3本入り袋しかないので1本必要でも1袋
    const nasu: Ingredient = {
      ...carrot,
      id: "ing-nasu",
      name: "なす",
      packs: [{ size: 3, price: 200, label: "3本入り袋" }],
    }
    const result = choosePacks(nasu, 1)
    expect(result.purchasedAmount).toBe(3)
    expect(result.totalPrice).toBe(200)
  })

  it("少量なら小さいパックを選ぶ", () => {
    const result = choosePacks(carrot, 1)
    expect(result.purchasedAmount).toBe(1)
    expect(result.totalPrice).toBe(80)
  })

  it("量がまとまると大容量パックのほうが安くなる", () => {
    // 3本: 1本×3 = 240円 より 3本入り袋 180円が安い
    const result = choosePacks(carrot, 3)
    expect(result.totalPrice).toBe(180)
    expect(result.packs).toHaveLength(1)
    expect(result.packs[0].pack.label).toBe("3本入り袋")
  })

  it("大容量パックと小分けパックを組み合わせる", () => {
    // 700g: 600g(780) + 300g(450) = 1230 が 300g×3 = 1350 より安い
    const result = choosePacks(chicken, 700)
    expect(result.totalPrice).toBe(1230)
    expect(result.purchasedAmount).toBe(900)
  })

  it("必要量が中途半端でも必ず上回る量を買う", () => {
    const result = choosePacks(chicken, 350)
    expect(result.purchasedAmount).toBeGreaterThanOrEqual(350)
  })

  it("同じ金額なら買いすぎない組み合わせを選ぶ", () => {
    // 600g ちょうど: 600gパック(780) vs 300g×2(900) → 780を選ぶ
    const result = choosePacks(chicken, 600)
    expect(result.purchasedAmount).toBe(600)
    expect(result.totalPrice).toBe(780)
  })

  it("パックが1種類なら必要数だけ買う", () => {
    const result = choosePacks(moyashi, 3)
    expect(result.packs[0].count).toBe(3)
    expect(result.totalPrice).toBe(120)
  })

  it("小数の必要量でも不足しない", () => {
    const cabbage: Ingredient = {
      ...carrot,
      id: "ing-cabbage",
      name: "キャベツ",
      unit: "個",
      packs: [
        { size: 0.5, price: 130, label: "1/2個" },
        { size: 1, price: 220, label: "1個" },
      ],
    }
    const result = choosePacks(cabbage, 0.75)
    expect(result.purchasedAmount).toBeGreaterThanOrEqual(0.75)
    expect(result.totalPrice).toBe(220)
  })
})

describe("formatAmount", () => {
  it("整数はそのまま出す", () => {
    expect(formatAmount(3)).toBe("3")
    expect(formatAmount(200)).toBe("200")
  })

  it("小数は丸めて出す", () => {
    expect(formatAmount(0.25)).toBe("0.25")
    expect(formatAmount(0.5)).toBe("0.5")
  })
})
