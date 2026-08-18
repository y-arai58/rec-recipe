# TASK-015: 提案をメイン料理に絞り、付け合わせをサブ提案にする

## Meta
- status: done
- priority: high
- estimated_hours: 4
- assignee:
- github_issue:
- depends_on: [TASK-012, TASK-014]
- created_at: 2026-08-18T00:00:00+09:00
- started_at: 2026-08-18T00:00:00+09:00
- completed_at: 2026-08-18T00:00:00+09:00
- milestone: v1.1
- labels: [feature, data]

## Description

レコメンドが「ほうれん草のおひたし」「味噌汁」のような副菜・汁物を
メイン料理と同列に提案していた。献立を決めたい人にとって、
副菜だけを出されても「今日何食べる？」は解決しない。

提案するのは
- 丼・麺・カレーなど、それ単体で一食になるもの（onedish）
- ご飯と合わせて一食になるおかず（main）

の2つだけにする。副菜・汁物・主食はメインの付け合わせ（サブ提案）として出す。
具だくさんサラダはそれ自体がメインになるため、ジャンル質問に「サラダ」を追加し、
主菜になるサラダをデータに足す。

## Acceptance Criteria
- [x] 全料理に「献立での役割」タグ（onedish / main / side / soup / staple）が1つ付く
- [x] レコメンドは onedish / main だけを提案する（副菜・汁物・主食は単体で出さない）
- [x] メイン1品ごとに付け合わせを最大2品サブ提案する
- [x] 付け合わせはジャンル・季節が揃い、メインとタンパク源がかぶらないものを選ぶ
- [x] 同じ提案リスト内で付け合わせが重複しない
- [x] 「何系が食べたい？」に「サラダ」を追加する
- [x] サラダを選ぶとメインになる具だくさんサラダが提案される
- [x] サラダが主役のときは主食＋汁物を付け合わせる（炭水化物を補う）
- [x] 献立プランナー（/plan）も副菜・汁物をその日の主役にしない
- [x] 料理詳細ページに役割を表示する
- [x] tsc / biome / vitest がすべて通る

## Sub Tasks
- [x] `domain/models/tag.ts` — role カテゴリ / DishRole / getRole
- [x] `data/tags.json` — role タグ5件と `tag-genre-salad` を追加
- [x] `data/dishes.json` — 主菜になるサラダ9件・副菜サラダ5件を追加（224→238件）
- [x] `scripts/tag-assign.ts` — 役割の判定（料理名の明示リスト + 主食タグからの導出）
- [x] `features/recommend/pairing.ts` — 付け合わせの選定 + テスト
- [x] `features/recommend/scoring.ts` — `filterByRoles`
- [x] `features/recommend/components/DishCard.tsx` — 「合わせるなら」欄
- [x] `constants/questions.ts` — サラダの選択肢
- [x] `features/meal-plan/queries.ts` — 候補をメインだけに絞る
- [x] `components/ui/tag-badge.tsx` / `globals.css` / design-system — role の色

## Progress Log
| Date | Action | Note |
| --- | --- | --- |
| 2026-08-18 | created | ユーザー指摘: 副菜がメインと同列に提案されている |
| 2026-08-18 | note | 役割はキーワードでは主菜と副菜を分けきれず、料理名の明示リストで持つことにした |
| 2026-08-18 | completed | 238件の役割分布: onedish 56 / main 115 / side 43 / soup 17 / staple 7 |
