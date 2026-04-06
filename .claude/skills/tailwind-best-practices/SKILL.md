---
name: tailwind-best-practices
description: Tailwind CSS v4のベストプラクティス。クラス設計、レスポンシブ、カスタマイズ、パフォーマンス最適化の知識を提供。UIコンポーネント作成時に自動参照。
---

# Tailwind CSS v4 Best Practices

See @references/common-patterns.md for layout patterns and cva templates.

> Reference: https://tailwindcss.com/docs
> Reference: https://tailwindcss.com/blog/tailwindcss-v4

## クラス設計原則

### 順序規則（推奨）
Layout → Sizing → Spacing → Typography → Visual → Interactive の順:
```tsx
<div className="flex items-center gap-4 w-full p-4 text-sm text-foreground bg-card rounded-lg border hover:shadow-md transition-shadow">
```

### cn() による条件付きクラス
```tsx
import { cn } from "@/lib/utils"
<button className={cn(
  "px-4 py-2 rounded-md font-medium transition-colors",
  variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
  variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

## レスポンシブ設計

### モバイルファースト
```tsx
// ❌ デスクトップから書いてモバイルで上書き
<div className="grid-cols-3 sm:grid-cols-1">

// ✅ モバイルから書いてデスクトップで拡張
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

### コンテナクエリ（v4）
```tsx
<div className="@container">
  <div className="@sm:flex @sm:gap-4">
    {/* コンテナ幅に応じたレイアウト */}
  </div>
</div>
```

## カラー設計

### CSS変数 + shadcn/ui テーマ
```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    /* semantic colors */
    --destructive: 0 84% 60%;
    --success: 142 76% 36%;
    --warning: 38 92% 50%;
  }
}
```

### セマンティックカラーの使い方
```tsx
// ❌ Tailwindのデフォルトパレット直接指定
<p className="text-gray-800 bg-blue-500">

// ❌ ハードコード
<p className="text-[#1a1a1a] bg-[#3b82f6]">

// ✅ セマンティックトークン
<p className="text-foreground bg-primary">
```

## スペーシング

### 一貫したスケール
4px(1), 8px(2), 12px(3), 16px(4), 20px(5), 24px(6), 32px(8), 40px(10), 48px(12)

```tsx
// ❌ 任意値
<div className="p-[13px] mt-[27px]">

// ✅ スケール
<div className="p-3 mt-6">
```

### gap で間隔統一
```tsx
// ❌ 個別margin
<div className="flex">
  <div className="mr-4">A</div>
  <div className="mr-4">B</div>
  <div>C</div>
</div>

// ✅ gap
<div className="flex gap-4">
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

## タイポグラフィ

### テキストスケール
```
text-xs(12px) text-sm(14px) text-base(16px) text-lg(18px)
text-xl(20px) text-2xl(24px) text-3xl(30px) text-4xl(36px)
```

### 行間の組み合わせ
```tsx
<h1 className="text-3xl font-bold tracking-tight">    // 見出し: tight
<p className="text-base leading-relaxed">              // 本文: relaxed
<span className="text-xs text-muted-foreground">       // 注釈: muted
```

## パフォーマンス

### 不要なクラスを避ける
```tsx
// ❌ 重複・無意味
<div className="flex flex-row items-start justify-start">

// ✅ デフォルト値は省略
<div className="flex">
```

### ダイナミッククラス名の制約
```tsx
// ❌ 文字列結合（Tailwindがスキャンできない）
<div className={`bg-${color}-500`}>

// ✅ 完全なクラス名をマッピング
const colorMap = {
  blue: "bg-blue-500",
  red: "bg-red-500",
} as const
<div className={colorMap[color]}>
```

## cva（class-variance-authority）パターン
```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## アクセシビリティ

### フォーカス管理
```tsx
// キーボードフォーカスのみリング表示
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">

// タッチターゲット最低44px
<button className="min-h-[44px] min-w-[44px]">
```

### スクリーンリーダー
```tsx
// 視覚的に隠してSR向けに残す
<span className="sr-only">メニューを開く</span>
```

## アニメーション
```tsx
// トランジション
<div className="transition-colors duration-200">
<div className="transition-all duration-300 ease-in-out">

// prefers-reduced-motion 対応
<div className="motion-safe:animate-spin">
<div className="motion-reduce:transition-none">
```
