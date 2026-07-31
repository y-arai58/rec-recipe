# TASK-014: まとめ買い献立プランナー（3〜7日分の献立 + 買い物リスト）

## Meta
- status: done
- priority: high
- estimated_hours: 12
- assignee:
- github_issue:
- depends_on: [TASK-012, TASK-013]
- created_at: 2026-07-31T00:00:00+09:00
- started_at: 2026-07-31T00:00:00+09:00
- completed_at: 2026-07-31T00:00:00+09:00
- milestone: v1.1
- labels: [feature, data]

## Description

買い物1回で3〜7日分の献立を組み立て、そのための買い物リストを出す。
現実の買い物の制約を織り込むのが要件の核心:

- にんじんやじゃがいもは1本ずつ売っていない（袋・パック単位でしか買えない）
- 肉は大容量パックのほうが単価が安い
- まとめ買いした食材は一定期間で使い切らないと傷む

着手時点で `data/dishes.json` は料理名とタグしか持っておらず（ADR-003）、
材料データがゼロだったため、データ設計から作り直した（ADR-007）。

## Acceptance Criteria
- [x] 3〜7日を選んで献立を作れる
- [x] 2〜4人分で分量が変わる
- [x] 同じ料理が2回出ない
- [x] 買い物リストがパック単位で出る（必要量ちょうどでは買えない）
- [x] 量がまとまると大容量パックが選ばれ、少量なら小分けが選ばれる
- [x] 概算の合計金額が出る
- [x] 日持ちの短い食材を使う料理が前半の日に来る
- [x] 日持ちを超えて使う食材が警告される（冷凍できるものは冷凍を案内）
- [x] 使い切れずに余る食材が警告される
- [x] 常備品（醤油・砂糖など）は買い物リストに出さず別枠にする
- [x] 献立が肉だけに偏らない
- [x] 同じ主菜食材が続きすぎない
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] ADR-007 を書く（ADR-003 の「食材量を持たない」を一部撤回）
- [x] `domain/models/ingredient.ts`（Ingredient / PackOption / DishIngredient）
- [x] `data/ingredients.json` — 食材マスター67件（うち常備品22件）
- [x] `data/dish-ingredients.json` — 主菜55件ぶんの材料（2人分）
- [x] `lib/ingredient-schema.ts` / `lib/ingredient-data.ts` / テスト
- [x] `features/meal-plan/shopping.ts` — 最小コストのパック組み合わせ探索
- [x] `features/meal-plan/planning.ts` — 献立選定・日並べ・買い物リスト・警告
- [x] `features/meal-plan/queries.ts` — 候補料理の抽出
- [x] `features/meal-plan/components/MealPlanner.tsx`
- [x] `app/plan/page.tsx` とトップからの導線
- [x] shopping / planning / MealPlanner のテスト（+35件）

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-07-31 | created | 材料データが存在しないことが判明。データ設計から必要 |
| 2026-07-31 | note | 初版は「共有食材の個数」でスコアリングしたところ、材料の少ない肉料理ばかりが選ばれ5日間野菜ゼロになった。共有率＋野菜ボーナスに変更 |
| 2026-07-31 | completed | vitest 55 → 90件 pass |

## Design

### 買い物の制約をどうモデル化したか

`Ingredient.packs` を `{ size, price, label }` の配列にした。これ1つで

- 「にんじんは3本入り袋しかない」→ packs が `[{size:3}]` だけ
- 「肉は大容量が安い」→ `[{size:300,price:450},{size:600,price:780}]`

の両方が表現できる。`choosePacks()` が必要量以上になる組み合わせのうち
最安のものを全探索で選ぶ（パック種類は1〜2なので全探索で足りる）。

### 献立の選び方

1. 好みタグに合う料理を1品選ぶ
2. 以降は「すでに買う食材の使い回し率」が高い料理を優先して足す
3. 日持ちの短い食材を使う料理を前半の日に並べ替える
4. 食材ごとの必要量と「最後に使う日」を集計
5. パック単位に切り上げて買い物リストへ
6. `最後に使う日 > 日持ち日数` なら警告

スコアの重みは `planning.ts` の定数にまとめてある。

## Results

5日分・2人分の実行例（乱数固定）:

| | |
| --- | --- |
| 献立 | 豚の生姜焼き / 牛丼 / ロールキャベツ / カツ丼 / 肉団子 |
| 買う食材 | 7種類（玉ねぎは5品すべてで使い回し） |
| 概算 | ¥3,440 |
| 警告 | 豚ロース肉・合いびき肉は日持ち2日 → 冷凍を案内。牛こま100g余り |

## Notes

材料データを持つのは55件で、224件全部ではない。
献立プランナーの候補は `data/dish-ingredients.json` に載っている料理だけで、
データを足せば自動的に候補が増える設計にしてある。

価格は固定の目安値。実売価格ではないので、UI では「目安」と明示している。
