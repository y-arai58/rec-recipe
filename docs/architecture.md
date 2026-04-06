# Architecture

## Overview

料理レコメンドWebアプリ「rec-recipe」のシステムアーキテクチャ。
Next.js App Router + 静的JSONデータによるサーバーサイドレンダリング中心の構成。
認証なし、タグマッチングによるルールベースレコメンドを採用。

> **ADR-005**: DBなし設計。料理データは静的JSONファイル（`data/dishes.json`）で管理。
> データは実質不変（スクレイピング後の変更なし）なため、PostgreSQL+Prismaは不要と判断。

---

## System Structure

```
ブラウザ（スマホ/PC）
    ↓ HTTP
Next.js App Router（Vercel）
    ├── Server Components（データ取得・HTML生成）
    ├── Client Components（質問フロー・インタラクション）
    └── Server Actions（レコメンドロジック実行）
        ↓
data/dishes.json（静的JSONファイル）
```

---

## Directory Structure

```
src/
├── app/
│   ├── page.tsx                    # レコメンド画面（メイン）
│   ├── dishes/
│   │   └── [id]/page.tsx          # 料理詳細・タグ確認画面
│   └── layout.tsx
├── features/
│   └── recommend/
│       ├── components/
│       │   ├── QuestionFlow.tsx   # 質問フローUI（Client Component）
│       │   └── DishCard.tsx      # レコメンド結果カード
│       ├── actions.ts             # Server Action: レコメンド実行
│       ├── queries.ts             # タグ付き料理の取得（JSONから読み込み）
│       ├── scoring.ts             # タグマッチングスコアリングロジック
│       ├── validation.ts          # Zod: 回答バリデーション
│       └── types.ts               # UI用複合型
├── domain/
│   └── models/
│       ├── dish.ts                # Dish 型定義
│       └── tag.ts                 # Tag 型定義
├── components/
│   ├── TagBadge.tsx               # タグ表示バッジ（共通）
│   └── Button.tsx                 # ボタン（共通）
├── constants/
│   └── questions.ts               # 質問フローの定義（質問・選択肢・タグマッピング）
└── styles/
    └── globals.css                # Tailwind v4 グローバルスタイル + デザイントークン

data/
└── dishes.json                    # 料理データ（スクレイピング結果 + タグ付与済み）

scripts/
└── scrape/
    └── index.ts                   # 料理データ取得スクリプト（初回のみ実行）→ data/dishes.json に出力
```

---

## Data Flow

### Read（レコメンド結果表示）
```
page.tsx（Server Component）
  → features/recommend/queries.ts
  → import data/dishes.json
  → DishCard（Server Component）
```

### Write（レコメンド実行）
```
QuestionFlow.tsx（Client Component）
  → form submit → Server Action（features/recommend/actions.ts）
  → Zod バリデーション
  → features/recommend/scoring.ts（タグマッチング）
  → dishes: DishWithTags[]（JSONから取得済み）
  → return results
```

---

## Data Schema (JSON)

```typescript
// data/dishes.json の型（src/domain/models/dish.ts で定義）

type TagCategory = "genre" | "volume" | "base" | "cookTime" | "protein" | "season"

type Tag = {
  id: number
  name: string
  category: TagCategory
}

type Dish = {
  id: number
  name: string
  tags: Tag[]
}

// dishes.json の構造
type DishesData = {
  dishes: Dish[]
  tags: Tag[]
}
```

---

## Recommend Logic

```
1. ユーザーが質問フローに回答
2. 各回答を対応するタグID群に変換（constants/questions.ts で定義）
3. data/dishes.json から全料理を読み込み
4. 全料理に対して「ユーザー選択タグと料理タグの一致数」でスコアリング
5. スコア降順で上位 5 件を取得
6. 同スコア内でランダムシャッフル（毎回違う候補が出るように）
```

---

## Tag Categories

| category | 説明 | タグ例 |
|---|---|---|
| genre | 料理ジャンル（国） | 和食、中華、洋食、イタリアン、韓国料理、エスニック |
| volume | ボリューム感 | ガッツリ、普通、サッパリ、軽め |
| base | 主食ベース | ご飯もの、麺、パン、汁物、おかずのみ |
| cookTime | 調理時間目安 | 短め（〜20分）、普通（20〜40分）、時間かかる（40分〜） |
| protein | タンパク源 | 肉、魚介、豆腐・卵、野菜メイン |
| season | 季節感 | 夏向き、冬向き、通年 |

---

## Architecture Decisions

詳細は docs/adr/ を参照。

- [ADR-001] 認証なし設計 → 摩擦ゼロ・個人利用を優先
- [ADR-002] タグマッチング（ルールベース）→ LLM不要・コスト・速度・透明性
- [ADR-003] レシピ情報を持たない → スコープ絞り込み・著作権回避
- [ADR-004] スクレイピングで初期データ構築 → 日本の家庭料理カバレッジを確保
- [ADR-005] DBなし・静的JSONファイル → インフラ不要・Vercelのみで完結

---

## Tech Stack

| 項目 | 技術 | バージョン |
|---|---|---|
| Framework | Next.js App Router | 16 |
| Language | TypeScript | strict |
| Styling | Tailwind CSS | v4 |
| UI Components | shadcn/ui | latest |
| Data | 静的JSONファイル | - |
| Validation | Zod | latest |
| Lint/Format | Biome | latest |
| Test | Vitest | latest |
| Hosting | Vercel | - |

---

## Danger Modules

以下のディレクトリには個別の CLAUDE.md を配置してガードする:

- `data/dishes.json` — 本番データ。直接編集しない（スクリプト経由で更新）
- `scripts/scrape/` — data/dishes.json に直接書き込む。実行前に確認すること
