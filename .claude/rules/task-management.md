# Task Management

## Task File = Single Source of Truth
tasks/TASK-XXX.md の status が唯一の状態ソース。GitHub Issue は従属。

## Status: todo → in-progress → done (or → blocked → in-progress → done)
- in-progress: started_at 記録
- done: completed_at 記録
- blocked: Progress Log にブロック理由

## Checkbox Tracking（重要）
Acceptance Criteria と Sub Tasks のチェックボックスは完了時に必ず更新する:
- [ ] 未完了の項目
- [x] 完了した項目
タスクの完了度は「チェック済み / 全チェック数」で把握できるようにする。
/task-done 時に全チェックが入っていることを確認する。

## Progress Log
| Date | Action | Note |
Action: created / started / completed / blocked / note

## Lessons (tasks/lessons.md)
- 修正があったら必ず記録
- セッション開始時に関連教訓を見直す

## Priority
critical(即時) / high(MVP必須) / medium(v1.0) / low(Nice to have)
