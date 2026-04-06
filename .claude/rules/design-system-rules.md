---
paths:
  - "src/components/**/*"
  - "src/features/**/components/**/*"
  - "src/app/**/*.tsx"
  - "src/styles/**/*"
---

# Design System Rules

## Token Usage
- ❌ text-[#333] bg-[#f5f5f5] p-[13px] rounded-[10px]
- ✅ text-foreground bg-muted p-3 rounded-lg

## shadcn/ui First
1. そのまま使う → 2. 拡張(Wrapper) → 3. 自作(なければのみ)

## Component Pattern
cva + forwardRef + displayName + cn() + className prop
アクセシビリティ: aria, キーボードナビ, コントラスト4.5:1+

## Anti-AI Design（必須チェック）
- 画面の主役を1つに絞る
- テンプレ的並べを避ける
- 色の役割を分ける（同一色に複数意味禁止）
- 長文/0件/異常値で破綻しないか
- 不要な装飾を最後に削る

## After Creating Component
1. design-system-docs スキル更新
2. `feat(design-system): add {Name}` でコミット
