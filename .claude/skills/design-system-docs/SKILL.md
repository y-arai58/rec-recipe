---
name: design-system-docs
description: デザインシステムのコンポーネント一覧と使い方リファレンス。コンポーネント使用・作成時に自動参照。追加時に更新必須。
---

# Design System Reference

> コンポーネント追加時に必ずこのファイルを更新すること。
> Preview: `npm run dev` → `/design-system`

## Tokens — `src/app/globals.css`

### カラーパレット（Earth Tone）

| Token | Hex | 用途 |
|-------|-----|------|
| `--background` | `#f7f0e7` | ページ背景（温かいクリーム）|
| `--foreground` | `#2d1a0e` | メインテキスト（濃いブラウン）|
| `--card` | `#fefcf8` | カード背景（オフホワイト）|
| `--primary` | `#b5622f` | 主要ボタン・CTA（テラコッタ）|
| `--secondary` | `#6b4226` | 副次アクション（ダークブラウン）|
| `--muted` | `#ede5db` | 薄いベージュ背景 |
| `--muted-foreground` | `#7a6050` | サブテキスト |
| `--accent` | `#e2cba9` | アクセント（温かいサンド）|
| `--border` | `#d8cabb` | 境界線（ウォームタープ）|
| `--destructive` | `#c0392b` | 危険・エラー |

### タグカテゴリカラー

| Category | BG Token | Text Token |
|----------|----------|------------|
| genre | `--tag-genre-bg` `#f5e6d8` | `--tag-genre-text` `#7a3b1e` |
| volume | `--tag-volume-bg` `#e4eed8` | `--tag-volume-text` `#3a5c25` |
| base | `--tag-base-bg` `#f5e9cc` | `--tag-base-text` `#7a5a1e` |
| cookTime | `--tag-cooktime-bg` `#d8e8f0` | `--tag-cooktime-text` `#1e4a6e` |
| protein | `--tag-protein-bg` `#f0dde0` | `--tag-protein-text` `#6e2030` |
| season | `--tag-season-bg` `#e8daf5` | `--tag-season-text` `#4a2570` |

### Typography

- Font: `Noto Sans JP` (400 / 500 / 700) — `--font-sans`
- 設定: `src/app/layout.tsx`

### Radius

| Token | 値 |
|-------|-----|
| `--radius-sm` | 0.375rem |
| `--radius-md` | 0.5rem |
| `--radius-lg` | 0.75rem |
| `--radius-xl` | 1rem |

---

## Utility: cn() — `src/lib/utils.ts`

```ts
import { cn } from "@/lib/utils"
```

---

## Installed shadcn/ui Components

### Button — `src/components/ui/button.tsx`

```tsx
<Button>レコメンドする</Button>
<Button variant="secondary">もう一度</Button>
<Button variant="outline">別の候補を見る</Button>
<Button variant="ghost">スキップ</Button>
<Button size="sm">小さい</Button>
<Button disabled>無効</Button>
```

Variants: `default` | `secondary` | `outline` | `ghost` | `destructive` | `link`
Sizes: `default` (h-11) | `sm` (h-9) | `lg` (h-13) | `icon` (h-10 w-10)

---

## Custom Components

### TagBadge — `src/components/ui/tag-badge.tsx`

料理タグをカテゴリ別カラーで表示するピル型バッジ。

```tsx
import { TagBadge } from "@/components/ui/tag-badge"

<TagBadge category="genre" label="和食" />
<TagBadge category="volume" label="ボリューミー" />
<TagBadge category="base" label="ご飯" />
<TagBadge category="cookTime" label="15分以内" />
<TagBadge category="protein" label="鶏肉" />
<TagBadge category="season" label="通年" />
```

**Props:**
- `category`: `TagCategory` — genre / volume / base / cookTime / protein / season
- `label`: `string` — 表示するテキスト
- `className`: `string?` — 追加クラス

**Edge Cases:** 長いラベルは自然に折り返し / `select-none` で選択不可

---

## Rules

- 新UI前にこのリファレンス確認。shadcn/ui にあればそのまま使う
- マジックナンバー禁止。トークン（CSS変数）経由のみ
- Anti-AI チェック必須（主役1つ・装飾は最後に削る）
