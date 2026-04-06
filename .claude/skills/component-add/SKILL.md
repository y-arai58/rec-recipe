---
name: component-add
description: 共通UIコンポーネントをsrc/components/に追加。Anti-AIチェック付き。引数にコンポーネント名。
---

# Component Add: $ARGUMENTS

ultrathink

> Reference: .claude/skills/anti-ai-design/SKILL.md
> Reference: .claude/skills/tailwind-best-practices/SKILL.md
> Reference: https://ui.shadcn.com/docs

## Flow
1. shadcn/ui に存在するか → あれば `npx shadcn@latest add` を提案
2. src/components/ に既存か → あれば更新確認
3. 仕様確認: 用途 / バリアント / インタラクション
4. 実装: cva + forwardRef + cn() + displayName
5. テスト: {Name}.test.tsx
6. Anti-AI チェック:
   - [ ] テンプレ的でないか
   - [ ] 長文/0件/異常値で破綻しないか
   - [ ] 不要な装飾を削ったか
7. design-system-docs 更新（Path, Props, Usage, Edge Cases）
8. `git commit -m "feat(design-system): add {Name}"`
