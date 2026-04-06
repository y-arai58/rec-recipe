"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import type { Question } from "@/constants/questions"
import { getRecommendations } from "../actions"
import type { RecommendResult } from "../types"
import { DishCard } from "./DishCard"

type Props = {
  questions: Question[]
}

type Phase = "questioning" | "loading" | "result"

export function QuestionFlow({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [collectedTagIds, setCollectedTagIds] = useState<string[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [result, setResult] = useState<RecommendResult | null>(null)
  const [phase, setPhase] = useState<Phase>("questioning")
  const [isPending, startTransition] = useTransition()

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  function toggleOption(index: number) {
    setSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function handleNext() {
    const tagIds = [...selectedIndices].flatMap((i) => currentQuestion.options[i].tagIds)
    const next = [...collectedTagIds, ...tagIds]

    if (isLastQuestion) {
      setCollectedTagIds(next)
      setPhase("loading")
      startTransition(async () => {
        const res = await getRecommendations(next)
        setResult(res)
        setPhase("result")
      })
    } else {
      setCollectedTagIds(next)
      setCurrentIndex((i) => i + 1)
      setSelectedIndices(new Set())
    }
  }

  function handleReset() {
    setCurrentIndex(0)
    setCollectedTagIds([])
    setSelectedIndices(new Set())
    setResult(null)
    setPhase("questioning")
  }

  // ── 結果画面 ──────────────────────────────────────────────
  if (phase === "result" && result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">おすすめの料理</h2>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-3 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            もう一度
          </button>
        </div>

        {result.dishes.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            条件に合う料理が見つかりませんでした。
          </p>
        ) : (
          <ul className="space-y-3">
            {result.dishes.map((dish) => (
              <li key={dish.id}>
                <DishCard dish={dish} />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // ── ローディング ──────────────────────────────────────────
  if (phase === "loading" || isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">料理を探しています…</p>
      </div>
    )
  }

  // ── 質問画面 ──────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* 進捗 */}
      <p className="text-xs font-medium text-muted-foreground">
        {currentIndex + 1} / {questions.length}
      </p>

      {/* 質問文 */}
      <h2 className="text-xl font-bold leading-snug text-foreground">{currentQuestion.text}</h2>

      {/* 選択肢 */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, i) => (
          <Button
            key={option.label}
            variant={selectedIndices.has(i) ? "default" : "outline"}
            size="lg"
            className="w-full justify-start text-left text-base"
            onClick={() => toggleOption(i)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 次へ */}
      <Button size="lg" className="w-full" onClick={handleNext}>
        {isLastQuestion ? "料理を探す" : "次へ"}
      </Button>
    </div>
  )
}
