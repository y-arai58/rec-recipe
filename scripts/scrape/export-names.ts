/**
 * AIタグ付け用 料理名リスト出力スクリプト
 *
 * data/dishes.json から料理名を抽出し、以下を出力する:
 *   - data/dish_name_list.json: 料理名の配列（ChatGPT等に渡す用）
 *
 * 実行: npx tsx scripts/scrape/export-names.ts
 *
 * ChatGPT プロンプト例:
 *   以下の料理名それぞれに対して、次のカテゴリでタグを付けてください。
 *   カテゴリ: genre(和洋中など), volume(軽め/普通/ボリューミー),
 *             base(ご飯/パン/麺/なし), cookTime(〜15分/〜30分/30分以上),
 *             protein(肉/魚/卵/豆腐/なし), season(春/夏/秋/冬/通年)
 *   出力形式: JSON配列 [{"name":"...","tags":{"genre":"...","volume":"...",...}}]
 */

import * as fs from "node:fs"
import * as path from "node:path"

const DATA_PATH = path.resolve(process.cwd(), "data/dishes.json")
const OUTPUT_PATH = path.resolve(process.cwd(), "data/dish_name_list.json")

type DishesData = {
  dishes: { id: string; name: string; tagIds: string[] }[]
  tags: unknown[]
}

function main(): void {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`❌ ${DATA_PATH} が見つかりません。先にスクレイピングを実行してください。`)
    process.exit(1)
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8")
  const data = JSON.parse(raw) as DishesData

  if (data.dishes.length === 0) {
    console.warn("⚠️  dishes が空です。先に scrape スクリプトを実行してください。")
    process.exit(1)
  }

  // タグ未付与の料理だけを対象にする
  const untagged = data.dishes.filter((d) => d.tagIds.length === 0)
  const nameList = untagged.map((d) => ({ id: d.id, name: d.name }))

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(nameList, null, 2)}\n`, "utf-8")

  console.log(`=== 料理名リスト出力完了 ===`)
  console.log(`出力: ${OUTPUT_PATH}`)
  console.log(`件数: ${nameList.length}件（タグ未付与のみ）`)
  console.log(`\n次のステップ:`)
  console.log(`  1. data/dish_name_list.json を ChatGPT に貼り付けてタグを生成`)
  console.log(`  2. 生成されたタグを data/dishes.json の tagIds に反映（TASK-004）`)
}

main()
