# TASK-005: デザインシステム構築

## Meta
- status: todo
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-001]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [design-system]

## Description
shadcn/ui + Tailwind v4 ベースで、アース系温かみカラーのデザイントークンを定義する。
Google Stitch で生成したデザインを参照してトークンを反映させる。

## Acceptance Criteria
- [ ] アース系カラーパレットがデザイントークンとして定義されている
- [ ] プライマリ・セカンダリ・背景・テキスト色がトークンで管理されている
- [ ] Noto Sans JP + モダン見出しフォントが設定されている
- [ ] shadcn/ui のテーマがカスタムカラーで上書きされている
- [ ] Storybook または簡易プレビューページでデザイントークンを確認できる

## Sub Tasks
- [ ] Google Stitch にデザインプロンプト（context-notes.md 参照）を送付
- [ ] 生成されたデザインからカラーパレット・タイポグラフィを抽出
- [ ] `styles/globals.css` に CSS カスタムプロパティでトークン定義
- [ ] shadcn/ui の `components.json` とテーマを調整
- [ ] 共通コンポーネント: `TagBadge`（タグ表示）・`Button` を作成
- [ ] `/design-system` ページで動作確認

## Technical Notes
- カラー方針: ベージュ（背景）・テラコッタ/ブラウン（プライマリ）・オフホワイト（カード）
- Tailwind v4 の `@theme` ブロックでトークンを定義する
- shadcn/ui はデフォルトテーマを上書きする形で適用

## Files to Create/Modify
- `src/styles/globals.css`: デザイントークン定義
- `src/components/TagBadge.tsx`: タグバッジ共通コンポーネント
- `src/components/Button.tsx`: ボタン共通コンポーネント

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
