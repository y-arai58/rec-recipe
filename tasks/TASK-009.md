# TASK-009: レスポンシブ対応・パフォーマンス最適化

## Meta
- status: todo
- priority: medium
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-006, TASK-008]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: v1.0
- labels: [feature]

## Description
全画面のレスポンシブ対応を確認・修正し、パフォーマンス指標（Lighthouse）を計測・改善する。

## Acceptance Criteria
- [ ] 375px / 768px / 1280px の 3 ブレークポイントでレイアウト崩れなし
- [ ] Lighthouse Performance スコア 80 以上
- [ ] LCP 3.0 秒以内（Fast 3G 相当）
- [ ] タップターゲットが 44×44px 以上確保されている
- [ ] Server Action のレスポンスが 500ms 以内

## Sub Tasks
- [ ] 全画面のスマホ（375px）表示確認・修正
- [ ] タブレット（768px）表示確認・修正
- [ ] PC（1280px）表示確認・修正
- [ ] Lighthouse でパフォーマンス計測
- [ ] 料理データのキャッシュ戦略確認（Next.js unstable_cache）
- [ ] 画像がある場合は `next/image` で最適化

## Technical Notes
- Lighthouse は Chrome DevTools の「Lighthouse」タブから実行
- モバイルシミュレーションで計測すること

## Files to Create/Modify
- 各ページコンポーネントのレスポンシブ調整

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
