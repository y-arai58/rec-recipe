# Project: rec-recipe（料理レコメンドアプリ）

## WHY — Purpose

カップル・家族が毎日抱える「今日何食べる？」という献立決めの認知コストを解決する。

- `/` 気分や条件の質問に答えるだけで、家庭料理データベースから料理を複数提案する
- `/plan` 買い物1回でまわる3〜7日分の献立と買い物リストを組み立てる。
  袋・パック単位でしか買えないこと、大容量パックのほうが安いこと、
  まとめ買いした食材が傷むことを計算に入れる

## WHAT — Repo Map

```
src/
├── app/                   # Next.js App Router（static export）
│   ├── page.tsx           # トップ（質問フロー）
│   ├── dishes/[id]/       # 料理詳細（generateStaticParams で全件事前生成）
│   ├── design-system/     # デザイントークン / コンポーネントのカタログ
│   └── globals.css        # Tailwind v4 + デザイントークン
│   └── plan/              # まとめ買い献立
├── features/              # Feature単位の実装
│   ├── recommend/         # 質問フロー + タグマッチング
│   └── meal-plan/         # 献立プランナー + 買い物リスト
│       ├── components/    # Feature専用コンポーネント
│       ├── *.ts           # ドメインロジック（+ 同ディレクトリに .test.ts）
│       └── types.ts       # UI都合の複合型
├── domain/models/         # ピュアなドメインモデル（Dish / Tag / Ingredient）
├── repositories/          # データアクセス（JSON経由）
├── components/ui/         # 共通UIコンポーネント（ロジックなし）
├── constants/             # 定数（questions.ts, seasons.ts）
└── lib/                   # data.ts, ingredient-data.ts, *-schema.ts（テスト専用）, utils.ts

data/                      # 静的JSON（唯一のデータソース）
                           #   dishes.json    … tag-assign が生成。直接編集しない
                           #   ingredients.json / dish-ingredients.json … 手で管理
scripts/                   # データ構築スクリプト（アプリからは参照されない）

docs/
├── spec/                  # Requirements, user stories, interview records
├── architecture.md        # System architecture (this file's detail version)
└── adr/                   # Architecture Decision Records

tasks/                     # Task files (single source of truth for status)
├── TASK-XXX.md            # Individual tasks with checkboxes
└── lessons.md             # Team learnings & corrections

.claude/                   # Agents, skills, rules, hooks, commands
```

## HOW — Rules & Commands

### Tech Stack

- Next.js 16 (App Router, `output: "export"`) + React 19 + TypeScript strict
- Tailwind v4（`@theme inline` + CSS変数トークン）+ cva + clsx + tailwind-merge
- Zod v4（データスキーマ検証。**テストとスクリプトからのみ import する**）
- Biome (lint + format)
- Vitest (unit test, happy-dom) + @testing-library/react
- GitHub Pages デプロイ（`.github/workflows/deploy.yml`）

**DBなし**（ADR-005）。Prisma / PostgreSQL は使わない。
**サーバーなし**（ADR-006）。Server Actions / Route Handlers / `unstable_cache` は
静的エクスポートでは動かないので書かないこと。
react-hook-form / Playwright / shadcn/ui レジストリは未導入。

### Architecture Boundaries

- `domain/models/` にはピュアなモデル型のみ
- UI都合の複合型は `features/` 内に閉じ込める
- `features/` 以外から `features/` をimportしてはならない（app/のpage.tsxは例外）

### Data Flow

- Read（ビルド時）: Server Component → repositories/ → lib/data.ts → data/dishes.json
- Read（実行時）: Client Component → lib/data.ts（バンドル同梱）→ features/*/scoring.ts
- データ更新は `scripts/` を実行して JSON を書き換え、再デプロイする

### Dev Flow

共通Component(src/components/) → ページUI(mockdata) → 動的化(実データ)

### Key Rules

- Design tokens only. No hardcoded colors or sizes
- Server Components by default. 'use client' only when needed
- Zod for all validation. Types via z.infer
- Biome for lint + format (not ESLint/Prettier)
- Update tasks/TASK-XXX.md status + checkboxes on every state change

### Lessons（自己改善ループ — 最重要）

tasks/lessons.md はプロジェクトの「学習記憶」。以下を厳守:

- **読む**: セッション開始時、タスク着手前、計画作成時に必ず関連教訓を確認
- **書く**: ユーザーから修正を受けたら即座に記録。タスク完了時に振り返り。レビュー指摘も記録
- **活用**: 同カテゴリの教訓が3回溜まったら rules/ へのルール昇格を提案

### Context Management

- Do NOT run long sessions with auto-compact. Split: investigate → plan → execute
- Use Plan mode (Shift+Tab) for 3+ step tasks
- Delegate investigation to sub-agents

### Git

- Branch: feature/TASK-XXX-{desc} or fix/TASK-XXX-{desc}
- Commit: {type}(TASK-XXX): {description}
- PR: [TASK-XXX] {description} with closes #{issue}

### Skills (workflow)

/product-start, /product-resume, /add-feature, /status, /task-plan,
/task-start, /task-done, /bug-fix, /design-system, /component-add,
/figma-sync, /page-create, /db-schema, /review, /setup, /pre-deploy

### Commands (quick actions)

/commit, /check, /plan, /learn, /diff, /update-docs, /guard,
/ds-gen, /task-run, /task-list

### MCP Servers

- GitHub — PR/Issue管理
- Context7 — 最新ドキュメント参照
- Figma — デザインデータ解析・トークン取得
- Playwright — E2Eテスト・UI確認
- PostgreSQL — DB確認
- Memory — セッション間記憶
