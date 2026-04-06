# TASK-003: 料理データ取得スクリプト（スクレイピング）

## Meta
- status: done
- priority: high
- estimated_hours: 5
- assignee:
- github_issue:
- depends_on: [TASK-002]
- created_at: 2026-04-06T00:00:00+09:00
- started_at: 2026-04-06T00:00:00+09:00
- completed_at: 2026-04-06T00:00:00+09:00
- milestone: MVP
- labels: [data]

## Description
家庭料理の料理名を 200 件以上スクレイピングで収集し、`data/dishes.json` に出力する初期データ構築スクリプトを作成する。
本番アプリのルーティングには含めない（`scripts/scrape/` に配置）。DBなし構成のため、DB投入処理は不要。

## Acceptance Criteria
- [x] スクレイピングスクリプトが `scripts/scrape/index.ts` に実装されている
- [x] 200 件以上の家庭料理名を取得できる（224件）
- [x] 取得した料理データが `data/dishes.json` に出力される（上書きではなくマージ）
- [x] 重複料理名のハンドリングがある（skip）
- [x] スクリプト実行が `npm run scrape` または `npx tsx scripts/scrape/index.ts` で動作する
- [x] `scripts/scrape/CLAUDE.md` に「data/dishes.jsonを直接更新する」旨の警告が記載されている

## Sub Tasks
- [x] スクレイピング対象サイトの選定と利用規約確認
- [x] スクレイピングスクリプト実装（cheerio + 組み込みシードデータ）
- [x] 取得データを `data/dishes.json` に出力する処理（重複skip）
- [x] `scripts/scrape/CLAUDE.md` 作成（危険モジュールガード）
- [x] 200 件以上の取得確認（224件）
- [x] AI（ChatGPT等）でタグを一括付与するためのCSV/JSON出力サブスクリプト

## Technical Notes
- cheerio（静的HTML解析）を優先。JavaScript描画が必要なら puppeteer を使う
- 対象候補サイト: クックパッド、delish kitchen、みんなのきょうの料理 等（規約確認必須）
- レート制限（1リクエスト/秒程度）を設けてサーバー負荷を抑える
- AI タグ付与用に `dish_name_list.json` を出力するサブスクリプトも作成する
- 出力先: `data/dishes.json`（DBなし・JSONファイル管理）

## Files to Create/Modify
- `scripts/scrape/index.ts`: スクレイピングスクリプト
- `scripts/scrape/CLAUDE.md`: 危険モジュールガード
- `data/dishes.json`: 出力先

## Progress Log
| Date | Action | Note |
|------|--------|------|
| 2026-04-06 | created | Task created by /product-start |
| 2026-04-06 | updated | DB投入→JSON出力に変更（ADR-005: DBなし設計） |
| 2026-04-06 | completed | 組み込みシード225件 + cheerio Wikipedia補完。実行結果224件。dish_name_list.json出力確認。 |
