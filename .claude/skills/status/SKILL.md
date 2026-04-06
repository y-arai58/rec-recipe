---
name: status
description: プロジェクト進捗ダッシュボード。タスク状態、チェックボックス完了率、GitHub整合性を一覧。
---

# Project Status Dashboard

1. tasks/ 全ファイルの status + チェックボックス完了率を集計
2. GitHub Issue 整合性チェック
3. ダッシュボード表示:
```
📊 Progress: [████░░░░] XX% (X/Y done)
📋 ✅X done | 🔄X active | 📝X todo | 🚫X blocked
🔄 Active: TASK-XXX {title} [✓3/5 checks]
⏭️ Ready: TASK-YYY [{priority}]
🎨 DS: {component count} | 📌 MVP: XX%
```
4. 不整合があれば報告 →「修正しますか？」
