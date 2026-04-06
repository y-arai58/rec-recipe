# Design System: Token Templates & shadcn/ui Customization

## globals.css Token Template
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    --primary: 221 83% 53%;          /* ← ブランド色: CTA, 選択状態 */
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96%;        /* ← 二次アクション */
    --secondary-foreground: 222 47% 11%;

    --muted: 210 40% 96%;            /* ← 非アクティブ, 補助テキスト */
    --muted-foreground: 215 16% 47%;

    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%;        /* ← 危険, エラー, 削除 */
    --destructive-foreground: 210 40% 98%;

    /* カスタム: 状態色 */
    --success: 142 76% 36%;           /* ← 成功, 正常, 有効 */
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;            /* ← 注意, 要確認 */
    --warning-foreground: 0 0% 0%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 221 83% 53%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222 84% 5%;
    --foreground: 210 40% 98%;
    /* ... dark mode overrides ... */
  }
}
```

## Color Role Map (Anti-AI Design)
```
ブランド色 (--primary):     CTAボタン, 選択状態, アクティブタブ
操作色   (--secondary):    二次ボタン, フィルター, トグル
状態色   (--success):      成功バッジ, 有効アイコン, 正常ステータス
状態色   (--warning):      注意バッジ, 期限切れ, 要確認
危険色   (--destructive):  削除ボタン, エラーメッセージ, 無効
中立色   (--muted):        補助テキスト, ボーダー, 非アクティブ
背景色   (--background):   ページ背景
カード色 (--card):         カード, ポップオーバー背景

ルール: 1色=1役割。同じ色を複数の意味に使わない。
```

## shadcn/ui Component Install Checklist
```bash
# Core
npx shadcn@latest add button input textarea select checkbox switch radio-group

# Layout
npx shadcn@latest add card separator

# Navigation
npx shadcn@latest add navigation-menu breadcrumb tabs pagination

# Data Display
npx shadcn@latest add table badge avatar

# Feedback
npx shadcn@latest add alert toast skeleton tooltip

# Overlay
npx shadcn@latest add dialog sheet popover dropdown-menu

# Form
npx shadcn@latest add form label
```

## Custom Component Checklist
shadcn/ui にないもの（プロジェクト固有で作る候補）:
```
- AppHeader       ← ロゴ + ナビ + ユーザーメニュー
- AppSidebar      ← サイドナビゲーション
- PageLayout      ← Header + Sidebar + Main wrapper
- PageHeader      ← タイトル + 説明 + アクションボタン
- EmptyState      ← データ0件時の表示
- StatCard        ← KPI表示カード（数値 + ラベル + トレンド）
- DataTable       ← ソート + フィルタ + ページネーション統合
- LoadingScreen   ← ページレベルローディング
```
