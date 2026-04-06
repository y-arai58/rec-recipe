---
name: review
description: コードレビュー・デザインレビュー。セキュリティ、CQRS境界、AIっぽさチェック。引数にTASK番号またはPR番号。
---

# Code & Design Review

See @references/checklist.md for the full review checklist sheet.

$ARGUMENTS が指定された場合はそのタスクまたはPR番号に対してレビューを行う。

ultrathink

> Reference: .claude/skills/anti-ai-design/SKILL.md
> Reference: .claude/rules/coding-standards.md

## 1. 対象特定
引数なし→ git diff main...HEAD。TASK-XXX→タスクファイルのFiles参照。

## 2. 自動チェック
```bash
npx tsc --noEmit
npx biome check .
```

## 3. コードレビュー
🔴 Critical: セキュリティ、型安全性、CQRS境界違反
🟠 High: DSトークン不使用、エラーハンドリング、a11y、テスト
🟡 Medium: 可読性、DRY、domain/汚染
🟢 Nit: フォーマット

## 4. Anti-AI UIデザインレビュー（UI変更時必須）
- [ ] 主役明確 / メリハリ / テンプレ感なし / プロダクト固有の設計
- [ ] 色の役割分離 / 同一色複数意味なし
- [ ] 実データ耐性（長文/0件/異常値/重複）
- [ ] 装飾の削ぎ落とし

## 5. アーキテクチャレビュー
- features/ 境界、domain/ 純粋性、Repository パターン、Server Action Zod

## 6. 出力
```
## Review: {対象}
### Summary | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Nit
### ✨ Good | 🎨 Anti-AI Check | 🏗️ Architecture
### Verdict: 🟢 Approve | 🟡 Comments | 🔴 Changes
```

修正希望時は自動修正 → tasks/lessons.md に記録。
