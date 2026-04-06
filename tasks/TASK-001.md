# TASK-001: プロジェクト初期セットアップ

## Meta
- status: in-progress
- priority: critical
- estimated_hours: 3
- assignee:
- github_issue:
- depends_on: []
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at:
- milestone: MVP
- labels: [setup]

## Description
Next.js 16 App Router + TypeScript strict + Tailwind v4 + shadcn/ui + Biome の環境を構築する。
DBなし構成（静的JSONファイル）を採用するため、Prisma・PostgreSQLは不要。
開発に必要な全ての基盤を整え、以降のタスクがスムーズに進められる状態にする。

## Acceptance Criteria
- [x] Next.js 16 App Router プロジェクトが動作する
- [x] TypeScript strict モードが有効
- [x] Tailwind v4 が適用されている
- [ ] shadcn/ui がインストール済みで、サンプルコンポーネントが表示できる
- [x] Biome でlint + format が実行できる（エラー0）
- [x] Vitest のセットアップが完了している
- [x] `.env.example` が作成されている（最小限）
- [x] `data/dishes.json` の空テンプレートが作成されている

## Sub Tasks
- [x] `create-next-app` で Next.js 16 プロジェクト作成（TypeScript, App Router, Tailwind）
- [x] Tailwind v4 の適用確認・必要なら手動アップグレード（create-next-appがv4を同梱）
- [ ] shadcn/ui のインストール・初期設定
- [x] Biome のインストール・設定（`biome.json`）
- [x] `package.json` のスクリプト整備（`dev`, `build`, `check`, `format`, `test`）
- [x] Vitest のインストール・設定（`vitest.config.ts`）
- [x] `data/dishes.json` 空テンプレート作成（`{ "dishes": [], "tags": [] }`）
- [x] `.env.example` 作成（最小限）
- [x] `git checkout -b feature/TASK-001-initial-setup`

## Technical Notes
- shadcn/ui の初期テーマはデフォルトで OK（デザインシステムは TASK-005 で構築）
- Prisma・PostgreSQL は不要（ADR-005: DBなし設計）
- Tailwind v4 は `@tailwindcss/vite` 系の設定が必要（`tailwind.config.ts` 不要）

## Files to Create/Modify
- `package.json`: 依存関係追加
- `biome.json`: Biome設定
- `vitest.config.ts`: Vitest設定
- `data/dishes.json`: 空テンプレート
- `.env.example`: 環境変数テンプレート（最小限）

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | started | DBなし構成（静的JSON）に変更。Prisma関連を除去 |
| 2026-04-06 | note | Next.js 16.2.2 + Tailwind v4 + Biome v2 + Vitest v4 インストール完了 |
