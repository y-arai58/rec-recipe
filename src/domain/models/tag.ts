export const TAG_CATEGORIES = [
  "genre",
  "volume",
  "base",
  "cookTime",
  "protein",
  "season",
  "role",
] as const

export type TagCategory = (typeof TAG_CATEGORIES)[number]

export type Tag = {
  id: string
  name: string
  category: TagCategory
}

/**
 * 献立の中での役割。1料理に必ず1つ付く。
 * - onedish: 丼・麺・カレーなど、それだけで一食になるもの
 * - main:    主菜（おかず）。ご飯と合わせて一食になるもの
 * - side:    副菜・小鉢。単体では提案せず、メインの付け合わせとして出す
 * - soup:    汁物。同上
 * - staple:  ご飯もの・パンなどの主食。同上
 */
export const DISH_ROLES = ["onedish", "main", "side", "soup", "staple"] as const

export type DishRole = (typeof DISH_ROLES)[number]

export const ROLE_TAG_ID: Record<DishRole, string> = {
  onedish: "tag-role-onedish",
  main: "tag-role-main",
  side: "tag-role-side",
  soup: "tag-role-soup",
  staple: "tag-role-staple",
}

/** メイン料理として単体で提案してよい役割 */
export const MAIN_ROLES: DishRole[] = ["onedish", "main"]

/** メインの付け合わせ（サブ提案）として出す役割 */
export const SIDE_ROLES: DishRole[] = ["side", "soup", "staple"]

const ROLE_BY_TAG_ID = new Map<string, DishRole>(
  DISH_ROLES.map((role) => [ROLE_TAG_ID[role], role]),
)

/** タグID一覧から役割を取り出す。role タグが無い場合は undefined */
export function getRole(tagIds: string[]): DishRole | undefined {
  for (const tagId of tagIds) {
    const role = ROLE_BY_TAG_ID.get(tagId)
    if (role !== undefined) return role
  }
  return undefined
}
