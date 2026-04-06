import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/ui/tag-badge"
import type { TagCategory } from "@/domain/models/tag"

// ─── Color swatches ───────────────────────────────────────────────────────

const COLOR_TOKENS = [
  { name: "background", label: "Background", var: "var(--background)", hex: "#f7f0e7" },
  { name: "foreground", label: "Foreground", var: "var(--foreground)", hex: "#2d1a0e" },
  { name: "card", label: "Card", var: "var(--card)", hex: "#fefcf8" },
  { name: "primary", label: "Primary", var: "var(--primary)", hex: "#b5622f" },
  { name: "secondary", label: "Secondary", var: "var(--secondary)", hex: "#6b4226" },
  { name: "muted", label: "Muted", var: "var(--muted)", hex: "#ede5db" },
  { name: "muted-fg", label: "Muted FG", var: "var(--muted-foreground)", hex: "#7a6050" },
  { name: "accent", label: "Accent", var: "var(--accent)", hex: "#e2cba9" },
  { name: "border", label: "Border", var: "var(--border)", hex: "#d8cabb" },
  { name: "destructive", label: "Destructive", var: "var(--destructive)", hex: "#c0392b" },
] as const

// ─── Tag category samples ─────────────────────────────────────────────────

const TAG_SAMPLES: { category: TagCategory; label: string }[] = [
  { category: "genre", label: "和食" },
  { category: "genre", label: "イタリアン" },
  { category: "volume", label: "ボリューミー" },
  { category: "volume", label: "軽め" },
  { category: "base", label: "ご飯" },
  { category: "base", label: "麺" },
  { category: "cookTime", label: "15分以内" },
  { category: "cookTime", label: "30〜60分" },
  { category: "protein", label: "鶏肉" },
  { category: "protein", label: "豆腐" },
  { category: "season", label: "通年" },
  { category: "season", label: "冬" },
]

// ─── Page ─────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-14">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            rec-recipe
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Design System</h1>
        </div>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Colors
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COLOR_TOKENS.map((token) => (
              <div key={token.name} className="space-y-1.5">
                <div
                  className="h-12 w-full rounded-md border border-border"
                  style={{ background: token.var }}
                />
                <p className="text-xs font-medium text-foreground">{token.label}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{token.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Typography
          </h2>
          <div className="space-y-3 rounded-lg border border-border bg-card p-5">
            <p className="text-2xl font-bold text-foreground">今日何食べる？</p>
            <p className="text-lg font-medium text-foreground">肉じゃが / カレーライス</p>
            <p className="text-base text-foreground">気分や条件に合った料理を提案します。</p>
            <p className="text-sm text-muted-foreground">
              タグを選んで、今日の献立を決めましょう。
            </p>
            <p className="text-xs text-muted-foreground">Noto Sans JP — 400 / 500 / 700</p>
          </div>
        </section>

        {/* TagBadge */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            TagBadge
          </h2>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-5">
            {TAG_SAMPLES.map((tag) => (
              <TagBadge
                key={`${tag.category}-${tag.label}`}
                category={tag.category}
                label={tag.label}
              />
            ))}
          </div>
          <div className="rounded-md bg-muted px-4 py-3">
            <code className="text-xs text-muted-foreground">
              {'<TagBadge category="genre" label="和食" />'}
            </code>
          </div>
        </section>

        {/* Button */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Button
          </h2>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
            <Button>レコメンドする</Button>
            <Button variant="secondary">もう一度</Button>
            <Button variant="outline">別の候補を見る</Button>
            <Button variant="ghost">スキップ</Button>
            <Button size="sm">小さいボタン</Button>
            <Button disabled>無効</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
