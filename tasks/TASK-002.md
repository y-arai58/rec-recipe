# TASK-002: JSONデータスキーマ設計・型定義

## Meta
- status: done
- priority: critical
- estimated_hours: 2
- assignee:
- github_issue:
- depends_on: [TASK-001]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [data]

## Description
料理・タグデータの TypeScript 型定義と `data/dishes.json` のスキーマを確定する。
DBなし構成のため、Prismaスキーマ・マイグレーションは不要。
ドメインモデルは純粋な TypeScript 型として定義する。

## Acceptance Criteria
- [x] `Dish`, `Tag` の TypeScript 型が定義されている
- [x] `TagCategory` に 6 カテゴリ（genre/volume/base/cookTime/protein/season）が定義されている
- [x] `data/dishes.json` のスキーマ（構造）がドキュメント化されている
- [x] `domain/models/dish.ts` にドメインモデル型が定義されている
- [x] `domain/models/tag.ts` にドメインモデル型が定義されている
- [x] JSON読み込み用のユーティリティ関数が実装されている

## Sub Tasks
- [x] `domain/models/tag.ts` 作成（Tag型 + TagCategory union型）
- [x] `domain/models/dish.ts` 作成（Dish型 + DishWithTags型）
- [x] `data/dishes.json` のスキーマをコメントで明文化
- [x] `src/lib/data.ts` 作成（JSON読み込み関数）
- [x] Zodスキーマで dishes.json のバリデーション定義

## Technical Notes
- TagCategory は `as const` + ユニオン型で管理（enum禁止）
- `src/lib/data.ts` でJSONをimportしてZodでparse → 型安全なデータ取得
- Next.js の静的import（`import data from '@/data/dishes.json'`）を活用

## Files to Create/Modify
- `src/domain/models/tag.ts`: Tag型定義
- `src/domain/models/dish.ts`: Dish型定義
- `src/lib/data.ts`: JSON読み込みユーティリティ
- `data/dishes.json`: スキーマコメント追加

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | updated | DBスキーマ→JSONスキーマ・型定義に変更（ADR-005: DBなし設計） |
| 2026-04-06 | completed | domain/models/{tag,dish}.ts, src/lib/data.ts, data/dishes.schema.json 作成。zod追加。TypeScript/Biomeエラーなし。 |
