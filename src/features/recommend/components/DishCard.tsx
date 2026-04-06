import Link from "next/link"
import { TagBadge } from "@/components/ui/tag-badge"
import type { TagCategory } from "@/domain/models/tag"
import type { RecommendedDish } from "../types"

const DISPLAY_TAG_LIMIT = 5

type Props = {
  dish: RecommendedDish
}

export function DishCard({ dish }: Props) {
  const visibleTags = dish.tags.slice(0, DISPLAY_TAG_LIMIT)

  return (
    <Link
      href={`/dishes/${dish.id}`}
      className="group block rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40 hover:bg-accent/30"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
          {dish.name}
        </h3>
        <span className="shrink-0 text-muted-foreground" aria-hidden>
          →
        </span>
      </div>
      {visibleTags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <TagBadge key={tag.id} category={tag.category as TagCategory} label={tag.name} />
          ))}
        </div>
      )}
    </Link>
  )
}
