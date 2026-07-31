"use client"

import { useMemo, useState } from "react"
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
  // 一度でも提示した料理ID。「他の候補を見る」で除外する
  const [seenIds, setSeenIds] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>("questioning")

  // 料理データはバンドル同梱の静的JSON。マウント中に変わらないので一度だけ組み立てる
  const dishes = useMemo(() => getAllDishesWithTags(), [])

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const selectedIndices = selectionsByQuestion.get(currentIndex) ?? new Set<number>()

  function collectSelectedTagIds(): string[] {
    return questions.flatMap((question, questionIndex) =>
      [...(selectionsByQuestion.get(questionIndex) ?? [])].flatMap(
        (optionIndex) => question.options[optionIndex].tagIds,
      ),
    )
  }

  function recommend(excludeIds: string[]) {
    const selectedTagIds = collectSelectedTagIds()
    const scored = scoreDishes({ selectedTagIds, dishes, excludeIds })

    setResult({
      dishes: scored.map((dish) => ({
        id: dish.id,
        name: dish.name,
        tags: dish.tags,
        score: dish.score,
        matchedTagIds: dish.matchedTagIds,
      })),
      isRandom: selectedTagIds.length === 0,
    })
    setSeenIds([...excludeIds, ...scored.map((dish) => dish.id)])
    setPhase("result")
  }

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
      recommend([])
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleBack() {
    setCurrentIndex((i) => i - 1)
  }

  /** 同じ条件のまま、まだ見ていない料理を提案する */
  function handleShowMore() {
    recommend(seenIds)
  }

  /** 回答を保持したまま質問画面へ戻る */
  function handleEditConditions() {
    setCurrentIndex(questions.length - 1)
    setPhase("questioning")
  }

  function handleReset() {
    setCurrentIndex(0)
    setSelectionsByQuestion(new Map())
    setResult(null)
    setSeenIds([])
    setPhase("questioning")
  }

  // ── 結果画面 ──────────────────────────────────────────────
  if (phase === "result" && result) {
    const hasMore = seenIds.length < dishes.length

    return (
      <div className="space-y-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">おすすめの料理</h2>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] shrink-0 px-2 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            最初から
          </button>
        </div>

        {result.isRandom && (
          <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
            条件を選ばなかったので、ランダムに選びました。
          </p>
        )}

        {result.dishes.length === 0 ? (
          <div className="space-y-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {seenIds.length > 0
                ? "候補を出しきりました。"
                : "条件に合う料理が見つかりませんでした。"}
            </p>
            <Button variant="outline" size="lg" onClick={handleReset}>
              最初からやり直す
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {result.dishes.map((dish) => (
                <li key={dish.id}>
                  <DishCard dish={dish} />
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 pt-1">
              {hasMore && (
                <Button variant="outline" size="lg" className="w-full" onClick={handleShowMore}>
                  他の候補を見る
                </Button>
              )}
              <button
                type="button"
                onClick={handleEditConditions}
                className="min-h-[44px] text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                条件を変える
              </button>
            </div>
          </>
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

      {/* 選択肢（複数選択可・未選択のまま進める） */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, i) => (
          <Button
            key={option.label}
            variant={selectedIndices.has(i) ? "default" : "outline"}
            size="lg"
            className="w-full justify-start text-left text-base"
            aria-pressed={selectedIndices.has(i)}
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
