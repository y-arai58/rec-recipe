import Link from "next/link"
import { TagBadge } from "@/components/ui/tag-badge"
import type { TagCategory } from "@/domain/models/tag"
import type { RecommendedDish } from "../types"

const DISPLAY_TAG_LIMIT = 5

type Props = {
  dish: RecommendedDish
}

export function DishCard({ dish }: Props) {
  const matchedSet = new Set(dish.matchedTagIds)

  // 一致したタグを先頭に寄せる。「なぜ選ばれたか」が一目で分かるようにするため
  const orderedTags = [
    ...dish.tags.filter((tag) => matchedSet.has(tag.id)),
    ...dish.tags.filter((tag) => !matchedSet.has(tag.id)),
  ]
  const visibleTags = orderedTags.slice(0, DISPLAY_TAG_LIMIT)

  return (
    // 付け合わせも個別にリンクするため、カード全体はリンクにしない（a のネストは不正）
    <div className="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <Link href={`/dishes/${dish.id}`} className="group block px-5 py-4 hover:bg-accent/30">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
            {dish.name}
          </h3>
          <span className="shrink-0 text-muted-foreground" aria-hidden>
            →
          </span>
        </div>

        {dish.score > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">条件が {dish.score} つ一致</p>
        )}

        {visibleTags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <TagBadge
                key={tag.id}
                category={tag.category as TagCategory}
                label={tag.name}
                matched={matchedSet.has(tag.id)}
              />
            ))}
          </div>
        )}
      </Link>

      {dish.sides.length > 0 && (
        <div className="border-t border-border px-5 py-3">
          <p className="text-xs font-medium text-muted-foreground">合わせるなら</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dish.sides.map((side) => (
              <li key={side.id}>
                <Link
                  href={`/dishes/${side.id}`}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-accent"
                >
                  <span className="text-xs text-muted-foreground">{side.roleLabel}</span>
                  {side.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
