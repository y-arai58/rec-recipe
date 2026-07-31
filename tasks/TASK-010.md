# TASK-010: 技術負債の掃除（死にコード・CI重複・ドキュメント同期）

## Meta
- status: done
- priority: high
- estimated_hours: 2
- assignee:
- github_issue:
- depends_on: []
- created_at: 2026-07-31T00:00:00+09:00
- started_at: 2026-07-31T00:00:00+09:00
- completed_at: 2026-07-31T00:00:00+09:00
- milestone: v1.0
- labels: [chore, docs]

## Description

静的エクスポート（ADR-006）へ移行した際に残った不整合を解消する。

- README が存在しない
- `deploy.yml` と `nextjs.yml` の2つの Pages ワークフローが両方 main への push で発火する
- Server Action 系（`actions.ts` / `queries.ts` / `validation.ts`）がどこからも呼ばれていない
- ADR-005 で廃止した `prisma/` が CLAUDE.md だけ残っている
- CLAUDE.md / docs/architecture.md が Prisma・Vercel・react-hook-form 前提のまま

## Acceptance Criteria
- [x] README.md が実態（静的エクスポート・DBなし・GitHub Pages）を正確に説明している
- [x] Pages デプロイワークフローが1つだけになっている
- [x] `src/` に未使用のエクスポートが残っていない
- [x] `prisma/` が存在しない
- [x] CLAUDE.md / docs/architecture.md のディレクトリ構成・技術スタックが実際のファイルと一致する
- [x] 静的エクスポートの決定が ADR として記録されている
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] README.md 新規作成
- [x] `.github/workflows/nextjs.yml` 削除（`deploy.yml` を残す）
- [x] `features/recommend/{actions,queries,validation}.ts` 削除
- [x] `prisma/` 削除
- [x] docs/architecture.md を実態に合わせて書き直し
- [x] CLAUDE.md の Repo Map / Tech Stack / Data Flow を修正
- [x] ADR-006（静的エクスポート）を追加
- [x] tsc / biome / vitest 実行

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-07-31 | created | README不在の調査中に実態とドキュメントのズレを多数発見 |
| 2026-07-31 | completed | 削除5ファイル・新規3ファイル・更新2ファイル。tsc/biome/vitest 全通過 |

## Notes

`nextjs.yml` ではなく `deploy.yml` を残した理由:
`nextjs.yml` は `actions/configure-pages` の `static_site_generator: next` で
basePath を自動注入するため、`next.config.ts` の手動 `basePath` と競合しうる。

`npm run build` のローカル検証は `next/font/google` が Google Fonts への
ネットワークアクセスを必要とするため、サンドボックス環境では実行できない。CI 側で検証する。
