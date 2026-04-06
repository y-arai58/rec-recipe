# ドメインモデル パターン集

## 基本: Prisma型のre-export + Repository
```typescript
// src/domain/models/User.ts
import { User as PrismaUser } from "@prisma-generated/client";
export type User = PrismaUser;

export type UserRepository = {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User>;
  delete(id: string): Promise<void>;
};
```

## Repository実装
```typescript
// src/repositories/UserRepository.ts
import { prisma } from "@/lib/prisma";
import type { User, UserRepository } from "@/domain/models/User";

export const userRepository: UserRepository = {
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
  },
};
```
selectで必要なフィールドだけ取得する。機密フィールドの露出防止。
