# DANGER: scripts/scrape/

## ⚠️ 警告

このスクリプトは **`data/dishes.json` を直接上書き** する。
実行前に必ずバックアップまたは git commit しておくこと。

## ルール

- 実行は初期データ構築時のみ。定期実行・自動実行は禁止
- スクレイピング対象は Wikipedia (CC BY-SA 4.0)。他サイトを追加する場合は利用規約を必ず確認すること
- レート制限（1リクエスト/秒以上の間隔）を必ず守ること
- 本番アプリのルーティングには含めない
- `--dry-run` フラグで実際の書き込みなしに動作確認できる

## 実行手順

```bash
# 1. ドライランで取得件数を確認
npx tsx scripts/scrape/index.ts --dry-run

# 2. 本番実行（data/dishes.json を更新）
npx tsx scripts/scrape/index.ts
# または
npm run scrape

# 3. AIタグ付け用リストを出力
npx tsx scripts/scrape/export-names.ts
```

## 出力ファイル

| ファイル | 内容 |
|---------|------|
| `data/dishes.json` | 料理データ本体（スクレイピング結果マージ） |
| `data/dish_name_list.json` | タグ未付与料理名一覧（AIタグ付け用） |
