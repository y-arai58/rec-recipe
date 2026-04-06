"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Question } from "@/constants/questions"
import { getAllDishesWithTags } from "@/lib/data"
import { scoreDishes } from "../scoring"
import type { RecommendResult } from "../types"
import { DishCard } from "./DishCard"

type Props = {
  questions: Question[]
}

type Phase = "questioning" | "result"

export function QuestionFlow({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // 質問ごとの選択済みオプションインデックスを保持
  const [selectionsByQuestion, setSelectionsByQuestion] = useState<Map<number, Set<number>>>(
    new Map(),
  )
  const [result, setResult] = useState<RecommendResult | null>(null)
  const [phase, setPhase] = useState<Phase>("questioning")

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const selectedIndices = selectionsByQuestion.get(currentIndex) ?? new Set<number>()

  function toggleOption(index: number) {
    setSelectionsByQuestion((prev) => {
      const next = new Map(prev)
      const current = new Set(next.get(currentIndex) ?? [])
      if (current.has(index)) {
        current.delete(index)
      } else {
        current.add(index)
      }
      next.set(currentIndex, current)
      return next
    })
  }

  function handleNext() {
    if (isLastQuestion) {
      const allTagIds = questions.flatMap((q, qi) =>
        [...(selectionsByQuestion.get(qi) ?? [])].flatMap((i) => q.options[i].tagIds),
      )
      const dishes = getAllDishesWithTags()
      const scored = scoreDishes({ selectedTagIds: allTagIds, dishes })
      setResult({
        dishes: scored.map((d) => ({
          id: d.id,
          name: d.name,
          tags: d.tags,
          score: d.score,
        })),
      })
      setPhase("result")
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleBack() {
    setCurrentIndex((i) => i - 1)
  }

  function handleReset() {
    setCurrentIndex(0)
    setSelectionsByQuestion(new Map())
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

  // ── 質問画面 ──────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* 進捗 + 戻るボタン */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {currentIndex + 1} / {questions.length}
        </p>
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="min-h-[44px] px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            ← 戻る
          </button>
        )}
      </div>

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
