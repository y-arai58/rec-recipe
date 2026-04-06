# TASK-003: 料理データ取得スクリプト（スクレイピング）

## Meta
- status: todo
- priority: high
- estimated_hours: 6
- assignee:
- github_issue:
- depends_on: [TASK-002]
- created_at: 2026-04-06T00:00:00+09:00
- started_at:
- completed_at:
- milestone: MVP
- labels: [database]

## Description
家庭料理の料理名を 200 件以上スクレイピングで収集し、DBに投入する初期データ構築スクリプトを作成する。
本番アプリのルーティングには含めない（`scripts/scrape/` に配置）。

## Acceptance Criteria
- [ ] スクレイピングスクリプトが `scripts/scrape/index.ts` に実装されている
- [ ] 200 件以上の家庭料理名を取得できる
- [ ] 取得した料理データが `Dish` テーブルに投入される
- [ ] 重複料理名のハンドリングがある（upsert または skip）
- [ ] スクリプト実行が `npm run scrape` または `npx tsx scripts/scrape/index.ts` で動作する
- [ ] `scripts/scrape/CLAUDE.md` に「本番DBに直接書き込む」旨の警告が記載されている

## Sub Tasks
- [ ] スクレイピング対象サイトの選定と利用規約確認
- [ ] スクレイピングスクリプト実装（cheerio or puppeteer）
- [ ] 取得データのDB投入処理（Prisma upsert）
- [ ] `scripts/scrape/CLAUDE.md` 作成（危険モジュールガード）
- [ ] 200 件以上の取得確認
- [ ] AI（ChatGPT等）でタグを一括付与するためのデータ出力スクリプト（CSV/JSON）

## Technical Notes
- cheerio（静的HTML解析）を優先。JavaScript描画が必要なら puppeteer を使う
- 対象候補サイト: クックパッド、delish kitchen、みんなのきょうの料理 等（規約確認必須）
- レート制限（1リクエスト/秒程度）を設けてサーバー負荷を抑える
- AI タグ付与用に `dish_name_list.json` を出力するサブスクリプトも作成する

## Files to Create/Modify
- `scripts/scrape/index.ts`: スクレイピングスクリプト
- `scripts/scrape/CLAUDE.md`: 危険モジュールガード

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
