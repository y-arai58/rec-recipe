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
│   ├── recommend/
│   │   ├── components/
│   │   │   ├── QuestionFlow.tsx    # 質問フローUI + スコアリング実行（Client Component）
│   │   │   └── DishCard.tsx        # レコメンド結果カード
│   │   ├── scoring.ts              # タグマッチングスコアリング + 役割による絞り込み
│   │   ├── pairing.ts              # メインに合わせる付け合わせ（副菜・汁物・主食）の選定
│   │   └── types.ts                # UI用複合型
│   └── meal-plan/
│       ├── components/
│       │   └── MealPlanner.tsx     # 日数・人数の選択 + 献立/買い物リスト表示
│       ├── planning.ts             # 献立選定・日並べ・買い物リスト・使い切り警告
│       ├── shopping.ts             # 最小コストのパック組み合わせ探索
│       ├── queries.ts              # 材料データを持つ料理の抽出
│       └── types.ts
├── domain/
│   └── models/
│       ├── dish.ts                 # Dish / DishWithTags 型定義
│       ├── tag.ts                  # Tag / TagCategory 型定義
│       └── ingredient.ts           # Ingredient / PackOption / DishIngredient
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
├── dishes.json                     # 料理238件 + タグマスター（tag-assign が生成。直接編集しない）
├── dishes.schema.json              # JSON Schema
├── tags.json                       # タグ55件のマスター（tag-assign スクリプトの入力）
├── ingredients.json                # 食材67件（購入単位・日持ち・常備品フラグ）※手で編集
├── dish-ingredients.json           # 主菜55件ぶんの材料（2人分）※手で編集
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
  → 238ページを静的HTMLとして生成
```

### レコメンド実行（ブラウザ上で完結）
```
QuestionFlow.tsx（"use client"）
  → 5問の回答（複数選択可）を選択タグID配列へ変換
  → lib/data.ts の getAllDishesWithTags()
  → scoring.ts の filterByRoles() … 提案対象を onedish / main だけに絞る
  → scoring.ts の scoreDishes()
  → pairing.ts の pickSides() … メイン1品ごとに付け合わせを最大2品
  → RecommendedDish[] を state に格納 → DishCard で描画
```

### まとめ買い献立（ブラウザ上で完結）
```
MealPlanner.tsx（"use client"）
  → 日数(3〜7) / 人数(2〜4) を選択
  → features/meal-plan/queries.ts … 材料データを持つメイン料理54件
  → features/meal-plan/planning.ts の buildMealPlan()
       1. 好みタグ + 食材の使い回し率 + 野菜量 で料理を貪欲に選ぶ
       2. 日持ちの短い食材を使う料理を前半の日へ並べ替え
       3. 食材ごとの必要量と「最後に使う日」を集計
       4. shopping.ts の choosePacks() でパック単位に切り上げ（最小コスト）
       5. 「最後に使う日 > 日持ち日数」と「余り」を警告
```

> Server Action は使わない。静的エクスポートでは実行できないため。
> 以前存在した `actions.ts` / `queries.ts` / `validation.ts` は TASK-010 で削除済み。

---

## Data Schema (JSON)

```typescript
// src/domain/models/tag.ts
const TAG_CATEGORIES = ["genre", "volume", "base", "cookTime", "protein", "season", "role"] as const
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
1. ユーザーが質問フロー（5問）に回答。各問は複数選択・スキップ可
2. 選択肢を対応するタグID群に変換（constants/questions.ts）
3. dishes.json の全料理（タグ結合済み）を取得
4. 役割が onedish / main の料理だけを候補にする（副菜・汁物・主食は単体で提案しない）
5. 「ユーザー選択タグ ∩ 料理タグ」の一致数をスコアとする
6. スコア降順にソート、同スコア内は Math.random() でシャッフル
7. excludeIds を除外して上位 5 件を返す
8. 各メインに付け合わせを最大2品つける（pairing.ts）
```

### 付け合わせ（サブ提案）の選び方

メインの役割で埋める枠が決まる。

| メイン | 枠 |
|---|---|
| 丼・麺などの一皿完結（onedish） | 副菜 + 汁物 |
| おかず（main） | 副菜 + 汁物（ご飯は前提） |
| 具だくさんサラダが主役 | 主食 + 汁物（炭水化物を補う） |

枠ごとの候補は、メインとのジャンル一致（+2）・季節一致（+1）・
タンパク源のかぶり（-3）・15分以内（+1）・
ボリュームのあるメインに軽い副菜（+1）でスコアリングして1品選ぶ。
同じ提案リストの中では付け合わせを重複させない。

---

## Tag Categories

| category | 件数 | 説明 | 質問フローでの利用 |
|---|---|---|---|
| genre | 13 | 料理ジャンル（国・サラダ） | Q2「何系が食べたい？」 |
| volume | 4 | ボリューム感 | Q1「今日の気分は？」 |
| base | 6 | 主食ベース | Q4「主食は？」 |
| cookTime | 5 | 調理時間目安 | Q5「調理時間は？」 |
| protein | 15 | タンパク源 | Q3「主役の食材は？」 |
| season | 7 | 季節感 | 実行月から自動加点（「通年」は除く） |
| role | 5 | 献立での役割 | 質問しない。提案対象と付け合わせの振り分けに使う |

---

## Architecture Decisions

詳細は docs/adr/ を参照。

- [ADR-001] 認証なし設計 → 摩擦ゼロ・個人利用を優先
- [ADR-002] タグマッチング（ルールベース）→ LLM不要・コスト・速度・透明性
- [ADR-003] レシピ情報を持たない → スコープ絞り込み・著作権回避（ADR-007 で一部変更）
- [ADR-005] DBなし・静的JSONファイル → インフラ不要
- [ADR-006] 静的エクスポート + GitHub Pages → サーバー・ホスティング費用ゼロ
- [ADR-007] 材料データを持つ（手順は持たない）→ まとめ買い献立・買い物リストのため

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

- `data/dishes.json` — 本番データ。直接編集しない（`npm run tag-assign` 経由で更新）
- `scripts/scrape/` — data/dishes.json に直接書き込む。実行前に確認すること

`data/ingredients.json` と `data/dish-ingredients.json` は逆に**手で管理する**。
スクリプトから書き換えないこと（分量はキーワード推定できないため）。
