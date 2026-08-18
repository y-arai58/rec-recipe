# rec-recipe

「今日何食べる？」に答えるだけの献立アプリ。認証もDBもない、完全静的なWebアプリ。

2つのモードがある。

| ページ | やること |
| --- | --- |
| `/` **今日の一品** | 5問に答えると、224件の家庭料理からタグの一致度で上位5件を提案する |
| `/plan` **まとめ買い献立** | 3〜7日分の献立と、買い物1回ぶんの買い物リストを組み立てる |

まとめ買い献立は「にんじんは1本ずつ売っていない」「肉は大容量パックが安い」
「まとめ買いした食材は使い切らないと傷む」を計算に入れる。

**Live:** https://y-arai58.github.io/rec-recipe/

---

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
```

Node.js 20 以上（CI は 20 で動作）。環境変数・データベース・外部APIは不要。

---

## Scripts

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 静的エクスポート（`out/` に出力） |
| `npm run start` | ビルド済みサーバーの起動（※ `output: "export"` のため実質未使用） |
| `npm run check` | Biome の lint + format チェック |
| `npm run lint:fix` | Biome で自動修正 |
| `npm run format` | Biome でフォーマット |
| `npm test` | Vitest（単体テスト） |
| `npm run test:watch` | Vitest watch モード |
| `npm run scrape` | 料理名データの構築（シード + Wikipedia） |
| `npm run scrape:dry` | 上記の書き込みなし確認 |
| `npm run export-names` | 料理名一覧の書き出し |
| `npm run tag-assign` | `data/dishes.json` の全料理へタグを自動付与 |

---

## Tech Stack

- **Next.js 16** (App Router) / **React 19** / TypeScript strict
- **Tailwind CSS v4**（`@theme inline` + CSS 変数によるデザイントークン）
- **Zod v4**（データスキーマ検証）
- **Biome**（lint + format。ESLint / Prettier は不使用）
- **Vitest**（jsdom 環境）
- **static export → GitHub Pages**（`output: "export"`, `basePath: "/rec-recipe"`）

shadcn/ui の規約（`components.json`, cva, `cn()`）に沿って書いているが、
実際に入れているのは `@radix-ui/react-slot` と `class-variance-authority` のみで、
`Button` / `TagBadge` は手書きしている。

---

## Architecture

### データは静的JSON（DBなし）

料理データは初回構築後ほぼ変化しないため、PostgreSQL + Prisma を廃止して
静的JSONに一本化している（[ADR-005](docs/adr/ADR-005-no-database.md)）。
`src/lib/data.ts` / `src/lib/ingredient-data.ts` が読み込み時に索引を組み立て、
以降はメモリ上の配列を参照する。JSON がスキーマを満たすことは CI のテストで担保する
（実行時に Zod を通すとクライアントバンドルに載るため）。

| ファイル | 中身 | 更新方法 |
| --- | --- | --- |
| `data/dishes.json` | 料理 224 件 + タグマスター | `npm run tag-assign` で再生成。**直接編集しない** |
| `data/tags.json` | タグ 49 件のマスター | 手で編集（`tag-assign` の入力） |
| `data/ingredients.json` | 食材 67 件（購入単位・日持ち・常備品フラグ） | 手で編集 |
| `data/dish-ingredients.json` | 主菜 55 件ぶんの材料（2人分） | 手で編集 |
| `data/dish_name_list.json` | 料理名のみの一覧 | スクレイピングの中間生成物 |

タグは 6 カテゴリ: `genre`(12) / `volume`(4) / `base`(6) / `cookTime`(5) / `protein`(15) / `season`(7)

### まとめ買い献立の考え方（[ADR-007](docs/adr/ADR-007-ingredient-data.md)）

食材は `packs: { size, price, label }[]` を持つ。この1フィールドで
「にんじんは3本入り袋しかない」も「肉は600gパックのほうが単価が安い」も表現できる。
`choosePacks()` が必要量以上になる組み合わせのうち最安のものを選ぶ。

献立は「すでに買う食材の使い回し率」が高い料理を貪欲に足していき、
日持ちの短い食材を使う料理を前半の日に並べる。
`最後に使う日 > 日持ち日数` になった食材は警告する（冷凍できるものは冷凍を案内）。

材料データを持つ 55 件だけが献立プランナーの候補になる。データを足せば候補が増える。

### 静的エクスポートなので、計算はクライアントで走る

GitHub Pages 配信のため Server Actions は実行されない（[ADR-006](docs/adr/ADR-006-static-export.md)）。
レコメンドも献立作成もブラウザ上で完結し、料理・食材データはバンドルに同梱される。

```
src/app/page.tsx（Server Component / 静的HTML）
  └─ QuestionFlow（"use client"）
       ├─ 質問5問に回答 → 選択タグID配列（+ 実行月から季節タグを加点）
       └─ scoreDishes() … タグ一致数でスコア降順、同点はシャッフル、上位5件
            └─ DishCard → /dishes/[id]（generateStaticParams で224ページを事前生成）

src/app/plan/page.tsx
  └─ MealPlanner（"use client"）
       └─ buildMealPlan() … 献立選定 → 日並べ → パック単位の買い物リスト → 使い切り警告
```

### ディレクトリ

```
src/
├── app/
│   ├── page.tsx                 # トップ（質問フロー）
│   ├── plan/page.tsx            # まとめ買い献立
│   ├── dishes/[id]/page.tsx     # 料理詳細（タグをカテゴリ別表示）
│   ├── design-system/page.tsx   # デザイントークン / コンポーネントのカタログ
│   ├── layout.tsx               # Noto Sans JP + メタデータ
│   └── globals.css              # Tailwind v4 + デザイントークン定義
├── features/
│   ├── recommend/
│   │   ├── components/          # QuestionFlow, DishCard
│   │   ├── scoring.ts           # タグマッチングのスコアリング
│   │   └── types.ts             # UI都合の複合型
│   └── meal-plan/
│       ├── components/          # MealPlanner
│       ├── planning.ts          # 献立選定・日並べ・警告
│       ├── shopping.ts          # 最小コストのパック組み合わせ
│       ├── queries.ts           # 材料データを持つ料理の抽出
│       └── types.ts
├── domain/models/               # Dish / Tag / Ingredient のピュアな型
├── repositories/dishRepository.ts
├── components/ui/               # button.tsx, tag-badge.tsx
├── constants/                   # questions.ts, seasons.ts
└── lib/                         # data.ts, ingredient-data.ts, *-schema.ts（テスト専用）, utils.ts

data/      # 料理・タグ・食材データ
scripts/   # データ構築スクリプト（アプリからは参照されない）
docs/      # spec / architecture / ADR
tasks/     # TASK-XXX.md（状態の単一ソース）+ lessons.md
```

テストは対象と同じディレクトリに `*.test.ts(x)` で置く（現在 90 ケース）。

### 境界ルール

- `domain/models/` にはピュアな型のみ
- `features/` の外から `features/` を import しない（`app/**/page.tsx` は例外）
- ハードコードした色・サイズを書かない。`globals.css` のデザイントークンを使う
- Server Components がデフォルト。`"use client"` は必要なときだけ

---

## Design System

アースカラー（ベージュ × テラコッタ × ブラウン）。
`src/app/globals.css` の `:root` に生の値、`@theme inline` で Tailwind ユーティリティへマッピング。
タグは 6 カテゴリそれぞれに専用の bg / text トークンを持つ。

ローカルで `/design-system` を開くとカラースウォッチとコンポーネント一覧を確認できる。

---

## Deployment

`main` への push で GitHub Pages へデプロイされる（`.github/workflows/deploy.yml`）。
typecheck → lint → test → build の順に走り、`out/` を artifact としてアップロードする。

`data/*.json` のスキーマ検証は実行時ではなくこのテストステップで行われるので、
CI を素通りさせるとデータ不整合がそのまま本番に出る。

---

## Docs

- [docs/architecture.md](docs/architecture.md) — アーキテクチャ詳細
- [docs/spec/requirements.md](docs/spec/requirements.md) — 機能・非機能要件
- [docs/spec/user-stories.md](docs/spec/user-stories.md) — ユーザーストーリー
- [docs/adr/](docs/adr/) — アーキテクチャ決定記録
- [tasks/](tasks/) — タスク（状態の単一ソース）と [lessons.md](tasks/lessons.md)
- [CLAUDE.md](CLAUDE.md) — AI エージェント向けのプロジェクト規約

---

## Data License

料理名の一部は Wikipedia（CC BY-SA 4.0）由来。`scripts/scrape/index.ts` を参照。
