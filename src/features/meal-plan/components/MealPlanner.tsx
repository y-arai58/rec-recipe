"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { getIngredientById } from "@/lib/ingredient-data"
import { buildMealPlan, MAX_DAYS, MIN_DAYS } from "../planning"
import { getPlannableDishes } from "../queries"
import { formatAmount } from "../shopping"
import type { MealPlan } from "../types"

const DAY_CHOICES = Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i)
const SERVING_CHOICES = [2, 3, 4]

export function MealPlanner() {
  const [days, setDays] = useState(5)
  const [servings, setServings] = useState(2)
  const [plan, setPlan] = useState<MealPlan | null>(null)

  const candidates = useMemo(() => getPlannableDishes(), [])

  function handleBuild() {
    setPlan(buildMealPlan({ days, servings, candidates, getIngredient: getIngredientById }))
  }

  return (
    <div className="space-y-8">
      <fieldset className="min-w-0 space-y-3">
        <legend className="text-sm font-semibold text-foreground">何日分？</legend>
        <div className="flex flex-wrap gap-2">
          {DAY_CHOICES.map((choice) => (
            <Button
              key={choice}
              variant={days === choice ? "default" : "outline"}
              className="min-h-[44px] min-w-[56px]"
              aria-pressed={days === choice}
              onClick={() => setDays(choice)}
            >
              {choice}日
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0 space-y-3">
        <legend className="text-sm font-semibold text-foreground">何人分？</legend>
        <div className="flex flex-wrap gap-2">
          {SERVING_CHOICES.map((choice) => (
            <Button
              key={choice}
              variant={servings === choice ? "default" : "outline"}
              className="min-h-[44px] min-w-[56px]"
              aria-pressed={servings === choice}
              onClick={() => setServings(choice)}
            >
              {choice}人
            </Button>
          ))}
        </div>
      </fieldset>

      <Button size="lg" className="w-full" onClick={handleBuild}>
        {plan ? "別の献立を作る" : "献立と買い物リストを作る"}
      </Button>

      {plan && <PlanResult plan={plan} />}
    </div>
  )
}

function PlanResult({ plan }: { plan: MealPlan }) {
  return (
    <div className="space-y-10 border-t border-border pt-8" aria-live="polite">
      {/* ── 献立 ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">{plan.days.length}日分の献立</h2>
        <p className="text-sm text-muted-foreground">
          日持ちの短い食材を使う料理から順に並べています。
        </p>

        <ol className="space-y-2">
          {plan.days.map((day) => (
            <li key={day.dish.id}>
              <Link
                href={`/dishes/${day.dish.id}`}
                className="group flex gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40 hover:bg-accent/30"
              >
                <span className="shrink-0 pt-0.5 text-xs font-semibold text-muted-foreground">
                  {day.day}日目
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground group-hover:text-primary">
                    {day.dish.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {day.ingredients.map((entry) => entry.ingredient.name).join("・")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 注意 ─────────────────────────────────────────── */}
      {plan.alerts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">買ったあとの注意</h2>
          <ul className="space-y-2">
            {plan.alerts.map((alert) => (
              <li
                key={`${alert.kind}-${alert.ingredient.id}`}
                className="flex gap-3 rounded-lg bg-muted px-4 py-3 text-sm text-foreground"
              >
                <span className="shrink-0 text-xs font-semibold text-secondary">
                  {alert.kind === "spoilage" ? "日持ち" : "余り"}
                </span>
                <span>{alert.message}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 買い物リスト ──────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">買い物リスト</h2>
          <p className="shrink-0 text-sm text-muted-foreground">
            目安{" "}
            <span className="font-semibold text-foreground">
              ¥{plan.totalPrice.toLocaleString()}
            </span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          袋やパック単位でしか買えないため、必要量より多く買う品があります。
        </p>

        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {plan.shoppingList.map((item) => (
            <li key={item.ingredient.id} className="flex items-baseline gap-3 px-5 py-3">
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground">{item.ingredient.name}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.packs.map((entry) => `${entry.pack.label}×${entry.count}`).join(" + ")}
                  {item.leftoverAmount > 0 &&
                    `　/　${formatAmount(item.leftoverAmount)}${item.ingredient.unit}余る`}
                </span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-foreground">
                ¥{item.totalPrice.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 常備品 ───────────────────────────────────────── */}
      {plan.pantryIngredients.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">家にある前提のもの</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {plan.pantryIngredients.map((ingredient) => ingredient.name).join("・")}
          </p>
        </section>
      )}
    </div>
  )
}
