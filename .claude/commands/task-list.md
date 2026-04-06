タスク一覧をチェックボックスの進捗付きで表示する。

1. tasks/ ディレクトリの全 TASK-XXX.md を読む
2. 各タスクから status, priority, title, チェックボックス完了率を抽出
3. 以下の形式で一覧表示する:

```
📋 Task List

✅ Done
  TASK-001: 環境構築 [5/5 ✓] done 2025-01-15

🔄 In Progress
  TASK-003: 認証機能 [3/7 ✓] started 2025-01-17
  TASK-004: ダッシュボード [1/5 ✓] started 2025-01-18

📝 Todo (ready)
  TASK-005: ユーザー設定 [0/4] [high] depends: ✅
  TASK-006: 通知機能 [0/3] [medium] depends: ✅

🚫 Blocked
  TASK-007: メール連携 [0/3] blocked by TASK-003

📝 Todo (blocked)
  TASK-008: レポート [0/6] depends: TASK-005, TASK-006
```

$ARGUMENTS でフィルタ可能:
- `/task-list active` → in-progress のみ
- `/task-list ready` → 着手可能なもののみ
- `/task-list done` → 完了済みのみ
