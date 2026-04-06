# Page Scaffold Templates

## page.tsx (Server Component)
```tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "{ページタイトル}",
  description: "{説明}",
}

export default async function {PageName}Page() {
  // Read: Server Component → Repository or queries.ts → Prisma
  // const data = await getData()

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button>Action</Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Content sections */}
      </div>
    </div>
  )
}
```

## loading.tsx
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
```

## error.tsx
```tsx
"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <h2 className="text-lg font-semibold">エラーが発生しました</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message}
      </p>
      <Button onClick={reset} variant="outline">再試行</Button>
    </div>
  )
}
```

## features/ Structure
```
src/features/{service}/{feature}/
├── components/      # Feature専用コンポーネント
│   ├── {Feature}List.tsx
│   ├── {Feature}Card.tsx
│   └── {Feature}Form.tsx
├── actions.ts       # Server Actions (Write path)
├── queries.ts       # 複合クエリ (Read path, JOINあり)
├── validation.ts    # Zod schemas
└── types.ts         # UI都合の型
```

## Server Action Template
```tsx
"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createSchema } from "./validation"

export async function create{Feature}(formData: FormData) {
  const input = createSchema.parse(Object.fromEntries(formData))
  // Repository call
  revalidatePath("/{page}")
}
```
