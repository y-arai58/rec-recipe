import type { Ingredient, PackOption } from "@/domain/models/ingredient"

/** 浮動小数の誤差で「あと0.0000001足りない」と判定されないための許容差 */
const EPSILON = 1e-6

export type PurchasedPack = {
  pack: PackOption
  count: number
}

export type PackSelection = {
  packs: PurchasedPack[]
  /** 実際に買う総量 */
  purchasedAmount: number
  totalPrice: number
}

/**
 * 必要量をまかなう最小コストのパック組み合わせを求める。
 *
 * にんじんは1本ずつ売っていないし、肉は大容量パックのほうが単価が安い。
 * 「必要量ちょうど」は買えないので、必要量以上になる組み合わせの中から
 * 合計金額が最小のものを選ぶ（同額なら買いすぎない方）。
 *
 * パックの種類は1〜2程度なので全探索で足りる。
 */
export function choosePacks(ingredient: Ingredient, requiredAmount: number): PackSelection {
  const packs = ingredient.packs
  if (requiredAmount <= EPSILON || packs.length === 0) {
    return { packs: [], purchasedAmount: 0, totalPrice: 0 }
  }

  let best: PackSelection | null = null

  const consider = (counts: number[]) => {
    let purchasedAmount = 0
    let totalPrice = 0
    for (let i = 0; i < packs.length; i++) {
      purchasedAmount += packs[i].size * counts[i]
      totalPrice += packs[i].price * counts[i]
    }
    if (purchasedAmount + EPSILON < requiredAmount) return

    const isBetter =
      best === null ||
      totalPrice < best.totalPrice ||
      (totalPrice === best.totalPrice && purchasedAmount < best.purchasedAmount)
    if (!isBetter) return

    best = {
      packs: packs
        .map((pack, i) => ({ pack, count: counts[i] }))
        .filter((entry) => entry.count > 0),
      purchasedAmount,
      totalPrice,
    }
  }

  // 各パックの最大個数は「それだけで必要量をまかなえる個数」まで見れば十分
  const maxCounts = packs.map((pack) => Math.ceil(requiredAmount / pack.size))

  const walk = (index: number, counts: number[]) => {
    if (index === packs.length) {
      consider(counts)
      return
    }
    for (let count = 0; count <= maxCounts[index]; count++) {
      walk(index + 1, [...counts, count])
    }
  }
  walk(0, [])

  // 必要量が最大パックを超えていても maxCounts で必ず届くので best は埋まる
  return best ?? { packs: [], purchasedAmount: 0, totalPrice: 0 }
}

/** 端数を丸めて表示用にする（0.25 → "0.25"、200 → "200"） */
export function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "")
}
