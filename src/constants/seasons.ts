/**
 * 季節タグの自動付与。
 *
 * season タグは 224件中 183件が「通年」で、質問にしてもほとんど絞り込めない。
 * そのため質問では聞かず、実行時の月から季節タグを足して弱い加点として効かせる。
 * 「通年」は付けない（大半の料理に一律で加点され、順位が動かなくなるため）。
 */

export type Season = "spring" | "summer" | "autumn" | "winter"

export const SEASON_LABEL: Record<Season, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
}

/** 月（1〜12）から季節を判定する */
export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "autumn"
  return "winter"
}

/**
 * その季節に加点するタグID。
 * 夏は「さっぱり系」、冬は「温かい系」を併せて優先する。
 */
export function getSeasonTagIds(month: number): string[] {
  const season = getSeason(month)
  const tagIds = [`tag-season-${season}`]

  if (season === "summer") tagIds.push("tag-season-refreshing")
  if (season === "winter") tagIds.push("tag-season-warm")

  return tagIds
}
