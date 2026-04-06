# Architecture

## Overview

料理レコメンドWebアプリ「rec-recipe」のシステムアーキテクチャ。
Next.js App Router + PostgreSQL + Prisma によるサーバーサイドレンダリング中心の構成。
認証なし、タグマッチングによるルールベースレコメンドを採用。

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
PostgreSQL（Supabase or Railway）
    └── Prisma ORM
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
│       ├── queries.ts             # タグ付き料理の取得クエリ
│       ├── scoring.ts             # タグマッチングスコアリングロジック
│       ├── validation.ts          # Zod: 回答バリデーション
│       └── types.ts               # UI用複合型
├── domain/
│   └── models/
│       ├── dish.ts                # Dish モデル型 + DishRepository インターフェース
│       └── tag.ts                 # Tag モデル型 + TagRepository インターフェース
├── repositories/
│   ├── dishRepository.ts          # DishRepository 実装（Prisma）
│   └── tagRepository.ts           # TagRepository 実装（Prisma）
├── components/
│   ├── TagBadge.tsx               # タグ表示バッジ（共通）
│   └── Button.tsx                 # ボタン（共通）
├── lib/
│   └── prisma.ts                  # Prisma Client シングルトン
├── constants/
│   └── questions.ts               # 質問フローの定義（質問・選択肢・タグマッピング）
└── styles/
    └── globals.css                # Tailwind v4 グローバルスタイル + デザイントークン

prisma/
└── schema.prisma                  # Prismaスキーマ

scripts/
└── scrape/
    └── index.ts                   # 料理データ取得スクリプト（初回のみ実行）
```

---

## Data Flow

### Read（レコメンド結果表示）
```
page.tsx（Server Component）
  → features/recommend/queries.ts
  → repositories/dishRepository.ts
  → Prisma → PostgreSQL
  → DishCard（Server Component）
```

### Write（レコメンド実行）
```
QuestionFlow.tsx（Client Component）
  → form submit → Server Action（features/recommend/actions.ts）
  → Zod バリデーション
  → features/recommend/scoring.ts（タグマッチング）
  → repositories/dishRepository.ts
  → Prisma → PostgreSQL
  → revalidatePath / return results
```

---

## Database Schema

```prisma
model Dish {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  tags      DishTag[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Tag {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  category String    // "genre" | "volume" | "base" | "cookTime" | "protein" | "season"
  dishes   DishTag[]
}

model DishTag {
  dishId Int
  tagId  Int
  dish   Dish @relation(fields: [dishId], references: [id])
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([dishId, tagId])
}
```

---

## Recommend Logic

```
1. ユーザーが質問フローに回答
2. 各回答を対応するタグID群に変換（constants/questions.ts で定義）
3. 全料理に対して「ユーザー選択タグと料理タグの一致数」でスコアリング
4. スコア降順で上位 5 件を取得
5. 同スコア内でランダムシャッフル（毎回違う候補が出るように）
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

---

## Tech Stack

| 項目 | 技術 | バージョン |
|---|---|---|
| Framework | Next.js App Router | 16 |
| Language | TypeScript | strict |
| Styling | Tailwind CSS | v4 |
| UI Components | shadcn/ui | latest |
| ORM | Prisma | latest |
| DB | PostgreSQL | 15+ |
| Validation | Zod | latest |
| Lint/Format | Biome | latest |
| Test | Vitest | latest |
| Hosting | Vercel | - |
| DB Hosting | Supabase or Railway | - |

---

## Danger Modules

以下のディレクトリには個別の CLAUDE.md を配置してガードする:

- `prisma/` — スキーマ変更は必ず migration を伴うこと
- `scripts/scrape/` — 本番DBに直接書き込む。実行前に確認すること
