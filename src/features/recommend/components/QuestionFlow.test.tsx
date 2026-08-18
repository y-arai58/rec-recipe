import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import type { Question } from "@/constants/questions"
import { QuestionFlow } from "./QuestionFlow"

afterEach(cleanup)

/** 単体では提案されてはいけない料理（data/dishes.json で side / soup にしたもの） */
const SIDE_ONLY_DISH_NAMES = [
  "味噌汁",
  "ほうれん草のおひたし",
  "きんぴらごぼう",
  "冷奴",
  "ポテトサラダ",
  "温泉卵",
]

const QUESTIONS: Question[] = [
  {
    id: "volume",
    text: "今日の気分は？",
    options: [
      { label: "ガッツリ食べたい", tagIds: ["tag-volume-hearty"] },
      { label: "さっぱりしたい", tagIds: ["tag-volume-light"] },
    ],
  },
  {
    id: "genre",
    text: "何系が食べたい？",
    options: [
      { label: "和食", tagIds: ["tag-genre-japanese"] },
      { label: "中華", tagIds: ["tag-genre-chinese"] },
    ],
  },
]

/** 結果に並んだメイン料理の名前。付け合わせは h3 にしないので拾わない */
function mainDishNames(): string[] {
  return screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent ?? "")
}

/** 「次へ」「料理を探す」を押して結果画面まで進む */
function advanceToResult() {
  fireEvent.click(screen.getByRole("button", { name: "次へ" }))
  fireEvent.click(screen.getByRole("button", { name: "料理を探す" }))
}

/** 2問目（ジャンル）で指定の選択肢を選んでから結果画面まで進む */
function advanceToResultWithGenre(label: string) {
  fireEvent.click(screen.getByRole("button", { name: "次へ" }))
  fireEvent.click(screen.getByRole("button", { name: label }))
  fireEvent.click(screen.getByRole("button", { name: "料理を探す" }))
}

describe("QuestionFlow", () => {
  it("最初の質問と進捗を表示する", () => {
    render(<QuestionFlow questions={QUESTIONS} />)

    expect(screen.getByText("今日の気分は？")).toBeDefined()
    expect(screen.getByText("1 / 2")).toBeDefined()
  })

  it("最初の質問では戻るボタンを出さない", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    expect(screen.queryByRole("button", { name: "← 戻る" })).toBeNull()
  })

  it("選択肢はトグルでき、状態が aria-pressed に反映される", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    const option = screen.getByRole("button", { name: "ガッツリ食べたい" })

    expect(option.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(option)
    expect(option.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(option)
    expect(option.getAttribute("aria-pressed")).toBe("false")
  })

  it("同じ質問で複数の選択肢を選べる", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    fireEvent.click(screen.getByRole("button", { name: "ガッツリ食べたい" }))
    fireEvent.click(screen.getByRole("button", { name: "さっぱりしたい" }))

    expect(
      screen.getByRole("button", { name: "ガッツリ食べたい" }).getAttribute("aria-pressed"),
    ).toBe("true")
    expect(
      screen.getByRole("button", { name: "さっぱりしたい" }).getAttribute("aria-pressed"),
    ).toBe("true")
  })

  it("戻ると前の質問の選択が保持されている", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    fireEvent.click(screen.getByRole("button", { name: "ガッツリ食べたい" }))
    fireEvent.click(screen.getByRole("button", { name: "次へ" }))

    expect(screen.getByText("何系が食べたい？")).toBeDefined()
    fireEvent.click(screen.getByRole("button", { name: "← 戻る" }))

    expect(
      screen.getByRole("button", { name: "ガッツリ食べたい" }).getAttribute("aria-pressed"),
    ).toBe("true")
  })

  it("最後の質問で結果画面に進む", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResultWithGenre("和食")

    expect(screen.getByRole("heading", { name: "おすすめの料理" })).toBeDefined()
    expect(mainDishNames()).toHaveLength(5)
  })

  it("条件を選ばなかった場合はランダムである旨を表示する", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResult()

    expect(screen.getByText(/ランダムに選びました/)).toBeDefined()
  })

  it("「他の候補を見る」は提示済みと重複しない候補を出す", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResultWithGenre("和食")

    const first = mainDishNames()
    fireEvent.click(screen.getByRole("button", { name: "他の候補を見る" }))
    const second = mainDishNames()

    expect(second).toHaveLength(5)
    for (const name of second) {
      expect(first).not.toContain(name)
    }
  })

  it("「条件を変える」は回答を保持したまま最後の質問に戻る", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResultWithGenre("和食")

    fireEvent.click(screen.getByRole("button", { name: "条件を変える" }))

    expect(screen.getByText("何系が食べたい？")).toBeDefined()
    expect(screen.getByRole("button", { name: "和食" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("「最初から」は回答をすべて捨てて1問目に戻る", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    fireEvent.click(screen.getByRole("button", { name: "ガッツリ食べたい" }))
    advanceToResult()

    fireEvent.click(screen.getByRole("button", { name: "最初から" }))

    expect(screen.getByText("1 / 2")).toBeDefined()
    expect(
      screen.getByRole("button", { name: "ガッツリ食べたい" }).getAttribute("aria-pressed"),
    ).toBe("false")
  })

  it("副菜・汁物はメインとして提案しない", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResultWithGenre("和食")

    // 「ほうれん草のおひたし」「味噌汁」などの副菜・汁物は role で除外している
    for (const name of mainDishNames()) {
      expect(SIDE_ONLY_DISH_NAMES).not.toContain(name)
    }
  })

  it("メインごとに付け合わせを提案する", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    advanceToResultWithGenre("和食")

    const sections = screen.getAllByText("合わせるなら")
    expect(sections).toHaveLength(5)

    // 付け合わせは同じ結果の中で重複させない
    const sideLinks = sections.flatMap((section) => {
      const card = section.closest("div")?.parentElement
      if (card === null || card === undefined) return []
      return within(card as HTMLElement)
        .getAllByRole("listitem")
        .map((item) => item.textContent ?? "")
    })
    expect(sideLinks.length).toBeGreaterThan(0)
    expect(new Set(sideLinks).size).toBe(sideLinks.length)
  })

  it("選択肢グループが質問見出しと紐付いている", () => {
    render(<QuestionFlow questions={QUESTIONS} />)
    expect(screen.getByRole("group", { name: "今日の気分は？" })).toBeDefined()
  })
})
