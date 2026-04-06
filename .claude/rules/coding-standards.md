# Coding Standards

## Core Principles
- シンプルさ第一: すべての変更をできるだけシンプルに
- 怠慢なし: 根本原因を見つける。一時的な修正はしない
- 最小限の影響: 変更は必要な部分だけ

## TypeScript
- strict mode。any 禁止。type を interface より優先
- Enum 禁止 → as const + ユニオン型
- Zod → z.infer で型生成

## Architecture (CQRS)
- domain/models/: ピュアなモデル + Repositoryインターフェースのみ
- features/{service}/{feature}/: UI都合の型、Server Actions、クエリ
- features/ 以外から features/ をimportしない

## React / Next.js
- Server Components デフォルト。'use client' は必要時のみ
- 名前付きエクスポート。default は page.tsx のみ
- ファイル名ケバブケース、コンポーネント名PascalCase

## Lint & Format
- Biome を使用（ESLint/Prettier は使わない）
- `npx biome check --fix .` で修正
- `npx biome format --write .` でフォーマット

## Validation & Error
- Zod でバリデーション。エラーは { error, details } 形式
- Server Action: 'use server' + Zod + revalidatePath

## Testing
- ユーティリティ → 単体テスト必須
- コンポーネント → レンダリングテスト
- テストは対象と同ディレクトリに配置
