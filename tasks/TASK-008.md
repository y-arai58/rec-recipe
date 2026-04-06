# TASK-008: 料理詳細・タグ確認画面実装

## Meta
- status: done
- priority: medium
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-005, TASK-006]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [feature, page]

## Description
レコメンド結果の料理をタップしたときに表示される詳細画面。
料理名と付与されたタグをカテゴリ別に表示する。

## Acceptance Criteria
- [x] `app/dishes/[id]/page.tsx` に詳細画面が実装されている
- [x] 料理名が大きく表示されている
- [x] タグがカテゴリ別にグループ化されて表示されている
- [x] タグは `TagBadge` コンポーネントで表示されている
- [x] 「戻る」ボタンでレコメンド結果に戻れる
- [x] 存在しない料理IDでアクセスした場合は 404 を返す
- [x] スマホ（375px）でレイアウトが崩れない

## Sub Tasks
- [x] `app/dishes/[id]/page.tsx` 実装（Server Component）
- [x] `repositories/dishRepository.ts` に `findById` メソッド追加
- [x] タグをカテゴリ別にグループ化する処理実装
- [x] 404 ハンドリング（`notFound()` を使用）
- [x] スマホ・PC でレスポンシブ確認

## Technical Notes
- `generateStaticParams` でビルド時に全料理の詳細ページを静的生成することでパフォーマンス向上
- タグのカテゴリ順序: genre → volume → base → protein → cookTime → season

## Files to Create/Modify
- `src/app/dishes/[id]/page.tsx`
- `src/repositories/dishRepository.ts`: `findById` 追加

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | completed | dishRepository + dishes/[id]/page.tsx 実装。generateStaticParams SSG・notFound・カテゴリ別TagBadge表示。tsc & biome check クリア。 |
