---
name: db-schema
description: Prismaスキーマ変更→マイグレーション→Zodスキーマ更新→型再生成。マルチスキーマ対応。
---

# DB Schema

See @references/prisma-patterns.md for multi-schema patterns, Zod templates, and Repository pattern.

$ARGUMENTS にスキーマ変更の説明を指定する。

ultrathink

> Reference: prisma/CLAUDE.md

## Architecture
- prisma/schema.prisma = 共通モデル
- prisma/schemas/{service}.prisma = サービス固有モデル（プレフィックス付き命名）

## Flow
1. prisma/schema.prisma + prisma/CLAUDE.md 確認
2. 変更内容特定（$ARGUMENTS or ヒアリング）
3. 変更計画提示（diff + 既存データ影響 + 破壊的変更の有無）→ 確認
4. 実行:
```bash
npx prisma validate
npx prisma migrate dev --name {summary}
npx prisma generate
```
5. Zod スキーマ更新: src/features/{service}/{feature}/validation.ts
6. docs/architecture.md のデータモデル更新
