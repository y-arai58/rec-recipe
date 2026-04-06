# Project: {プロジェクト名}

## WHY — Purpose

{このプロダクトが何を解決するか。1-2文で}

## WHAT — Repo Map

```
src/
├── app/                   # Next.js App Router
│   ├── api/               # 外部連携用APIルート（Webhook等）
│   └── (dashboard)/       # 認証後のページ
├── features/              # Feature単位の実装
│   └── {service}/{feature}/
│       ├── components/    # Feature専用コンポーネント
│       ├── actions.ts     # Server Actions
│       ├── queries.ts     # JOINを含む複合クエリ
│       ├── validation.ts  # Zodバリデーション
│       └── types.ts       # UI都合の複合型
├── domain/models/         # ピュアなドメインモデル + Repositoryインターフェース
├── repositories/          # Repository実装（Prisma）
├── components/            # 共通UIコンポーネント（ロジックなし）
├── lib/                   # 外部サービス連携
├── hooks/                 # Reactカスタムフック
├── constants/             # 定数
├── types/                 # 共通型定義
├── utils/                 # ユーティリティ
└── styles/                # グローバルスタイル

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

- Next.js 16 (App Router) + TypeScript strict + Tailwind v4
- Prisma (PostgreSQL) + マルチスキーマ構成
- shadcn/ui + clsx + tailwind-merge
- react-hook-form + Zod
- Biome (lint + format)
- Vitest (unit test)
- Playwright (E2E)

### Architecture Boundaries

- `domain/models/` にはピュアなモデルとRepositoryインターフェースのみ
- UI都合の型（JOINあり）は `features/` 内に閉じ込める
- `features/` 以外から `features/` をimportしてはならない（app/のpage.tsxは例外）

### Data Flow

- Read: Server Component → Repository or features/queries.ts → Prisma
- Write: Client Form → Server Action → Zod → Repository → Prisma → revalidatePath

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
