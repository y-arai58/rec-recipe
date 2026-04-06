/**
 * rec-recipe スクレイピングスクリプト
 *
 * 対象: Wikipedia「日本料理の一覧」および「家庭料理」ページ
 * ライセンス: Wikipedia コンテンツは CC BY-SA 4.0
 * 出力: data/dishes.json（既存データへのマージ・重複skip）
 *
 * 実行: npx tsx scripts/scrape/index.ts
 */

import * as fs from "node:fs"
import * as path from "node:path"
import * as cheerio from "cheerio"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Dish = {
  id: string
  name: string
  tagIds: string[]
  sourceUrl?: string
}

type DishesData = {
  dishes: Dish[]
  tags: unknown[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const RATE_LIMIT_MS = 1000
const DATA_PATH = path.resolve(process.cwd(), "data/dishes.json")

const SCRAPE_TARGETS: { url: string; label: string }[] = [
  {
    url: "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E6%96%99%E7%90%86%E3%81%AE%E4%B8%80%E8%A6%A7",
    label: "日本料理の一覧",
  },
  {
    url: "https://ja.wikipedia.org/wiki/%E5%AE%B6%E5%BA%AD%E6%96%99%E7%90%86",
    label: "家庭料理",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "rec-recipe-scraper/1.0 (personal learning project; contact: github.com/y-arai58)",
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

/**
 * Wikipedia ページの HTML から料理名を抽出する。
 * - .mw-parser-output 内の <li> テキストを取得
 * - 括弧付き説明・編集リンク・脚注は除去
 * - 2〜20文字の名前のみ採用
 */
function extractDishNames(html: string): string[] {
  const $ = cheerio.load(html)
  const names: string[] = []

  // TOC・脚注・ナビゲーション等を除外してメインコンテンツのみ対象
  $(".mw-parser-output")
    .find("ul, ol")
    .not(".references")
    .find("li")
    .each((_, el) => {
      const $el = $(el)

      // <sup>（脚注）・.mw-editsection を除去したテキストを取得
      $el.find("sup, .mw-editsection").remove()

      // リンクテキスト優先、なければプレーンテキスト
      const link = $el.find("a").first()
      const name = (link.length ? link.text() : $el.text())
        .trim()
        // 全角・半角括弧とその内容を除去
        .replace(/[（(][^）)]*[）)]/g, "")
        // 読点以降を除去（「煮魚、いわし」→「煮魚」）
        .replace(/[、,，・\s].*/u, "")
        .trim()

      if (name.length >= 2 && name.length <= 20) {
        names.push(name)
      }
    })

  return [...new Set(names)]
}

function loadExistingData(): DishesData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8")
  return JSON.parse(raw) as DishesData
}

function generateId(index: number): string {
  return `dish-${String(index).padStart(3, "0")}`
}

function mergeInto(
  data: DishesData,
  names: string[],
  sourceUrl: string,
): { added: number; skipped: number } {
  const existingNames = new Set(data.dishes.map((d) => d.name))
  let nextIndex = data.dishes.length + 1
  let added = 0
  let skipped = 0

  for (const name of names) {
    if (existingNames.has(name)) {
      skipped++
    } else {
      data.dishes.push({
        id: generateId(nextIndex++),
        name,
        tagIds: [],
        sourceUrl,
      })
      existingNames.add(name)
      added++
    }
  }

  return { added, skipped }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run")
  console.log(`=== rec-recipe スクレイピング開始 ${dryRun ? "[DRY RUN]" : ""} ===\n`)

  const data = loadExistingData()

  for (const target of SCRAPE_TARGETS) {
    console.log(`[${target.label}] 取得中...`)
    console.log(`  URL: ${target.url}`)

    try {
      const html = await fetchPage(target.url)
      const names = extractDishNames(html)
      console.log(`  抽出: ${names.length}件`)

      if (!dryRun) {
        const { added, skipped } = mergeInto(data, names, target.url)
        console.log(`  追加: ${added}件 / 重複skip: ${skipped}件`)
      } else {
        console.log(`  [DRY RUN] 先頭10件: ${names.slice(0, 10).join(", ")}`)
      }
    } catch (err) {
      console.error(`  ❌ エラー: ${err instanceof Error ? err.message : err}`)
    }

    await sleep(RATE_LIMIT_MS)
  }

  if (!dryRun) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8")
    console.log(`\n=== 完了 ===`)
    console.log(`合計: ${data.dishes.length}件`)

    if (data.dishes.length < 200) {
      console.warn(
        `\n⚠️  目標の200件に未達です（${data.dishes.length}件）。` +
          `\n   SCRAPE_TARGETS に別ページを追加するか、手動でデータを補完してください。`,
      )
    } else {
      console.log("✅ 200件以上取得完了")
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
