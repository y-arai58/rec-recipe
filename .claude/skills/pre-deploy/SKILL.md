---
name: pre-deploy
description: デプロイ前チェックリスト一括実行。タスク状態、TypeScript、Biome、テスト、環境変数、DB、ビルド、セキュリティ。
---

# Pre-Deploy Checklist

## Checks
1. **Tasks**: in-progress/未完了criticalがないか + チェックボックス完了率
2. **TypeScript**: `npx tsc --noEmit`
3. **Biome**: `npx biome check .`
4. **Tests**: `pnpm test`
5. **Env**: .env.example vs .env.local 差分
6. **DB**: `npx prisma validate && npx prisma migrate status`
7. **Build**: `pnpm build`
8. **Security**: `pnpm audit`, ハードコード秘密情報, console.log残り, TODO/FIXME
9. **Design**: ハードコード色値(grep), design-system-docs最新か

## Report
```
🚀 PRE-DEPLOY: 🟢 READY | 🟡 CAUTION | 🔴 DO NOT DEPLOY
📋Tasks ✅|❌ | 🔍TS ✅|❌ | 🔍Biome ✅|❌ | 🧪Tests ✅|❌
🔑Env ✅|⚠️ | 🗄️DB ✅|❌ | 🏗️Build ✅|❌ | 🔒Security ✅|⚠️
```
❌ → 問題詳細+修正方法。「自動修正しますか？」
