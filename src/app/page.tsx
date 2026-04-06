import { QUESTIONS } from "@/constants/questions"
import { QuestionFlow } from "@/features/recommend/components/QuestionFlow"

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      {/* ヘッダー */}
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          rec-recipe
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">今日何食べる？</h1>
      </header>

      {/* 質問フロー */}
      <QuestionFlow questions={QUESTIONS} />
    </main>
  )
}
