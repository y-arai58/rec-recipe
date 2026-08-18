import type { Metadata } from "next"
import Link from "next/link"
import { MealPlanner } from "@/features/meal-plan/components/MealPlanner"

export const metadata: Metadata = {
  title: "まとめ買い献立 — rec-recipe",
  description: "買い物1回で3〜7日分の献立と買い物リストを作ります。",
}

export default function PlanPage() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      <header className="mb-10">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← 今日の一品を探す
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-foreground">まとめ買い献立</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          買い物1回で回せる献立を組み立てます。袋やパック単位でしか買えないこと、
          まとめ買いした食材が傷むことを考えて、使い回しやすい料理を選びます。
        </p>
      </header>

      <MealPlanner />
    </main>
  )
}
