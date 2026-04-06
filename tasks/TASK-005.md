# TASK-005: デザインシステム構築

## Meta
- status: done
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-001]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [design-system]

## Description
shadcn/ui + Tailwind v4 ベースで、アース系温かみカラーのデザイントークンを定義する。
Google Stitch で生成したデザインを参照してトークンを反映させる。

## Acceptance Criteria
- [x] アース系カラーパレットがデザイントークンとして定義されている
- [x] プライマリ・セカンダリ・背景・テキスト色がトークンで管理されている
- [x] Noto Sans JP フォントが設定されている
- [x] shadcn/ui のテーマがカスタムカラーで上書きされている
- [x] `/design-system` ページでデザイントークンを確認できる

## Sub Tasks
- [x] `src/app/globals.css` に CSS カスタムプロパティでトークン定義（Tailwind v4 @theme）
- [x] `src/app/layout.tsx` に Noto Sans JP 設定
- [x] `src/components/ui/button.tsx` をアース系テーマに調整
- [x] `src/components/ui/tag-badge.tsx` 作成（カテゴリ別カラー）
- [x] `src/app/design-system/page.tsx` 作成（プレビューページ）
- [x] design-system-docs 更新

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
| 2026-04-06 | completed | アーストーンDS構築。globals.css トークン定義、Noto Sans JP、Button調整、TagBadge新規、/design-system ページ作成、DS docs更新。 |
