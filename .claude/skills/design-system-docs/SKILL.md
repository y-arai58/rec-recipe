---
name: design-system-docs
description: デザインシステムのコンポーネント一覧と使い方リファレンス。コンポーネント使用・作成時に自動参照。追加時に更新必須。
---

# Design System Reference

> コンポーネント追加時に必ずこのファイルを更新すること。
> Reference: https://ui.shadcn.com/docs

## Base: shadcn/ui (カスタムテーマ適用済み)

## Tokens
- Colors: globals.css (CSS変数) + tailwind.config.ts
- Typography / Spacing / Radius / Shadows

## Utility: cn() — lib/utils.ts

## Installed shadcn/ui Components
（/design-system 実行後に更新）

## Custom Components
（追加時に以下フォーマットで追記）
<!--
### {Name}
- **Path:** `src/components/{Name}/{Name}.tsx`
- **Props:** variant, size, className, children
- **Usage:** `<Name variant="default">Content</Name>`
- **Edge Cases:** 長文OK / 0件EmptyState / truncate対応
-->

## Rules
- 新UI前にこのリファレンス確認。shadcn/ui にあればそのまま使う
- マジックナンバー禁止。トークン経由のみ
