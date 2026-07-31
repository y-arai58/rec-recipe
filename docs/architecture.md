# Architecture

## Overview

料理レコメンドWebアプリ「rec-recipe」のシステムアーキテクチャ。
Next.js App Router の**静的エクスポート**（`output: "export"`）+ 静的JSONデータによる構成。
認証なし、サーバーなし、タグマッチングによるルールベースレコメンドを採用。

> **ADR-005**: DBなし設計。料理データは静的JSONファイル（`data/dishes.json`）で管理。
> データは実質不変（スクレイピング後の変更なし）なため、PostgreSQL+Prismaは不要と判断。
>
> **ADR-006**: 静的エクスポート + GitHub Pages 配信。サーバーが存在しないため
> Server Actions / Route Handlers / `unstable_cache` は使えない。

---

## System Structure

```
ブラウザ（スマホ/PC）
    ↓ HTTP（静的ファイル）
GitHub Pages（basePath: /rec-recipe）
    └── out/ … next build で生成した静的HTML/JS
         ├── Server Components → ビルド時にHTMLへ焼き込み
         └── Client Components → ブラウザ上でレコメンド実行
              └── data/dishes.json はJSバンドルに同梱される
```

**ビルド時にサーバー処理が完結し、実行時のサーバーは存在しない。**

---

## Directory Structure

```
src/
├── app/
│   ├── page.tsx                    # レコメンド画面（メイン）
│   ├── dishes/
│   │   └── [id]/page.tsx           # 料理詳細・タグ確認画面（generateStaticParams で全件事前生成）
│   ├── design-system/
│   │   └── page.tsx                # デザイントークン / コンポーネントのカタログ
│   ├── layout.tsx                  # Noto Sans JP + メタデータ
│   └── globals.css                 # Tailwind v4 グローバルスタイル + デザイントークン
├── features/
│   └── recommend/
│       ├── components/
│       │   ├── QuestionFlow.tsx    # 質問フローUI + スコアリング実行（Client Component）
│       │   └── DishCard.tsx        # レコメンド結果カード
│       ├── scoring.ts              # タグマッチングスコアリングロジック
│       ├── scoring.test.ts         # スコアリングの単体テスト
│       └── types.ts                # UI用複合型
├── domain/
│   └── models/
│       ├── dish.ts                 # Dish / DishWithTags 型定義
│       └── tag.ts                  # Tag / TagCategory 型定義
├── repositories/
│   └── dishRepository.ts           # 料理の取得（詳細ページ用）
├── components/
│   └── ui/
│       ├── button.tsx              # ボタン（cva）
│       └── tag-badge.tsx           # タグ表示バッジ（カテゴリ別配色）
├── constants/
│   └── questions.ts                # 質問フローの定義（質問・選択肢・タグマッピング）
└── lib/
    ├── data.ts                     # dishes.json のロード + Zod 検証 + アクセス関数
    └── utils.ts                    # cn()

data/
├── dishes.json                     # 料理224件 + タグマスター（アプリの唯一のデータソース）
├── dishes.schema.json              # JSON Schema
├── tags.json                       # タグ48件のマスター（tag-assign スクリプトの入力）
└── dish_name_list.json             # 料理名一覧（スクレイピングの中間生成物）

scripts/
├── scrape/index.ts                 # 料理名データ構築（シード + Wikipedia）
├── scrape/export-names.ts          # 料理名一覧の書き出し
└── tag-assign.ts                   # 全料理へのタグ自動付与
```

> `styles/`, `hooks/`, `types/`, `utils/`, `app/api/`, `app/(dashboard)/` は現時点で存在しない。
> グローバルCSSは `src/app/globals.css`。

---

## Data Flow

### 料理詳細（ビルド時に確定）
```
app/dishes/[id]/page.tsx（Server Component）
  → repositories/dishRepository.ts
  → lib/data.ts（dishes.json を Zod parse）
  → 224ページを静的HTMLとして生成
```

### レコメンド実行（ブラウザ上で完結）
```
QuestionFlow.tsx（"use client"）
  → 4問の回答（複数選択可）を選択タグID配列へ変換
  → lib/data.ts の getAllDishesWithTags()
  → features/recommend/scoring.ts の scoreDishes()
  → RecommendedDish[] を state に格納 → DishCard で描画
```

> Server Action は使わない。静的エクスポートでは実行できないため。
> 以前存在した `actions.ts` / `queries.ts` / `validation.ts` は TASK-010 で削除済み。

---

## Data Schema (JSON)

```typescript
// src/domain/models/tag.ts
const TAG_CATEGORIES = ["genre", "volume", "base", "cookTime", "protein", "season"] as const
type TagCategory = (typeof TAG_CATEGORIES)[number]

type Tag = {
  id: string        // 例: "tag-genre-japanese"
  name: string      // 例: "和食"
  category: TagCategory
}

// src/domain/models/dish.ts
type Dish = {
  id: string        // 例: "dish-001"
  name: string
  tagIds: string[]
  imageUrl?: string
  sourceUrl?: string
}

type DishWithTags = Dish & { tags: Tag[] }

// data/dishes.json の構造
type DishesData = { dishes: Dish[]; tags: Tag[] }
```

`lib/data.ts` がモジュール読み込み時に Zod でパースするため、
スキーマ違反があればビルド時（または初回描画時）に例外で落ちる。

---

## Recommend Logic

```
1. ユーザーが質問フロー（4問）に回答。各問は複数選択・スキップ可
2. 選択肢を対応するタグID群に変換（constants/questions.ts）
3. dishes.json の全料理（タグ結合済み）を取得
4. 「ユーザー選択タグ ∩ 料理タグ」の一致数をスコアとする
5. スコア降順にソート、同スコア内は Math.random() でシャッフル
6. excludeIds を除外して上位 5 件を返す
```

---

## Tag Categories

| category | 件数 | 説明 | 質問フローでの利用 |
|---|---|---|---|
| genre | 12 | 料理ジャンル（国） | Q2「何系が食べたい？」 |
| volume | 4 | ボリューム感 | Q1「今日の気分は？」 |
| base | 6 | 主食ベース | Q3「主食は？」 |
| cookTime | 5 | 調理時間目安 | Q4「調理時間は？」 |
| protein | 14 | タンパク源 | **未使用** |
| season | 7 | 季節感 | Q1で一部のみ |

---

## Architecture Decisions

詳細は docs/adr/ を参照。

- [ADR-001] 認証なし設計 → 摩擦ゼロ・個人利用を優先
- [ADR-002] タグマッチング（ルールベース）→ LLM不要・コスト・速度・透明性
- [ADR-003] レシピ情報を持たない → スコープ絞り込み・著作権回避
- [ADR-005] DBなし・静的JSONファイル → インフラ不要
- [ADR-006] 静的エクスポート + GitHub Pages → サーバー・ホスティング費用ゼロ

---

## Tech Stack

| 項目 | 技術 | バージョン |
|---|---|---|
| Framework | Next.js App Router（static export） | 16.2.2 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5 / strict |
| Styling | Tailwind CSS（`@theme inline`） | v4 |
| UI | 自前実装（cva + @radix-ui/react-slot） | - |
| Data | 静的JSONファイル | - |
| Validation | Zod | v4 |
| Lint/Format | Biome | 2.4 |
| Test | Vitest（jsdom） | 4.1 |
| Hosting | GitHub Pages | - |
| CI/CD | GitHub Actions（`.github/workflows/deploy.yml`） | - |

> shadcn/ui は `components.json` と規約（cva / `cn()` / `components/ui/`）のみ踏襲。
> レジストリからのコンポーネント追加は行っておらず、依存にも含まれない。
> react-hook-form / Playwright / Prisma は未導入。

---

## Danger Modules

以下のディレクトリには個別の CLAUDE.md を配置してガードする:

- `data/dishes.json` — 本番データ。直接編集しない（スクリプト経由で更新）
- `scripts/scrape/` — data/dishes.json に直接書き込む。実行前に確認すること
