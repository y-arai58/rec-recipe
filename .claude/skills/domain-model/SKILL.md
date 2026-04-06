---
name: domain-model
description: "ドメインモデルとRepositoryインターフェースを定義する。domain/models/にモデル型とRepository型をセットで作成。Use when user says モデル追加, エンティティ作って, Repository作って, ドメイン定義, or after prisma-workflow creates new tables. Do NOT use for UI都合の型定義（それはfeature-scaffoldの責務）."
---

# Domain Model

## Why this skill exists
domain/models/ はプロジェクト全体の型の信頼性の基盤。
ここにUI都合の型が混入すると管理不能になる。

## Step 1: モデル定義
`src/domain/models/{ModelName}.ts` を作成。

```typescript
import { SomeModel as PrismaSomeModel } from "@prisma-generated/client";
export type SomeModel = PrismaSomeModel;

export type SomeModelRepository = {
  findById(id: string): Promise<SomeModel | null>;
  create(data: Omit<SomeModel, "id" | "createdAt" | "updatedAt">): Promise<SomeModel>;
};
```

## Step 2: Repository実装
`src/repositories/{ModelName}Repository.ts` にPrisma実装を記述。

## 禁止事項
- include/selectを使ったJOIN済み型 → features/ に定義すること
- 他モデルに依存するメソッド

パターン集は `references/model-patterns.md` を参照。
