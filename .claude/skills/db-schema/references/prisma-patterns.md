# Prisma Schema Patterns

## Multi-Schema Structure
```
prisma/
├── schema.prisma              # 共通モデル (User, Account, Session...)
└── schemas/
    ├── {serviceA}.prisma      # サービスA固有モデル
    └── {serviceB}.prisma      # サービスB固有モデル
```

固有モデルはプレフィックス付き命名:
```prisma
// prisma/schemas/billing.prisma
model BillingInvoice {
  id        String   @id @default(cuid())
  // ...
}

model BillingSubscription {
  id        String   @id @default(cuid())
  // ...
}
```

## Common Model Patterns

### User + Auth
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Soft Delete
```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  deletedAt DateTime?  // null = active, non-null = deleted

  @@index([deletedAt])
}
```

### Enum (as string)
```prisma
enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## Zod Validation Template
```tsx
// src/features/{service}/{feature}/validation.ts
import { z } from "zod"

export const createSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  description: z.string().optional(),
})

export const updateSchema = createSchema.partial()

export type CreateInput = z.infer<typeof createSchema>
export type UpdateInput = z.infer<typeof updateSchema>
```

## Repository Pattern
```tsx
// src/repositories/{model}Repository.ts
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export const {model}Repository = {
  findById: (id: string) =>
    prisma.{model}.findUnique({ where: { id } }),

  findMany: (params?: { take?: number; skip?: number }) =>
    prisma.{model}.findMany({
      take: params?.take ?? 20,
      skip: params?.skip ?? 0,
      orderBy: { createdAt: "desc" },
    }),

  create: (data: Prisma.{Model}CreateInput) =>
    prisma.{model}.create({ data }),

  update: (id: string, data: Prisma.{Model}UpdateInput) =>
    prisma.{model}.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.{model}.update({
      where: { id },
      data: { deletedAt: new Date() },  // soft delete
    }),
}
```

## Migration Safety Checklist
```
□ prisma validate が通るか
□ 既存データに破壊的影響がないか
□ デフォルト値は設定されているか（NOT NULL追加時）
□ インデックスは適切か（検索/ソート対象カラム）
□ カスケード削除の影響範囲を確認したか
□ 本番では prisma migrate deploy を使うか（dev ではない）
```
