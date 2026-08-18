import type { DishWithTags } from "@/domain/models/dish"
import { type DishRole, getRole } from "@/domain/models/tag"

/** メイン1品につけるサブ提案の数 */
const SIDE_LIMIT = 2

/** 献立での役割の表示名。付け合わせのラベルに使う */
export const ROLE_LABEL: Record<DishRole, string> = {
  onedish: "一皿で完結",
  main: "主菜",
  side: "副菜",
  soup: "汁物",
  staple: "主食",
}

export type SuggestedSide = {
  id: string
  name: string
  role: DishRole
  roleLabel: string
}

export type PairingOptions = {
  /** 付け合わせを付ける対象のメイン料理 */
  main: DishWithTags
  /** 付け合わせの候補（side / soup / staple の料理） */
  candidates: DishWithTags[]
  /** 実行時の季節タグ。メインと同じ基準で少し加点する */
  seasonTagIds?: string[]
  /** 同じ提案リスト内で既に使った付け合わせ。重複を避ける */
  excludeIds?: string[]
  /** 同スコアの並びをばらす乱数源。テストでは固定値を渡せる */
  random?: () => number
}

// スコアの重み
/** メインとジャンルが揃っていること（和食の主菜に和の副菜） */
const WEIGHT_GENRE = 2
/** 季節タグの一致 */
const WEIGHT_SEASON = 1
/** メインとタンパク源がかぶること。肉の隣にまた肉を置かない */
const WEIGHT_SAME_PROTEIN = -3
/** 付け合わせは手早く作れるほうがよい */
const WEIGHT_QUICK = 1
/** ボリュームのあるメインには軽い副菜を合わせる */
const WEIGHT_LIGHT_WITH_HEARTY = 1
/** 同スコアの並びをばらすための微小なゆらぎ */
const TIE_BREAK_SCALE = 0.01

function tagIdsOfCategory(dish: DishWithTags, category: string): string[] {
  return dish.tags.filter((tag) => tag.category === category).map((tag) => tag.id)
}

/**
 * メインの役割に応じて、埋めたい付け合わせの枠を返す。
 * - サラダが主役のときは炭水化物が足りないので主食を足す
 *   （ただしサラダうどんのような一皿完結ものは主食を持っているので除く）
 * - それ以外は「副菜 + 汁物」。丼・麺も汁物と小鉢があると献立になる
 */
export function slotsFor(main: DishWithTags): DishRole[] {
  const isSaladMain = main.tagIds.includes("tag-genre-salad") && getRole(main.tagIds) !== "onedish"
  if (isSaladMain) return ["staple", "soup"]
  return ["side", "soup"]
}

function scoreSide(
  main: DishWithTags,
  candidate: DishWithTags,
  seasonTagIds: string[],
  random: () => number,
): number {
  const mainGenres = new Set(tagIdsOfCategory(main, "genre"))
  const mainProteins = new Set(tagIdsOfCategory(main, "protein"))
  const seasonSet = new Set(seasonTagIds)

  let score = 0

  if (tagIdsOfCategory(candidate, "genre").some((id) => mainGenres.has(id))) {
    score += WEIGHT_GENRE
  }
  if (candidate.tagIds.some((id) => seasonSet.has(id))) {
    score += WEIGHT_SEASON
  }
  // 「なし」は情報がないので、かぶりとは見なさない
  if (
    tagIdsOfCategory(candidate, "protein").some(
      (id) => id !== "tag-protein-none" && mainProteins.has(id),
    )
  ) {
    score += WEIGHT_SAME_PROTEIN
  }
  if (candidate.tagIds.includes("tag-cooktime-under15")) {
    score += WEIGHT_QUICK
  }
  if (main.tagIds.includes("tag-volume-hearty") && candidate.tagIds.includes("tag-volume-light")) {
    score += WEIGHT_LIGHT_WITH_HEARTY
  }

  return score + random() * TIE_BREAK_SCALE
}

/**
 * メイン料理に合う付け合わせを、役割の枠ごとに1品ずつ選ぶ。
 * 枠を埋められる候補がなければその枠は飛ばすので、戻り値は 0〜2 件。
 */
export function pickSides(options: PairingOptions): SuggestedSide[] {
  const { main, candidates, seasonTagIds = [], excludeIds = [], random = Math.random } = options

  const used = new Set(excludeIds)
  const picked: SuggestedSide[] = []

  for (const slot of slotsFor(main)) {
    if (picked.length >= SIDE_LIMIT) break

    const best = candidates
      .filter((dish) => getRole(dish.tagIds) === slot && !used.has(dish.id))
      .map((dish) => ({ dish, score: scoreSide(main, dish, seasonTagIds, random) }))
      .sort((a, b) => b.score - a.score)[0]

    if (best === undefined) continue

    used.add(best.dish.id)
    picked.push({
      id: best.dish.id,
      name: best.dish.name,
      role: slot,
      roleLabel: ROLE_LABEL[slot],
    })
  }

  return picked
}
