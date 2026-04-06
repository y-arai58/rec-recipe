# TASK-007: レコメンドロジック実装（タグマッチングスコアリング）

## Meta
- status: todo
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-004]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [feature]

## Description
ユーザーが選択したタグIDと料理のタグを照合し、スコアリングして上位 5 件を返す
タグマッチングロジックを実装する。ユニットテストも合わせて作成する。

## Acceptance Criteria
- [ ] `features/recommend/scoring.ts` にスコアリング関数が実装されている
- [ ] ユーザー選択タグと料理タグの一致数でスコアリングできる
- [ ] 上位 5 件が返される（同スコアはランダムシャッフル）
- [ ] 同じ候補が連続して出ないよう除外ロジックがある（再レコメンド時）
- [ ] `scoring.test.ts` でユニットテストが通る

## Sub Tasks
- [ ] `features/recommend/scoring.ts` 実装
  - 引数: `selectedTagIds: number[]`, `dishes: DishWithTags[]`
  - 返値: スコア降順の上位 5 件
- [ ] 同スコア内のシャッフルロジック実装
- [ ] 除外リスト対応（再レコメンド用）
- [ ] `features/recommend/queries.ts` でタグ付き全料理を取得するクエリ実装
- [ ] `scoring.test.ts` でユニットテスト作成（Vitest）

## Technical Notes
- スコア = 一致タグ数 / ユーザー選択タグ数（0〜1 の正規化スコアでもよい）
- DB に都度クエリを発行するよりも、全料理をキャッシュ（Next.js unstable_cache）してスコアリングするほうが高速

## Files to Create/Modify
- `src/features/recommend/scoring.ts`
- `src/features/recommend/queries.ts`
- `src/features/recommend/scoring.test.ts`

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
