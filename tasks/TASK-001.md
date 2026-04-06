# TASK-001: プロジェクト初期セットアップ

## Meta
- status: todo
- priority: critical
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: []
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [setup]

## Description
Next.js 16 App Router + TypeScript strict + Tailwind v4 + shadcn/ui + Prisma + Biome の環境を構築する。
開発に必要な全ての基盤を整え、以降のタスクがスムーズに進められる状態にする。

## Acceptance Criteria
- [ ] Next.js 16 App Router プロジェクトが動作する
- [ ] TypeScript strict モードが有効
- [ ] Tailwind v4 が適用されている
- [ ] shadcn/ui がインストール済みで、サンプルコンポーネントが表示できる
- [ ] Prisma + PostgreSQL 接続が確認できる
- [ ] Biome でlint + format が実行できる（エラー0）
- [ ] Vitest のセットアップが完了している
- [ ] `.env.local` のテンプレート（`.env.example`）が作成されている

## Sub Tasks
- [ ] `create-next-app` で Next.js 16 プロジェクト作成（TypeScript, App Router, Tailwind）
- [ ] Tailwind v4 に更新（必要な場合）
- [ ] shadcn/ui のインストール・初期設定
- [ ] Biome のインストール・設定（`biome.json`）
- [ ] Prisma のインストール・`schema.prisma` 初期作成
- [ ] `.env.example` 作成（`DATABASE_URL` 等）
- [ ] Vitest のインストール・設定
- [ ] `package.json` のスクリプト整備（`dev`, `build`, `check`, `format`, `test`）
- [ ] CLAUDE.md を `prisma/` に配置（危険モジュールガード）

## Technical Notes
- shadcn/ui の初期テーマはデフォルトで OK（デザインシステムは TASK-005 で構築）
- Prisma の接続先は開発環境のローカルDB or Supabase

## Files to Create/Modify
- `package.json`: 依存関係追加
- `biome.json`: Biome設定
- `prisma/schema.prisma`: 初期スキーマ
- `.env.example`: 環境変数テンプレート
- `prisma/CLAUDE.md`: 危険モジュールガード

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
