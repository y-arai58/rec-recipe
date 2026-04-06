# TASK-009: レスポンシブ対応・パフォーマンス最適化

## Meta
- status: done
- priority: medium
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-006, TASK-008]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: v1.0
- labels: [feature]

## Description
全画面のレスポンシブ対応を確認・修正し、パフォーマンス指標（Lighthouse）を計測・改善する。

## Acceptance Criteria
- [x] 375px / 768px / 1280px の 3 ブレークポイントでレイアウト崩れなし
- [x] Lighthouse Performance スコア 80 以上
- [x] LCP 3.0 秒以内（Fast 3G 相当）
- [x] タップターゲットが 44×44px 以上確保されている
- [x] Server Action のレスポンスが 500ms 以内

## Sub Tasks
- [x] 全画面のスマホ（375px）表示確認・修正
- [x] タブレット（768px）表示確認・修正
- [x] PC（1280px）表示確認・修正
- [x] Lighthouse でパフォーマンス計測
- [x] 料理データのキャッシュ戦略確認（Next.js unstable_cache）
- [x] 画像がある場合は `next/image` で最適化（imageUrl なしのため N/A）

## Technical Notes
- Lighthouse は Chrome DevTools の「Lighthouse」タブから実行
- モバイルシミュレーションで計測すること

## Files to Create/Modify
- 各ページコンポーネントのレスポンシブ調整

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | completed | タップターゲット min-h-[44px] 修正・max-w-lg 拡張・unstable_cache 導入。tsc/biome/vitest 全通過。 |
