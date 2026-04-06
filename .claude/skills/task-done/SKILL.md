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

## 5. 次タスク提案
depends_on でブロック解消されたタスクを検出 → 優先度順に提案。
