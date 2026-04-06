# Product Start: Templates

## Interview Record Template (docs/spec/interview-record.md)
```markdown
# Interview Record

## Session: {日時}

### Category: プロダクトビジョン

#### Q1: どんなプロダクトを作りたいですか？
**A:** {回答}
**Note:** {PMとしての所感}

#### Q2: 解決する課題は何ですか？
**A:** {回答}

### Category: ターゲットユーザー
...

## Summary
- 決定事項: {list}
- 未決定事項: {list}
- 次のアクション: {list}
```

## User Stories Template (docs/spec/user-stories.md)
```markdown
# User Stories

## Epic: {機能グループ名}

### US-001: {ストーリータイトル}
- **As a** {ユーザー種別}
- **I want** {やりたいこと}
- **So that** {得られる価値}
- **Priority:** Must | Should | Could
- **Acceptance Criteria:**
  - [ ] {検証可能な条件1}
  - [ ] {検証可能な条件2}
```

## Requirements Template (docs/spec/requirements.md)
```markdown
# Requirements

## Functional Requirements

### FR-001: {要件名}
- **Description:** {説明}
- **Priority:** Must | Should | Could | Won't
- **Related:** US-XXX
- **Notes:** {補足}

## Non-Functional Requirements

### NFR-001: {要件名}
- **Category:** Performance | Security | Accessibility | SEO | Scalability
- **Description:** {説明}
- **Metric:** {計測基準}
```

## Task File Template (tasks/TASK-XXX.md)
```markdown
# TASK-XXX: {タイトル}

## Meta
- status: todo
- priority: critical | high | medium | low
- estimated_hours: {h}
- assignee:
- github_issue:
- depends_on: []
- created_at: {ISO 8601}
- started_at:
- completed_at:
- milestone: {MVP | v1.0}
- labels: [setup | design-system | feature | page | api | database | auth | test]

## Description
{目的と概要。なぜこのタスクが必要か}

## Acceptance Criteria
- [ ] {具体的かつ検証可能な完了条件1}
- [ ] {完了条件2}
- [ ] {完了条件3}

## Sub Tasks
- [ ] {サブタスク1}
- [ ] {サブタスク2}
- [ ] {サブタスク3}

## Technical Notes
{実装ヒント、使用DSコンポーネント、関連API}

## Files to Create/Modify
- {path}: {何をするか}

## Progress Log
| Date | Action | Note |
|------|--------|------|
| {today} | created | Task created by /task-plan |
```
