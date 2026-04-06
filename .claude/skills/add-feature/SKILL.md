---
name: add-feature
description: 進行中プロジェクトに新機能追加。既存仕様読み取り→差分ヒアリング→影響分析→仕様更新→タスク追加→Issue作成。
---

# Add Feature

ultrathink

1. 既存ドキュメント読み込み（requirements, architecture, tasks, design-system-docs）
2. 差分ヒアリング（AskUserQuestion: 機能説明、配置ページ、DB変更、優先度）
3. 影響分析（DB/API/Pages/DS/既存タスクへの影響 + リスク）→ ユーザー確認
4. ドキュメント更新（requirements, user-stories, architecture, context-notes）
5. 重要判断は docs/adr/ に記録
6. 新タスク作成 + GitHub Issue
