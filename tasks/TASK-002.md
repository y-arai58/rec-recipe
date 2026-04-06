# TASK-002: DBスキーマ設計・マイグレーション

## Meta
- status: todo
- priority: critical
- estimated_hours: 3
- assignee:
- github_issue:
- depends_on: [TASK-001]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [database]

## Description
料理・タグ・料理-タグ中間テーブルの Prisma スキーマを定義し、マイグレーションを実行する。
ドメインモデルとRepositoryインターフェースも合わせて定義する。

## Acceptance Criteria
- [ ] `Dish`, `Tag`, `DishTag` モデルが `schema.prisma` に定義されている
- [ ] `Tag.category` に 6 カテゴリ（genre/volume/base/cookTime/protein/season）が定義されている
- [ ] マイグレーションが成功し、テーブルが作成されている
- [ ] `domain/models/dish.ts` にドメインモデル型と `DishRepository` インターフェースが定義されている
- [ ] `domain/models/tag.ts` にドメインモデル型と `TagRepository` インターフェースが定義されている
- [ ] Prisma Studio でテーブル確認ができる

## Sub Tasks
- [ ] `prisma/schema.prisma` に Dish / Tag / DishTag モデルを定義
- [ ] `prisma migrate dev` でマイグレーション実行
- [ ] `domain/models/dish.ts` 作成（型 + Repository インターフェース）
- [ ] `domain/models/tag.ts` 作成（型 + Repository インターフェース）
- [ ] `repositories/dishRepository.ts` 作成（Prisma実装）
- [ ] `repositories/tagRepository.ts` 作成（Prisma実装）
- [ ] Prisma Studio で動作確認

## Technical Notes
- Tag.category は TypeScript の union 型 + as const で管理（enum 禁止）
- DishTag は複合主キー（dishId + tagId）

## Files to Create/Modify
- `prisma/schema.prisma`: モデル定義追加
- `domain/models/dish.ts`: ドメインモデル
- `domain/models/tag.ts`: ドメインモデル
- `repositories/dishRepository.ts`: Repository実装
- `repositories/tagRepository.ts`: Repository実装

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
