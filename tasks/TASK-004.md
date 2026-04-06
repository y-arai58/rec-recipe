# TASK-004: タグ体系設計・データ投入

## Meta
- status: done
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-002, TASK-003]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [database]

## Description
6 カテゴリのタグ体系を設計し、全料理にタグを付与する。
タグ付与は AI（ChatGPT等）を活用して一括処理する。

## Acceptance Criteria
- [x] 6 カテゴリ（genre/volume/base/cookTime/protein/season）でタグが設計されている
- [x] タグ総数が 50〜100 件程度に収まっている（48タグ）
- [x] 全料理（200件以上）に 5〜10 タグが付与されている（平均6.2個）
- [x] タグデータが `data/tags.json` に定義されている（ADR-005: DBなし）
- [x] 料理-タグ紐付けが `data/dishes.json` の tagIds に格納されている
- [x] `scripts/tag-assign.ts` でタグ付与を再現できる（idempotent）

## Sub Tasks
- [x] タグ一覧の設計（6 カテゴリ × 各 4〜14 タグ、計48タグ）
- [x] ルールベースの自動タグ付与スクリプト作成（`scripts/tag-assign.ts`）
- [x] 全224料理にタグ付与（平均6.2タグ/料理）
- [x] `data/tags.json` にタグマスターデータ作成
- [x] `data/dishes.json` に tagIds 統合

## Technical Notes
- AI プロンプト例: 「以下の料理名リストに対して、指定のタグカテゴリからタグを付与してください。各料理に 5〜10 タグをJSONで出力してください。」
- シードスクリプトは idempotent に作成（何度実行しても同じ結果）

## Files to Create/Modify
- `prisma/seed.ts`: シードスクリプト
- `prisma/data/tags.json`: タグマスターデータ
- `prisma/data/dish_tags.json`: 料理-タグ紐付けデータ
- `package.json`: `prisma.seed` の設定追加

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | completed | ADR-005対応: Prisma廃止→JSON管理。data/tags.json(48タグ), scripts/tag-assign.ts実装。224料理に平均6.2タグ付与完了。 |
