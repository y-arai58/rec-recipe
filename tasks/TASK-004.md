# TASK-004: タグ体系設計・データ投入

## Meta
- status: todo
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-002, TASK-003]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [database]

## Description
6 カテゴリのタグ体系を設計し、全料理にタグを付与する。
タグ付与は AI（ChatGPT等）を活用して一括処理する。

## Acceptance Criteria
- [ ] 6 カテゴリ（genre/volume/base/cookTime/protein/season）でタグが設計されている
- [ ] タグ総数が 50〜100 件程度に収まっている
- [ ] 全料理（200件以上）に 5〜10 タグが付与されている
- [ ] タグデータが `Tag` テーブルに投入されている
- [ ] 料理-タグ紐付けが `DishTag` テーブルに投入されている
- [ ] シードスクリプト（`prisma/seed.ts`）でタグ・紐付けを再現できる

## Sub Tasks
- [ ] タグ一覧の設計（6 カテゴリ × 各 5〜20 タグ）
- [ ] AI でタグ付与するためのプロンプト作成
- [ ] TASK-003 で出力した `dish_name_list.json` を AI に渡してタグ付与
- [ ] AI 出力を JSON 形式に整形（`dish_tags.json`）
- [ ] シードスクリプト（`prisma/seed.ts`）作成
- [ ] `npx prisma db seed` で全データ投入確認

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
