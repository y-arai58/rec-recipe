---
name: bug-fix
description: 自律的バグ修正。報告→調査→修正→テスト→PR。手取り足取り聞かない。
---

# Bug Fix: $ARGUMENTS

ultrathink

## Principle
とにかく直す。手取り足取りの指示を求めない。根本原因を特定して解決。

## Flow
1. バグ情報収集（$ARGUMENTS or 最小限の質問）
2. 自律的に原因調査（Grep, ログ, テスト確認）→ 根本原因の仮説 → 簡潔報告
3. TASK-XXX.md 作成 ([BUG], status: in-progress) + GitHub Issue (label: bug)
4. fix ブランチで修正 + 再現テスト追加
5. `npx tsc --noEmit && npx biome check .`
6. TASK-XXX.md の全チェックを [x] に更新 → done
7. PR: `fix(TASK-XXX): {summary}`, Closes #{issue}
8. 教訓があれば tasks/lessons.md に記録
