---
name: design-system
description: shadcn/uiベースのデザインシステム構築・拡張。Anti-AIデザイン原則を徹底適用。
---

# Design System Builder

See @references/token-templates.md for CSS variable templates and color role map.

ultrathink

> Reference: .claude/skills/anti-ai-design/SKILL.md
> Reference: .claude/skills/tailwind-best-practices/SKILL.md
> Reference: https://ui.shadcn.com/docs

## 1. 現状確認
src/components/ の構成、shadcn/ui セットアップ状況、requirements.md のデザイン要件

## 2. ヒアリング（トークン未定義時）
AskUserQuestion で: プライマリカラー / ダークモード / フォント / 角丸 / 密度

## 3. shadcn/ui セットアップ
```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea select checkbox card dialog table tabs form alert toast dropdown-menu navigation-menu badge avatar separator skeleton tooltip popover sheet breadcrumb pagination switch radio
```

## 4. トークン定義（globals.css + tailwind.config.ts）
- colors: ブランド色・操作色・状態色・注意色を明確に分離
- typography: フォント、サイズスケール
- spacing: 4px ベース
- radius / shadows / breakpoints

色設計ルール（Anti-AI）:
- 同じ色に複数の意味を持たせない
- 「綺麗か」ではなく「迷わないか」で判断

## 5. カスタムコンポーネント
shadcn/ui にないもののみ自作。requirements.md から洗い出し。
各コンポーネント: cva + forwardRef + cn() + テスト + design-system-docs 更新

Anti-AI チェック（各コンポーネントで）:
- テンプレ的な見た目になっていないか
- 長文/0件/異常値で破綻しないか
- 不要な装飾を削ったか

## 6. Figma同期（ユーザー希望時）
generate_figma_design → デザイナーに共有
