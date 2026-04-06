import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import type { TagCategory } from "@/domain/models/tag"
import { cn } from "@/lib/utils"

const tagBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-none select-none",
  {
    variants: {
      category: {
        genre: "bg-[var(--tag-genre-bg)] text-[var(--tag-genre-text)]",
        volume: "bg-[var(--tag-volume-bg)] text-[var(--tag-volume-text)]",
        base: "bg-[var(--tag-base-bg)] text-[var(--tag-base-text)]",
        cookTime: "bg-[var(--tag-cooktime-bg)] text-[var(--tag-cooktime-text)]",
        protein: "bg-[var(--tag-protein-bg)] text-[var(--tag-protein-text)]",
        season: "bg-[var(--tag-season-bg)] text-[var(--tag-season-text)]",
      },
    },
    defaultVariants: {
      category: "genre",
    },
  },
)

export interface TagBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagBadgeVariants> {
  category: TagCategory
  label: string
}

const TagBadge = React.forwardRef<HTMLSpanElement, TagBadgeProps>(
  ({ className, category, label, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(tagBadgeVariants({ category }), className)} {...props}>
        {label}
      </span>
    )
  },
)
TagBadge.displayName = "TagBadge"

export { TagBadge, tagBadgeVariants }
