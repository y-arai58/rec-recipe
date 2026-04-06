---
name: task-start
description: 指定タスクの実装開始。依存チェック→計画→実装。引数にTASK番号。
---

# Task Start: $ARGUMENTS

ultrathink

> Reference: .claude/skills/design-system-docs/SKILL.md
> Reference: .claude/skills/tailwind-best-practices/SKILL.md
> Reference: .claude/skills/anti-ai-design/SKILL.md

1. tasks/$ARGUMENTS.md 読み込み + tasks/lessons.md の関連教訓確認
2. status/depends_on チェック（blocked/未完了依存→中止）
3. status → in-progress, started_at 記録
4. Plan Mode で実装計画提示 → ユーザー確認
5. Sub Tasks を1つずつ実装
6. 完了した Sub Task/Acceptance Criteria のチェックを [x] に更新
7. Progress Log に記録
8. 新コンポーネント作成時は design-system-docs 更新
9. Git: `git checkout -b feature/$ARGUMENTS-{desc}`
10. 各Sub Task完了時: `git commit -m "feat($ARGUMENTS): {desc}"`
