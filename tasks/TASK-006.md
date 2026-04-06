# TASK-006: レコメンド画面実装（質問フロー）

## Meta
- status: done
- priority: high
- estimated_hours: 8
- assignee:
- github_issue:
- depends_on: [TASK-004, TASK-005]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [feature, page]

## Description
アプリのメイン画面。質問フロー（3〜5問）に答えると料理が 3〜5 件レコメンドされる。
質問はモックデータで先にUIを構築し、その後 Server Action と接続する。

## Acceptance Criteria
- [x] `app/page.tsx` にレコメンド画面が実装されている
- [x] 質問が 1 問ずつ表示され、選択肢ボタンで回答できる
- [x] 進捗（何問中何問目）が表示される
- [x] 全質問回答後にレコメンド結果（料理カード 3〜5 件）が表示される
- [x] 料理カードをタップすると詳細画面（/dishes/[id]）に遷移できる
- [x] 「もう一度」ボタンで最初から質問をやり直せる
- [x] スマホ（375px）max-w-md で対応

## Sub Tasks
- [x] `constants/questions.ts` に質問・選択肢・タグマッピングを定義（4問）
- [x] `QuestionFlow.tsx` コンポーネント実装（Client Component、useTransition）
- [x] `DishCard.tsx` コンポーネント実装（レコメンド結果カード）
- [x] `features/recommend/actions.ts` の Server Action 実装（Zod + タグスコアリング）
- [x] `app/page.tsx` で全体を組み上げ

## Technical Notes
- QuestionFlow は `useState` で現在の質問インデックスを管理（Client Component）
- Server Action への引数は「選択されたタグID配列」（Zod でバリデーション）
- DishCard はクリッカブルにして `/dishes/[id]` に遷移

## Files to Create/Modify
- `src/app/page.tsx`: メインページ
- `src/constants/questions.ts`: 質問フロー定義
- `src/features/recommend/components/QuestionFlow.tsx`
- `src/features/recommend/components/DishCard.tsx`
- `src/features/recommend/actions.ts`
- `src/features/recommend/validation.ts`
- `src/features/recommend/types.ts`

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | completed | QuestionFlow(4問)+Server Action(タグスコアリング)+DishCard+page.tsx実装。TypeScript/Biomeエラーなし。 |
