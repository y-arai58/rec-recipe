/**
 * 料理タグ自動付与スクリプト
 *
 * data/dishes.json の全料理にタグを付与して data/dishes.json を上書きする。
 * タグマスターは data/tags.json から読み込む。
 *
 * 実行: npx tsx scripts/tag-assign.ts
 *       npx tsx scripts/tag-assign.ts --dry-run  # 書き込みなし確認
 */

import * as fs from "node:fs"
import * as path from "node:path"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Dish = {
  id: string
  name: string
  tagIds: string[]
  sourceUrl?: string
}

type Tag = {
  id: string
  name: string
  category: string
}

type DishesData = { dishes: Dish[]; tags: Tag[] }
type TagsData = { tags: Tag[] }

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const DISHES_PATH = path.resolve(process.cwd(), "data/dishes.json")
const TAGS_PATH = path.resolve(process.cwd(), "data/tags.json")

// ---------------------------------------------------------------------------
// Tag rules
// 各キーワードが料理名に含まれる場合にタグを付与する。
// 複数ルールが一致した場合、すべて付与する（genre は複数OK）。
// カテゴリ内でマッチなしの場合はデフォルトタグを使用。
// ---------------------------------------------------------------------------

type Rule = { tagId: string; keywords: string[] }

const GENRE_RULES: Rule[] = [
  {
    tagId: "tag-genre-curry",
    keywords: ["カレー"],
  },
  {
    tagId: "tag-genre-nabe",
    keywords: [
      "鍋",
      "おでん",
      "すき焼き",
      "しゃぶしゃぶ",
      "水炊き",
      "ちゃんこ",
      "もつ鍋",
      "石狩",
      "豆乳鍋",
      "トマト鍋",
    ],
  },
  {
    tagId: "tag-genre-italian",
    keywords: [
      "パスタ",
      "ペペロンチーノ",
      "ミートソース",
      "カルボナーラ",
      "ボロネーゼ",
      "アマトリチャーナ",
      "ペンネ",
      "ピザ",
      "ナポリタン",
      "ドリア",
      "フォカッチャ",
      "ラザニア",
    ],
  },
  {
    tagId: "tag-genre-chinese",
    keywords: [
      "チャーハン",
      "炒飯",
      "餃子",
      "シュウマイ",
      "麻婆",
      "春巻き",
      "青椒",
      "チンジャオ",
      "八宝菜",
      "かに玉",
      "酢豚",
      "担々麺",
      "ホイコーロー",
      "回鍋肉",
      "バンバンジー",
      "棒棒鶏",
      "肉団子",
      "中華",
      "ミートボール",
    ],
  },
  {
    tagId: "tag-genre-korean",
    keywords: ["キムチ", "ナムル", "チヂミ", "プルコギ", "トッポッキ", "チゲ"],
  },
  {
    tagId: "tag-genre-ethnic",
    keywords: [
      "ガパオ",
      "タコライス",
      "タンドリー",
      "アクアパッツァ",
      "アヒージョ",
      "ガーリックシュリンプ",
      "グリーンカレー",
    ],
  },
  {
    tagId: "tag-genre-french",
    keywords: [
      "ラタトゥイユ",
      "ミネストローネ",
      "クラムチャウダー",
      "ポトフ",
      "ムニエル",
      "コンソメ",
      "オニオンスープ",
    ],
  },
  {
    tagId: "tag-genre-western",
    keywords: [
      "ハンバーグ",
      "シチュー",
      "グラタン",
      "ソテー",
      "ピカタ",
      "ロースト",
      "ステーキ",
      "コロッケ",
      "スクランブルエッグ",
      "オムレツ",
      "コールスロー",
      "オムライス",
      "ハヤシライス",
      "フライドポテト",
      "チキンカツ",
      "レモンチキン",
      "ポタージュ",
      "チキンソテー",
      "ポークソテー",
      "ビーフストロガノフ",
      "ミラノ風",
    ],
  },
  {
    tagId: "tag-genre-fried",
    keywords: [
      "揚げ",
      "カツ",
      "コロッケ",
      "メンチ",
      "フライ",
      "天ぷら",
      "かき揚げ",
      "フライドポテト",
    ],
  },
  {
    tagId: "tag-genre-stirfry",
    keywords: ["炒め", "ソテー", "野菜炒め", "チャーハン", "炒飯"],
  },
  {
    tagId: "tag-genre-simmered",
    keywords: ["煮", "肉じゃが", "筑前煮", "肉豆腐", "おでん", "シチュー", "ポトフ", "角煮"],
  },
  {
    tagId: "tag-genre-japanese",
    keywords: [
      "だし",
      "味噌",
      "みそ",
      "醤油",
      "おひたし",
      "きんぴら",
      "揚げ浸し",
      "炊き込み",
      "おにぎり",
      "から揚げ",
      "唐揚げ",
      "そば",
      "うどん",
      "にゅうめん",
      "ひじき",
      "切り干し",
      "里芋",
      "こんにゃく",
      "さんま",
      "あじ",
      "いわし",
      "さば",
      "ぶり",
      "鯛",
      "鮭",
      "ちらし",
      "だし巻き",
      "茶碗蒸し",
      "雑炊",
      "おじや",
      "湯豆腐",
      "冷奴",
      "揚げ出し",
      "豚汁",
      "けんちん",
      "粕汁",
      "水炊き",
      "生姜焼き",
      "照り焼き",
      "梅",
      "南蛮漬け",
      "ホイル焼き",
      "塩焼き",
    ],
  },
]

const VOLUME_RULES: Rule[] = [
  {
    tagId: "tag-volume-hearty",
    keywords: [
      "カレーライス",
      "ハンバーグ",
      "ビーフシチュー",
      "クリームシチュー",
      "カツ",
      "ラーメン",
      "担々麺",
      "すき焼き",
      "しゃぶしゃぶ",
      "ちゃんこ",
      "もつ鍋",
      "グラタン",
      "ラザニア",
      "ドリア",
      "丼",
      "チャーハン",
      "炒飯",
      "ローストチキン",
      "ステーキ",
      "餃子",
      "焼きそば",
    ],
  },
  {
    tagId: "tag-volume-light",
    keywords: [
      "おひたし",
      "サラダ",
      "スープ",
      "汁",
      "そうめん",
      "にゅうめん",
      "冷奴",
      "湯豆腐",
      "温泉卵",
      "目玉焼き",
      "茶碗蒸し",
      "ざるそば",
      "冷やし中華",
      "ポタージュ",
    ],
  },
  {
    tagId: "tag-volume-snack",
    keywords: [
      "たこ焼き",
      "お好み焼き",
      "もんじゃ焼き",
      "アヒージョ",
      "ガーリックシュリンプ",
      "フライドポテト",
      "エビマヨ",
      "バンバンジー",
      "棒棒鶏",
      "エビチリ",
    ],
  },
]

const BASE_RULES: Rule[] = [
  {
    tagId: "tag-base-donburi",
    keywords: ["丼"],
  },
  {
    tagId: "tag-base-noodle",
    keywords: [
      "ラーメン",
      "うどん",
      "そば",
      "焼きそば",
      "そうめん",
      "にゅうめん",
      "パスタ",
      "ペペロンチーノ",
      "カルボナーラ",
      "ボロネーゼ",
      "アマトリチャーナ",
      "ペンネ",
      "ナポリタン",
      "冷やし中華",
      "担々麺",
      "つけ麺",
      "きつねうどん",
      "肉うどん",
      "カレーうどん",
      "焼きうどん",
      "明太子パスタ",
      "和風パスタ",
      "春雨",
    ],
  },
  {
    tagId: "tag-base-rice",
    keywords: [
      "ライス",
      "ご飯",
      "チャーハン",
      "炒飯",
      "おにぎり",
      "炊き込み",
      "おじや",
      "雑炊",
      "ピラフ",
      "タコライス",
      "ガパオライス",
      "ひじきご飯",
      "栗ご飯",
      "さつまいもご飯",
      "豆ご飯",
      "鶏飯",
      "オムライス",
      "ハヤシライス",
      "ドライカレー",
      "チキンライス",
      "焼きカレー",
    ],
  },
  {
    tagId: "tag-base-bread",
    keywords: ["ピザ", "フォカッチャ"],
  },
  {
    tagId: "tag-base-soup",
    keywords: [
      "汁",
      "スープ",
      "ポタージュ",
      "チャウダー",
      "ミネストローネ",
      "コンソメ",
      "おでん",
      "チゲ",
      "鍋",
    ],
  },
]

const COOKTIME_RULES: Rule[] = [
  {
    tagId: "tag-cooktime-overnight",
    keywords: ["角煮", "チャーシュー", "鶏ハム", "塩麹", "ローストビーフ"],
  },
  {
    tagId: "tag-cooktime-over60",
    keywords: [
      "ビーフシチュー",
      "クリームシチュー",
      "ポトフ",
      "おでん",
      "煮込みハンバーグ",
      "筑前煮",
      "ローストチキン",
      "ビーフストロガノフ",
      "豆乳鍋",
      "もつ鍋",
      "ちゃんこ",
    ],
  },
  {
    tagId: "tag-cooktime-under60",
    keywords: [
      "グラタン",
      "ラザニア",
      "ハンバーグ",
      "肉じゃが",
      "カレー",
      "炊き込み",
      "豚バラ大根",
      "しゃぶしゃぶ",
      "水炊き",
      "キムチ鍋",
      "石狩鍋",
      "タンドリー",
      "ロールキャベツ",
      "餃子",
      "春巻き",
      "酢豚",
      "八宝菜",
      "肉豆腐",
      "かぼちゃの煮物",
      "大根の煮物",
      "切り干し大根",
      "里芋の煮物",
    ],
  },
  {
    tagId: "tag-cooktime-under15",
    keywords: [
      "おひたし",
      "サラダ",
      "冷奴",
      "湯豆腐",
      "そうめん",
      "温泉卵",
      "目玉焼き",
      "スクランブルエッグ",
      "だし巻き卵",
      "炒り卵",
      "バンバンジー",
      "棒棒鶏",
      "冷やし中華",
      "モヤシ炒め",
      "小松菜の炒め物",
      "アスパラのバター炒め",
    ],
  },
]

const PROTEIN_RULES: Rule[] = [
  {
    tagId: "tag-protein-chicken",
    keywords: [
      "唐揚げ",
      "から揚げ",
      "鶏",
      "チキン",
      "親子丼",
      "照り焼き",
      "チキン南蛮",
      "タンドリー",
    ],
  },
  {
    tagId: "tag-protein-pork",
    keywords: [
      "豚",
      "トンカツ",
      "豚カツ",
      "ロールキャベツ",
      "角煮",
      "豚汁",
      "チャーシュー",
      "生姜焼き",
      "ホイコーロー",
      "回鍋肉",
      "豚キムチ",
    ],
  },
  {
    tagId: "tag-protein-beef",
    keywords: ["牛", "ビーフ", "すき焼き", "ハヤシ", "ステーキ", "ローストビーフ"],
  },
  {
    tagId: "tag-protein-mixed",
    keywords: [
      "ハンバーグ",
      "メンチ",
      "餃子",
      "シュウマイ",
      "春巻き",
      "肉団子",
      "ミートボール",
      "ミートソース",
      "ボロネーゼ",
      "アマトリチャーナ",
      "キャベツメンチ",
      "ミラノ風",
    ],
  },
  {
    tagId: "tag-protein-salmon",
    keywords: ["鮭", "サーモン"],
  },
  {
    tagId: "tag-protein-whitefish",
    keywords: ["鯛", "タラ", "白身魚", "ムニエル", "アクアパッツァ", "ピカタ"],
  },
  {
    tagId: "tag-protein-seafood",
    keywords: [
      "さば",
      "さんま",
      "あじ",
      "ぶり",
      "いわし",
      "煮魚",
      "魚介",
      "シーフード",
      "アクアパッツァ",
    ],
  },
  {
    tagId: "tag-protein-shrimp",
    keywords: ["エビ", "シュリンプ"],
  },
  {
    tagId: "tag-protein-squid",
    keywords: ["イカ"],
  },
  {
    tagId: "tag-protein-shellfish",
    keywords: ["ホタテ", "カキ", "貝", "クラム", "ハマグリ", "あさり"],
  },
  {
    tagId: "tag-protein-egg",
    keywords: [
      "卵",
      "たまご",
      "エッグ",
      "オムレツ",
      "オムライス",
      "茶碗蒸し",
      "親子丼",
      "だし巻き",
      "炒り卵",
      "目玉焼き",
      "スクランブル",
      "温泉卵",
      "ニラ玉",
      "卵とじ",
      "かに玉",
      "ピカタ",
    ],
  },
  {
    tagId: "tag-protein-tofu",
    keywords: ["豆腐", "湯豆腐", "冷奴", "揚げ出し", "麻婆豆腐"],
  },
  {
    tagId: "tag-protein-legume",
    keywords: ["豆ご飯", "ひじきご飯", "ひじきの煮物", "ひじきサラダ"],
  },
]

const SEASON_RULES: Rule[] = [
  {
    tagId: "tag-season-warm",
    keywords: [
      "鍋",
      "おでん",
      "すき焼き",
      "シチュー",
      "ポトフ",
      "グラタン",
      "豚汁",
      "けんちん",
      "粕汁",
      "ラーメン",
      "担々麺",
      "雑炊",
      "おじや",
      "石狩",
      "もつ鍋",
      "ちゃんこ",
    ],
  },
  {
    tagId: "tag-season-refreshing",
    keywords: [
      "冷やし中華",
      "そうめん",
      "冷奴",
      "サラダ",
      "バンバンジー",
      "棒棒鶏",
      "ガパオ",
      "タコライス",
      "ざるそば",
      "酢豚",
    ],
  },
  {
    tagId: "tag-season-winter",
    keywords: ["おでん", "石狩", "もつ鍋", "ちゃんこ", "粕汁"],
  },
  {
    tagId: "tag-season-summer",
    keywords: ["そうめん", "冷やし中華", "ガパオ", "タコライス"],
  },
  {
    tagId: "tag-season-spring",
    keywords: ["豆ご飯", "菜の花"],
  },
  {
    tagId: "tag-season-autumn",
    keywords: ["さんま", "栗ご飯", "さつまいもご飯"],
  },
]

// ---------------------------------------------------------------------------
// Tag assignment logic
// ---------------------------------------------------------------------------

const RULE_SETS: {
  rules: Rule[]
  defaultTagId: string
  allowMultiple: boolean
}[] = [
  { rules: GENRE_RULES, defaultTagId: "tag-genre-japanese", allowMultiple: true },
  { rules: VOLUME_RULES, defaultTagId: "tag-volume-normal", allowMultiple: false },
  { rules: BASE_RULES, defaultTagId: "tag-base-none", allowMultiple: false },
  { rules: COOKTIME_RULES, defaultTagId: "tag-cooktime-under30", allowMultiple: false },
  { rules: PROTEIN_RULES, defaultTagId: "tag-protein-none", allowMultiple: true },
  { rules: SEASON_RULES, defaultTagId: "tag-season-yearround", allowMultiple: true },
]

function assignTags(dishName: string): string[] {
  const tagIds: string[] = []

  for (const { rules, defaultTagId, allowMultiple } of RULE_SETS) {
    const matched: string[] = []

    for (const rule of rules) {
      if (rule.keywords.some((kw) => dishName.includes(kw))) {
        matched.push(rule.tagId)
        if (!allowMultiple) break
      }
    }

    if (matched.length === 0) {
      tagIds.push(defaultTagId)
    } else {
      tagIds.push(...matched)
    }
  }

  // 重複除去
  return [...new Set(tagIds)]
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const dryRun = process.argv.includes("--dry-run")
  console.log(`=== タグ自動付与 ${dryRun ? "[DRY RUN]" : ""} ===\n`)

  const dishesRaw = fs.readFileSync(DISHES_PATH, "utf-8")
  const tagsRaw = fs.readFileSync(TAGS_PATH, "utf-8")
  const dishesData = JSON.parse(dishesRaw) as DishesData
  const tagsData = JSON.parse(tagsRaw) as TagsData

  const validTagIds = new Set(tagsData.tags.map((t) => t.id))
  let totalTagged = 0
  let totalTags = 0

  const updated = dishesData.dishes.map((dish) => {
    const tagIds = assignTags(dish.name).filter((id) => validTagIds.has(id))
    totalTagged++
    totalTags += tagIds.length
    return { ...dish, tagIds }
  })

  const avgTags = (totalTags / totalTagged).toFixed(1)
  console.log(`処理件数: ${totalTagged}件`)
  console.log(`平均タグ数: ${avgTags}個/料理`)

  // 5タグ未満の料理を警告
  const underTagged = updated.filter((d) => d.tagIds.length < 5)
  if (underTagged.length > 0) {
    console.log(`\n⚠️  タグ5個未満の料理 (${underTagged.length}件):`)
    for (const d of underTagged.slice(0, 10)) {
      console.log(`  ${d.name}: ${d.tagIds.join(", ")}`)
    }
    if (underTagged.length > 10) {
      console.log(`  ... 他${underTagged.length - 10}件`)
    }
  }

  if (!dryRun) {
    // タグマスターを dishes.json に統合して出力
    const output: DishesData = {
      dishes: updated,
      tags: tagsData.tags,
    }
    fs.writeFileSync(DISHES_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf-8")
    console.log(`\n✅ data/dishes.json を更新しました（タグ含む）`)
  } else {
    console.log("\n[DRY RUN] サンプル3件:")
    for (const d of updated.slice(0, 3)) {
      console.log(`  ${d.name}: [${d.tagIds.join(", ")}]`)
    }
  }
}

main()
