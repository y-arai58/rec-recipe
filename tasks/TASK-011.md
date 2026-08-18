# TASK-011: 再レコメンド（FR-007）と選定理由の表示

## Meta
- status: done
- priority: high
- estimated_hours: 3
- assignee:
- github_issue:
- depends_on: [TASK-007, TASK-010]
- created_at: 2026-07-31T00:00:00+09:00
- started_at: 2026-07-31T00:00:00+09:00
- completed_at: 2026-07-31T00:00:00+09:00
- milestone: v1.0
- labels: [feature]

## Description

FR-007「再レコメンド」が未実装だった。`scoreDishes` は `excludeIds` を受け取れるのに
UIから渡す導線がなく、結果画面の「もう一度」は質問のやり直し（全リセット）だった。

あわせて ADR-002 が掲げる「透明性」に対して、なぜその料理が選ばれたのかが
画面上どこにも出ていなかったため、一致タグを可視化する。

## Acceptance Criteria
- [x] 結果画面から「他の候補を見る」で、提示済みを除いた次の候補が出る
- [x] 候補を出しきったら、その旨を表示してボタンを隠す
- [x] 「条件を変える」で回答を保持したまま質問画面に戻れる
- [x] 「最初から」で全リセットできる
- [x] 各カードに一致したタグ数が出る
- [x] 一致したタグがカード内で先頭に並び、強調表示される
- [x] 条件を1つも選ばなかった場合、結果がランダムである旨を明示する
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] `scoreDishes` に `matchedTagIds` を追加
- [x] `scoreDishes` の同スコアシャッフルを一貫した比較関数に修正
- [x] `scoreDishes` に `random` 注入口を追加（テストの決定性確保）
- [x] `RecommendedDish` に `matchedTagIds`、`RecommendResult` に `isRandom` を追加
- [x] `TagBadge` に `matched` variant を追加
- [x] `DishCard` で一致タグを先頭に寄せて強調
- [x] `QuestionFlow` に seenIds / 他の候補を見る / 条件を変える を実装
- [x] 選択肢ボタンに `aria-pressed` を付与
- [x] `getAllDishesWithTags()` を `useMemo` で1回だけ実行
- [x] scoring のテストを 8 → 13 件に拡充

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-07-31 | created | FR-007 の未実装と選定理由の欠落を確認 |
| 2026-07-31 | completed | tsc/biome 通過、vitest 13件 pass |

## Notes

同スコア内シャッフルが `sort((a, b) => Math.random() - 0.5)` になっており、
比較関数が呼ばれるたびに違う値を返していた。比較の一貫性が壊れているため
ソート結果が処理系依存で不定になる。料理ごとに乱数キーを1回だけ確定させる方式へ変更した。
