import Link from "next/link"
import { notFound } from "next/navigation"
import { TagBadge } from "@/components/ui/tag-badge"
import type { TagCategory } from "@/domain/models/tag"
import { TAG_CATEGORIES } from "@/domain/models/tag"
import { findDishById, getAllDishIds } from "@/repositories/dishRepository"

// タグカテゴリの表示順と日本語ラベル
const CATEGORY_ORDER: TagCategory[] = ["genre", "volume", "base", "protein", "cookTime", "season"]

const CATEGORY_LABEL: Record<TagCategory, string> = {
  genre: "ジャンル",
  volume: "ボリューム",
  base: "主食",
  protein: "タンパク源",
  cookTime: "調理時間",
  season: "季節感",
}

// ── 静的生成 ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllDishIds().map((id) => ({ id }))
}

// ── メタデータ ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dish = findDishById(id)
  if (!dish) return {}
  return { title: `${dish.name} — rec-recipe` }
}

// ── ページ ─────────────────────────────────────────────────────────

export default async function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dish = findDishById(id)
  if (!dish) notFound()

  // タグをカテゴリ別にグループ化
  const tagsByCategory = Object.fromEntries(
    TAG_CATEGORIES.map((cat) => [cat, dish.tags.filter((t) => t.category === cat)]),
  ) as Record<TagCategory, typeof dish.tags>

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-10">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        ← トップに戻る
      </Link>

      {/* 料理名 */}
      <h1 className="mt-6 text-3xl font-bold leading-tight text-foreground">{dish.name}</h1>

      {/* タグ一覧（カテゴリ別） */}
      <div className="mt-8 space-y-6">
        {CATEGORY_ORDER.map((cat) => {
          const tags = tagsByCategory[cat]
          if (tags.length === 0) return null
          return (
            <section key={cat}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABEL[cat]}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagBadge key={tag.id} category={cat} label={tag.name} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* フッターアクション */}
      <div className="mt-12 border-t border-border pt-6">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          別の料理を探す →
        </Link>
      </div>
    </main>
  )
}
