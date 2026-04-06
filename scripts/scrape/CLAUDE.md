# DANGER: scripts/scrape/

## ルール
- このスクリプトは本番DBに直接書き込む。実行前に `DATABASE_URL` が正しいか確認すること
- 実行は初期データ構築時のみ。定期実行・自動実行は禁止
- スクレイピング対象サイトの利用規約を必ず確認してから実行すること
- レート制限（1リクエスト/秒以上の間隔）を必ず守ること
- 本番アプリのルーティングには含めない

## 実行手順
1. `.env.local` の `DATABASE_URL` を確認
2. `npx tsx scripts/scrape/index.ts`（実行前にドライランで件数を確認）
3. Prisma Studio でデータを確認
