---
name: page-create
description: features/構成に沿った高速ページスキャフォールド。Anti-AIデザイン原則適用。引数にページ名。
---

# Page Create

See @references/scaffold-templates.md for page, loading, error, and features/ templates.

$ARGUMENTS にページ名を指定する。例: `/page-create dashboard`

ultrathink

> Reference: .claude/skills/anti-ai-design/SKILL.md
> Reference: .claude/skills/tailwind-best-practices/SKILL.md
> Reference: .claude/skills/design-system-docs/SKILL.md

## Architecture
ページは src/app/ に配置。ロジックは src/features/{service}/{feature}/ に分離。
- page.tsx = Server Component (データ取得 + レイアウト)
- features/{service}/{feature}/components/ = Feature専用UI
- features/{service}/{feature}/actions.ts = Server Actions
- features/{service}/{feature}/queries.ts = 複合クエリ

## Flow
1. architecture.md のページ構成 + requirements.md の該当要件確認
2. design-system-docs で利用可能コンポーネント確認
3. 構成提案 → ユーザー確認
4. ファイル生成: page.tsx, loading.tsx, error.tsx, features/{service}/{feature}/

## Anti-AI セルフチェック（生成後に必ず実行）
- [ ] 主役が明確か？テンプレ感はないか？
- [ ] 色の役割が整理されているか？
- [ ] 長文/0件/異常値で破綻しないか？
- [ ] 不要な装飾を削ったか？
