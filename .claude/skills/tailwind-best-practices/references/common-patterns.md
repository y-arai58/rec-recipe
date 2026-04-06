# Tailwind Common Patterns

## Layout Patterns

### Page Layout (Sidebar + Main)
```tsx
<div className="flex min-h-screen">
  <aside className="w-64 shrink-0 border-r bg-card">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 overflow-auto">
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Content */}
    </div>
  </main>
</div>
```

### Page Header
```tsx
<div className="flex items-center justify-between pb-6">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline">Secondary</Button>
    <Button>Primary Action</Button>
  </div>
</div>
```

### Responsive Card Grid
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id} className="p-4">
      {/* ... */}
    </Card>
  ))}
</div>
```

### Stack (Vertical Spacing)
```tsx
<div className="space-y-4">  {/* gap-4 equivalent for block elements */}
  <Section />
  <Section />
  <Section />
</div>
```

## cva Component Templates

### Button Variant
```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

### Badge Variant
```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        warning: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

### Input with States
```tsx
const inputVariants = cva(
  "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-emerald-500 focus-visible:ring-emerald-500",
      },
    },
    defaultVariants: { state: "default" },
  }
)
```

## Responsive Breakpoints
```
sm:  640px   (mobile landscape / small tablet)
md:  768px   (tablet)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

## Spacing Reference
```
1  = 0.25rem = 4px      6  = 1.5rem  = 24px
2  = 0.5rem  = 8px      8  = 2rem    = 32px
3  = 0.75rem = 12px     10 = 2.5rem  = 40px
4  = 1rem    = 16px     12 = 3rem    = 48px
5  = 1.25rem = 20px     16 = 4rem    = 64px
```
