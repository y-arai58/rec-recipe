# TASK-013: 品質・パフォーマンス改善（バンドル・a11y・テスト・CI）

## Meta
- status: done
- priority: medium
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-011, TASK-012]
- created_at: 2026-07-31T00:00:00+09:00
- started_at: 2026-07-31T00:00:00+09:00
- completed_at: 2026-07-31T00:00:00+09:00
- milestone: v1.0
- labels: [chore, performance, a11y, test]

## Description

静的エクスポート構成のため `lib/data.ts` は Client Component からも読まれる。
そこで Zod のパースを module scope で走らせていたため、スキーマ定義ごと
クライアントバンドルに載っていた。あわせてテストが scoring のみで、
CI もビルドしか回していなかった。

## Acceptance Criteria
- [x] 実行時（ブラウザ）で Zod が走らない
- [x] `data/dishes.json` のスキーマ検証が CI で担保されている
- [x] `getAllDishesWithTags()` が呼び出しごとに再計算しない
- [x] 選択肢グループが支援技術に「見出し付きのグループ」として伝わる
- [x] 結果画面の更新がスクリーンリーダーに通知される
- [x] `QuestionFlow` のレンダリング / 操作テストがある
- [x] CI で typecheck / lint / test が走る
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] `lib/data-schema.ts` に Zod スキーマを分離（テスト・スクリプト専用）
- [x] `lib/data.ts` から Zod を除去し、タグ結合を起動時1回のキャッシュに変更
- [x] `lib/data.test.ts` を追加（スキーマ・ID重複・未知タグ参照・タグ未付与を検証）
- [x] `@testing-library/react` を導入
- [x] jsdom → happy-dom に置き換え
- [x] `QuestionFlow.test.tsx` を追加（11ケース）
- [x] 選択肢を `fieldset` + `legend` に変更
- [x] 結果画面に `aria-live="polite"` を付与
- [x] `deploy.yml` に typecheck / lint / test ステップを追加

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-07-31 | created | Zod がクライアントバンドルに載っていることを確認 |
| 2026-07-31 | note | jsdom 29 が Node 20 の require(ESM) + top-level await で起動できず、happy-dom に変更 |
| 2026-07-31 | completed | vitest 19 → 38件 pass |

## Notes

`getDishById` は以前 `Dish` を返していたが、内部を id 索引の Map に統一したため
`DishWithTags`（`Dish` の上位互換）を返すようになった。呼び出し側の型は変わらない。

`zod` は `package.json` の dependencies に残しているが、
アプリのモジュールグラフからは外れているためバンドルには含まれない。
