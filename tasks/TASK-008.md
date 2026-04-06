# TASK-008: 料理詳細・タグ確認画面実装

## Meta
- status: todo
- priority: medium
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-005, TASK-006]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [feature, page]

## Description
レコメンド結果の料理をタップしたときに表示される詳細画面。
料理名と付与されたタグをカテゴリ別に表示する。

## Acceptance Criteria
- [ ] `app/dishes/[id]/page.tsx` に詳細画面が実装されている
- [ ] 料理名が大きく表示されている
- [ ] タグがカテゴリ別にグループ化されて表示されている
- [ ] タグは `TagBadge` コンポーネントで表示されている
- [ ] 「戻る」ボタンでレコメンド結果に戻れる
- [ ] 存在しない料理IDでアクセスした場合は 404 を返す
- [ ] スマホ（375px）でレイアウトが崩れない

## Sub Tasks
- [ ] `app/dishes/[id]/page.tsx` 実装（Server Component）
- [ ] `repositories/dishRepository.ts` に `findById` メソッド追加
- [ ] タグをカテゴリ別にグループ化する処理実装
- [ ] 404 ハンドリング（`notFound()` を使用）
- [ ] スマホ・PC でレスポンシブ確認

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
