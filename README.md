# rec-recipe

「今日何食べる？」に答えるだけの献立レコメンドアプリ。

気分・ジャンル・主食・調理時間の 4 問に答えると、224 件の家庭料理データベースから
タグの一致度でスコアリングして上位 5 件を提案する。認証もDBもない、完全静的なWebアプリ。

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
`data/dishes.json` に一本化している（[ADR-005](docs/adr/ADR-005-no-database.md)）。
`src/lib/data.ts` がモジュール読み込み時に Zod でパースし、以降はメモリ上の配列を参照する。

- `data/dishes.json` — 料理 224 件 + タグマスター（このファイルがアプリの唯一のデータソース）
- `data/tags.json` — タグ 48 件のマスター（`tag-assign` スクリプトの入力）
- `data/dish_name_list.json` — 料理名のみの一覧（スクレイピング中間生成物）

タグは 6 カテゴリ: `genre`(12) / `volume`(4) / `base`(6) / `cookTime`(5) / `protein`(14) / `season`(7)

### 静的エクスポートなので、スコアリングはクライアントで走る

GitHub Pages 配信のため Server Actions は実行されない。
質問フローの回答からのスコアリングは `QuestionFlow`（Client Component）が
`scoreDishes()` を直接呼んで行い、料理データはバンドルに同梱される。

```
src/app/page.tsx（Server Component / 静的HTML）
  └─ QuestionFlow（"use client"）
       ├─ 質問4問に回答 → 選択タグID配列
       ├─ getAllDishesWithTags() … data/dishes.json（バンドル同梱）
       └─ scoreDishes() … タグ一致数でスコア降順、同点はシャッフル、上位5件
            └─ DishCard → /dishes/[id]（generateStaticParams で224ページを事前生成）
```

> `src/features/recommend/actions.ts`（Server Action）と `queries.ts`（`unstable_cache`）は
> SSR 構成だった頃の名残で、現在はどこからも呼ばれていない。

### ディレクトリ

```
src/
├── app/
│   ├── page.tsx                 # トップ（質問フロー）
│   ├── dishes/[id]/page.tsx     # 料理詳細（タグをカテゴリ別表示）
│   ├── design-system/page.tsx   # デザイントークン / コンポーネントのカタログ
│   ├── layout.tsx               # Noto Sans JP + メタデータ
│   └── globals.css              # Tailwind v4 + デザイントークン定義
├── features/recommend/
│   ├── components/              # QuestionFlow, DishCard
│   ├── scoring.ts               # スコアリングロジック（+ scoring.test.ts）
│   ├── actions.ts / queries.ts  # ※現在未使用（上記参照）
│   ├── validation.ts            # Zod
│   └── types.ts                 # UI都合の複合型
├── domain/models/               # Dish / Tag のピュアな型
├── repositories/dishRepository.ts
├── components/ui/               # button.tsx, tag-badge.tsx
├── constants/questions.ts       # 質問・選択肢・タグのマッピング
└── lib/                         # data.ts（JSONロード + Zod）, utils.ts（cn）

data/      # 料理・タグデータ
scripts/   # データ構築スクリプト（アプリからは参照されない）
docs/      # spec / architecture / ADR
tasks/     # TASK-XXX.md（状態の単一ソース）+ lessons.md
```

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

`main` への push で GitHub Pages へデプロイされる。`out/` を artifact としてアップロードする構成。

> **注意:** 現在 `.github/workflows/` に `deploy.yml` と `nextjs.yml` の
> 2つの Pages デプロイワークフローが並存しており、どちらも `main` への push で発火する。
> 統合すべき既知の課題。

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
