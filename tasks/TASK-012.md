# TASK-012: 未使用タグ（protein / season）の活用とデータ品質改善

## Meta
- status: done
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-004, TASK-011]
- created_at: 2026-07-31T00:00:00+09:00
- started_at: 2026-07-31T00:00:00+09:00
- completed_at: 2026-07-31T00:00:00+09:00
- milestone: v1.0
- labels: [feature, data]

## Description

タグ48件のうち protein(14) と season(7) が質問フローで一切使われていなかった。
調査したところ、protein は**タグ付け自体が壊れていて**224件中116件（52%）が
`tag-protein-none`（＝判定不能）になっており、カツ丼・肉じゃが・青椒肉絲・
カルボナーラといった明らかに肉のある料理まで「なし」扱いだった。

season は 224件中183件が「通年」で、質問にしてもほとんど絞り込めない。

## Acceptance Criteria
- [x] `tag-protein-none` の料理が 116件 → 30件以下になっている
- [x] 野菜が主役の料理に「野菜メイン」タグが付く
- [x] 「野菜メイン」は他のタンパク源が取れた料理には付かない
- [x] 質問フローに「主役の食材は？」が追加されている
- [x] 季節タグが実行月から自動で加点され、その旨が結果画面に出る
- [x] 「通年」タグは加点に使わない（大半の料理に一律加点され順位が動かないため）
- [x] `data/dishes.json` はスクリプト経由でのみ更新する
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] protein タグの付与状況を調査（116件が none と判明）
- [x] `tag-protein-vegetable`（野菜メイン）を `data/tags.json` に追加
- [x] `scripts/tag-assign.ts` の PROTEIN_RULES を拡充
- [x] 「野菜メイン」を他タンパク源とのフォールバックにする後処理を追加
- [x] `npm run tag-assign` を実行して `data/dishes.json` を再生成
- [x] 結果をスポットチェック（麻婆豆腐 → 合いびき肉+豆腐 など）
- [x] `constants/questions.ts` に protein 質問を追加（4問 → 5問）
- [x] `constants/seasons.ts` + テストを追加
- [x] `QuestionFlow` に季節加点と説明文を実装

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-07-31 | created | protein/season タグが未使用であることを確認 |
| 2026-07-31 | note | protein タグ付けの品質不良（116/224が none）を発見。UI追加の前にデータ修正が必要 |
| 2026-07-31 | completed | none 116→27件。vitest 13→19件 pass |

## Results

タグ付与後の protein 分布:

| タグ | 件数 |
| --- | --- |
| 豚肉 | 37 |
| 鶏肉 | 32 |
| 野菜メイン | 32 |
| 合いびき肉 | 24 |
| 卵 | 22 |
| 魚介 | 15 |
| 豆腐 | 12 |
| 牛肉 | 11 |
| その他（白身魚・エビ・鮭・貝類・豆・イカ） | 23 |
| なし | 27 |

残った27件（うどん・そば・パスタ・味噌汁・おにぎり等）は料理名だけでは
タンパク源が定まらないものなので、`none` のままが正しい。

## Notes

season を質問にしなかった理由: 「通年」が183件を占めるため、
ユーザーに季節を聞いても候補がほとんど絞れない。実行月から自動で加点する方式にし、
何が起きているかは結果画面に明示した。
