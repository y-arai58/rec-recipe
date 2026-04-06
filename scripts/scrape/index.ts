/**
 * rec-recipe データ構築スクリプト
 *
 * 動作:
 *   1. 組み込みシードリスト（200件以上の家庭料理）を data/dishes.json にマージ
 *   2. Wikipedia ページからさらに料理名をスクレイピングして追加（任意）
 *
 * ライセンス: Wikipedia コンテンツは CC BY-SA 4.0
 * 出力: data/dishes.json（既存データへのマージ・重複skip）
 *
 * 実行:
 *   npx tsx scripts/scrape/index.ts            # シード + Wikipedia スクレイプ
 *   npx tsx scripts/scrape/index.ts --seed-only # シードのみ（ネットワーク不要）
 *   npx tsx scripts/scrape/index.ts --dry-run   # 書き込みなしで件数確認
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
// Seed data — 家庭料理 200件以上
// ---------------------------------------------------------------------------

const SEED_DISHES: string[] = [
  // ご飯・丼
  "カレーライス",
  "オムライス",
  "ハヤシライス",
  "親子丼",
  "牛丼",
  "天丼",
  "カツ丼",
  "中華丼",
  "うな丼",
  "炊き込みご飯",
  "チャーハン",
  "おにぎり",
  "おじや",
  "雑炊",
  "ピラフ",
  "ドリア",
  "タコライス",
  "ガパオライス",
  "キーマカレー",
  "バターチキンカレー",
  "ビーフカレー",
  "シーフードカレー",
  "ひじきご飯",
  "栗ご飯",
  "さつまいもご飯",
  "豆ご飯",
  "鶏飯",
  // 麺
  "ラーメン",
  "うどん",
  "そば",
  "焼きそば",
  "そうめん",
  "にゅうめん",
  "冷やし中華",
  "パスタ",
  "ペペロンチーノ",
  "ミートソース",
  "カルボナーラ",
  "焼きうどん",
  "担々麺",
  "つけ麺",
  "ざるそば",
  "きつねうどん",
  "肉うどん",
  "カレーうどん",
  "ナポリタン",
  "和風パスタ",
  "明太子パスタ",
  "アマトリチャーナ",
  "ボロネーゼ",
  "ペンネアラビアータ",
  // 汁物・スープ
  "味噌汁",
  "豚汁",
  "けんちん汁",
  "粕汁",
  "クラムチャウダー",
  "ミネストローネ",
  "コーンスープ",
  "オニオンスープ",
  "春雨スープ",
  "中華スープ",
  "トマトスープ",
  "コンソメスープ",
  "ポタージュ",
  "冷製スープ",
  "鶏スープ",
  "かぼちゃスープ",
  // 肉料理（鶏）
  "唐揚げ",
  "鶏の照り焼き",
  "チキン南蛮",
  "チキンソテー",
  "チキンカツ",
  "鶏ハム",
  "鶏の塩麹焼き",
  "鶏の梅しそ焼き",
  "鶏のみそ焼き",
  "鶏のから揚げおろしポン酢",
  "バターチキン",
  "タンドリーチキン",
  // 肉料理（豚）
  "豚の生姜焼き",
  "豚カツ",
  "トンカツ",
  "ロールキャベツ",
  "豚バラ大根",
  "角煮",
  "豚の味噌漬け焼き",
  "豚肉と野菜の炒め物",
  "豚キムチ",
  "豚肉のみそ炒め",
  "ホイコーロー",
  "回鍋肉",
  "豚しゃぶ",
  // 肉料理（牛）
  "ビーフシチュー",
  "すき焼き",
  "牛肉の炒め物",
  "ビーフストロガノフ",
  "牛丼の具",
  "ステーキ",
  "ローストビーフ",
  // 合いびき・加工肉
  "ハンバーグ",
  "煮込みハンバーグ",
  "メンチカツ",
  "コロッケ",
  "餃子",
  "シュウマイ",
  "春巻き",
  "肉団子",
  "ミートボール",
  "キャベツメンチ",
  "豆腐ハンバーグ",
  "蒸し餃子",
  // 魚介料理
  "さばの味噌煮",
  "ぶりの照り焼き",
  "鮭の塩焼き",
  "さんまの塩焼き",
  "あじの南蛮漬け",
  "いわしの梅煮",
  "鯛の塩焼き",
  "ムニエル",
  "白身魚のフライ",
  "エビフライ",
  "アジフライ",
  "イカフライ",
  "エビチリ",
  "エビマヨ",
  "煮魚",
  "アクアパッツァ",
  "カキフライ",
  "ホタテのバター醤油焼き",
  "シーフードグラタン",
  "タラのムニエル",
  "鮭のホイル焼き",
  "ちらし寿司",
  // 卵料理
  "だし巻き卵",
  "目玉焼き",
  "炒り卵",
  "茶碗蒸し",
  "煮卵",
  "温泉卵",
  "スクランブルエッグ",
  "オムレツ",
  "ニラ玉",
  "卵とじ",
  "月見うどん",
  // 豆腐・大豆
  "麻婆豆腐",
  "揚げ出し豆腐",
  "湯豆腐",
  "冷奴",
  "肉豆腐",
  "厚揚げの煮物",
  "油揚げのみそ汁",
  "豆腐ステーキ",
  // 野菜料理・副菜
  "肉じゃが",
  "筑前煮",
  "ひじきの煮物",
  "きんぴらごぼう",
  "ほうれん草のおひたし",
  "かぼちゃの煮物",
  "大根の煮物",
  "切り干し大根",
  "里芋の煮物",
  "なすの味噌炒め",
  "野菜炒め",
  "ラタトゥイユ",
  "ポテトサラダ",
  "コールスロー",
  "かぼちゃサラダ",
  "ごぼうサラダ",
  "ひじきサラダ",
  "れんこんのきんぴら",
  "こんにゃくの煮物",
  "小松菜の炒め物",
  "モヤシ炒め",
  "ピーマンの肉詰め",
  "なすの揚げ浸し",
  "かぼちゃの天ぷら",
  "ブロッコリーのおひたし",
  "アスパラのバター炒め",
  "ほうれん草のソテー",
  "青椒肉絲",
  // 鍋料理
  "おでん",
  "しゃぶしゃぶ",
  "水炊き",
  "キムチ鍋",
  "豆乳鍋",
  "トマト鍋",
  "もつ鍋",
  "ちゃんこ鍋",
  "石狩鍋",
  "カレー鍋",
  // グラタン・オーブン料理
  "グラタン",
  "マカロニグラタン",
  "シーフードグラタン",
  "ラザニア",
  "焼きカレー",
  "ピザ",
  "フォカッチャ",
  "ローストチキン",
  // その他・家庭料理
  "お好み焼き",
  "たこ焼き",
  "もんじゃ焼き",
  "焼き餃子",
  "麻婆ナス",
  "バンバンジー",
  "棒棒鶏",
  "チンジャオロース",
  "酢豚",
  "八宝菜",
  "かに玉",
  "天ぷら",
  "かき揚げ",
  "フライドポテト",
  "肉野菜炒め",
  "ガーリックシュリンプ",
  "アヒージョ",
  "ガパオ",
  "チキンライス",
  "ドライカレー",
  "炒飯",
  "クリームシチュー",
  "ポトフ",
  "ポークソテー",
  "レモンチキン",
  "ピカタ",
  "ミラノ風カツレツ",
]

// ---------------------------------------------------------------------------
// Wikipedia スクレイピングターゲット
// ---------------------------------------------------------------------------

const SCRAPE_TARGETS: { url: string; label: string }[] = [
  {
    url: "https://ja.wikipedia.org/wiki/%E5%AE%B6%E5%BA%AD%E6%96%99%E7%90%86",
    label: "家庭料理",
  },
  {
    url: "https://ja.wikipedia.org/wiki/%E6%B4%8B%E9%A3%9F",
    label: "洋食",
  },
  {
    url: "https://ja.wikipedia.org/wiki/%E4%B8%BC%E7%89%A9",
    label: "丼物",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DATA_PATH = path.resolve(process.cwd(), "data/dishes.json")
const RATE_LIMIT_MS = 1000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "rec-recipe-scraper/1.0 (personal learning project; github.com/y-arai58)",
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

/** 日本語文字（ひらがな・カタカナ・漢字）の比率が50%以上かチェック */
function isJapaneseName(name: string): boolean {
  const japanese = name.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/gu)
  return (japanese?.length ?? 0) / name.length >= 0.5
}

function extractDishNames(html: string): string[] {
  const $ = cheerio.load(html)
  const names: string[] = []

  $(".mw-parser-output")
    .find("ul, ol")
    .not(".references")
    .find("li")
    .each((_, el) => {
      const $el = $(el)
      $el.find("sup, .mw-editsection").remove()

      const link = $el.find("a").first()
      const name = (link.length ? link.text() : $el.text())
        .trim()
        .replace(/[（(][^）)]*[）)]/g, "")
        .replace(/[、,，・\s].*/u, "")
        .trim()

      if (name.length >= 2 && name.length <= 20 && isJapaneseName(name)) {
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
  sourceUrl?: string,
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
        ...(sourceUrl ? { sourceUrl } : {}),
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
  const seedOnly = process.argv.includes("--seed-only")
  const mode = dryRun ? "[DRY RUN]" : seedOnly ? "[SEED ONLY]" : ""

  console.log(`=== rec-recipe データ構築開始 ${mode} ===\n`)

  const data = loadExistingData()

  // Step 1: シードデータをマージ
  console.log(`[シードデータ] ${SEED_DISHES.length}件を処理中...`)
  if (!dryRun) {
    const { added, skipped } = mergeInto(data, SEED_DISHES)
    console.log(`  追加: ${added}件 / 重複skip: ${skipped}件`)
  } else {
    console.log(`  [DRY RUN] 先頭10件: ${SEED_DISHES.slice(0, 10).join(", ")}`)
  }

  // Step 2: Wikipedia スクレイピング（--seed-only でスキップ）
  if (!seedOnly) {
    console.log("\n[Wikipedia スクレイピング]")
    for (const target of SCRAPE_TARGETS) {
      console.log(`  ${target.label} を取得中...`)
      try {
        const html = await fetchPage(target.url)
        const names = extractDishNames(html)
        console.log(`  抽出: ${names.length}件`)

        if (!dryRun) {
          const { added, skipped } = mergeInto(data, names, target.url)
          console.log(`  追加: ${added}件 / 重複skip: ${skipped}件`)
        } else {
          console.log(`  [DRY RUN] 先頭5件: ${names.slice(0, 5).join(", ")}`)
        }
      } catch (err) {
        console.warn(`  ⚠️  ${target.label}: ${err instanceof Error ? err.message : err}`)
      }
      await sleep(RATE_LIMIT_MS)
    }
  }

  // Step 3: 書き込み
  if (!dryRun) {
    fs.writeFileSync(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8")
    console.log(`\n=== 完了 ===`)
    console.log(`合計: ${data.dishes.length}件`)

    if (data.dishes.length >= 200) {
      console.log("✅ 200件以上取得完了")
    } else {
      console.warn(
        `⚠️  200件未満（${data.dishes.length}件）。SEED_DISHES に追加するか Wikipedia ターゲットを増やしてください。`,
      )
    }
  } else {
    const total = data.dishes.length + SEED_DISHES.length
    console.log(`\n[DRY RUN] 推定合計: ${total}件以上`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
