# TASK-007: レコメンドロジック実装（タグマッチングスコアリング）

## Meta
- status: done
- priority: high
- estimated_hours: 3
- assignee:
- github_issue:
- depends_on: [TASK-004]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [feature]

## Description
ユーザーが選択したタグIDと料理のタグを照合し、スコアリングして上位 5 件を返す
タグマッチングロジックを実装する。ユニットテストも合わせて作成する。
DBなし構成のため、Prismaクエリは不要。JSONファイルから読み込む。

## Acceptance Criteria
- [x] `features/recommend/scoring.ts` にスコアリング関数が実装されている
- [x] ユーザー選択タグと料理タグの一致数でスコアリングできる
- [x] 上位 5 件が返される（同スコアはランダムシャッフル）
- [x] 同じ候補が連続して出ないよう除外ロジックがある（excludeIds）
- [x] `scoring.test.ts` でユニットテストが通る（8/8）

## Sub Tasks
- [x] `features/recommend/scoring.ts` 実装（純粋関数 `scoreDishes`）
- [x] 同スコア内のシャッフルロジック実装
- [x] 除外リスト対応（excludeIds オプション）
- [x] `features/recommend/queries.ts` 作成（lib/data.ts ラッパー）
- [x] `scoring.test.ts` でユニットテスト作成・全通過（8件）

## Technical Notes
- スコア = 一致タグ数（整数。正規化不要）
- JSONからのimportは静的なので、Next.js のビルド時に解決される
- `features/recommend/queries.ts` は `import dishesData from '@/data/dishes.json'` を使用

## Files to Create/Modify
- `src/features/recommend/scoring.ts`
- `src/features/recommend/queries.ts`
- `src/features/recommend/scoring.test.ts`

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | updated | PrismaクエリをJSON読み込みに変更（ADR-005: DBなし設計） |
| 2026-04-06 | completed | scoreDishes純粋関数抽出・queries.ts・excludeIds対応・Vitestテスト8件全通過。 |
