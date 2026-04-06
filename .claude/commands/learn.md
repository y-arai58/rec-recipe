---
name: task-done
description: タスク完了。チェックボックス全確認→品質検証→PR作成→Issue更新。引数にTASK番号。
---

# Task Done: $ARGUMENTS

## 1. チェックボックス検証（必須）

tasks/$ARGUMENTS.md の全チェックボックスを確認:

- Acceptance Criteria: 全て [x] か
- Sub Tasks: 全て [x] か
- 未チェックがあれば警告し、残作業を確認

## 2. 品質検証（スキップ禁止）

```bash
npx tsc --noEmit
npx biome check .
```

自問:「スタッフエンジニアがこれを承認するか？」

## 3. ステータス更新

status → done, completed_at 記録。Progress Log 更新。

## 4. Git & PR

```bash
git add -A && git commit -m "feat($ARGUMENTS): complete implementation"
git push -u origin feature/$ARGUMENTS-{desc}
```

PR作成: [TASK-XXX] {title}, Closes #{issue}

## 5. Lessons 振り返り（タスク完了時に必ず実行）

このタスクの実装を振り返る:

- ユーザーから修正指示を受けた箇所はあったか？ → あれば lessons.md に記録
- 予想外にハマったポイントはあったか？ → あれば記録
- 次に同じようなタスクをやるとき、最初から知っておきたかったことは？ → あれば記録
- 何も学びがなければ記録不要（無理に書かない）

記録後、同カテゴリの教訓が3件以上溜まっていないか確認 → 溜まっていれば rules/ 昇格を提案

## 6. 次タスク提案

depends_on でブロック解消されたタスクを検出 → 優先度順に提案。
