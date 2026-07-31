import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { MealPlanner } from "./MealPlanner"

afterEach(cleanup)

const build = () => fireEvent.click(screen.getByRole("button", { name: /献立/ }))

describe("MealPlanner", () => {
  it("日数と人数の選択肢を出す", () => {
    render(<MealPlanner />)

    expect(screen.getByRole("group", { name: "何日分？" })).toBeDefined()
    expect(screen.getByRole("group", { name: "何人分？" })).toBeDefined()
    expect(screen.getByRole("button", { name: "3日" })).toBeDefined()
    expect(screen.getByRole("button", { name: "7日" })).toBeDefined()
  })

  it("初期状態では献立を出さない", () => {
    render(<MealPlanner />)
    expect(screen.queryByRole("heading", { name: "買い物リスト" })).toBeNull()
  })

  it("作成すると献立・買い物リスト・合計金額が出る", () => {
    render(<MealPlanner />)
    build()

    expect(screen.getByRole("heading", { name: "5日分の献立" })).toBeDefined()
    expect(screen.getByRole("heading", { name: "買い物リスト" })).toBeDefined()
    expect(screen.getAllByText(/^¥[\d,]+$/).length).toBeGreaterThan(0)
  })

  it("選んだ日数ぶんの献立を出す", () => {
    render(<MealPlanner />)
    fireEvent.click(screen.getByRole("button", { name: "3日" }))
    build()

    expect(screen.getByRole("heading", { name: "3日分の献立" })).toBeDefined()
    expect(screen.getAllByText(/^\d日目$/)).toHaveLength(3)
  })

  it("選択状態が aria-pressed に反映される", () => {
    render(<MealPlanner />)
    const three = screen.getByRole("button", { name: "3日" })

    expect(three.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(three)
    expect(three.getAttribute("aria-pressed")).toBe("true")
    expect(screen.getByRole("button", { name: "5日" }).getAttribute("aria-pressed")).toBe("false")
  })

  it("常備品は買い物リストと別枠で案内する", () => {
    render(<MealPlanner />)
    build()

    expect(screen.getByRole("heading", { name: "家にある前提のもの" })).toBeDefined()
  })

  it("作成後はボタンの文言が作り直しに変わる", () => {
    render(<MealPlanner />)
    build()

    expect(screen.getByRole("button", { name: "別の献立を作る" })).toBeDefined()
  })
})
