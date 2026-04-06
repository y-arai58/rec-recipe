---
name: task-plan
description: 仕様書・アーキテクチャからタスク分解しGitHub Issue作成。
---

# Task Planning

ultrathink

> Reference: docs/spec/requirements.md
> Reference: docs/architecture.md

1. requirements.md + architecture.md を読む
2. 既存 tasks/ の未カバー要件を特定
3. タスク分解（1タスク=1-2日、依存関係明示）
4. TASK-XXX.md 生成（チェックボックス付き Acceptance Criteria + Sub Tasks）
5. サマリー提示 → ユーザー確認
6. GitHub Issue 作成（親 + Sub-Issue、ラベル + マイルストーン）

## Task File Format
```markdown
# TASK-XXX: {title}

## Meta
- status: todo
- priority: critical|high|medium|low
- estimated_hours: {h}
- assignee:
- github_issue:
- depends_on: []
- created_at: {ISO 8601}
- started_at:
- completed_at:
- milestone:
- labels: []

## Acceptance Criteria
- [ ] {検証可能な条件}

## Sub Tasks
- [ ] {サブタスク}

## Technical Notes
{実装ヒント、使用DSコンポーネント}

## Files to Create/Modify
- {path}: {what}

## Progress Log
| Date | Action | Note |
|------|--------|------|
| {today} | created | by /task-plan |
```
