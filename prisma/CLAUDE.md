# DANGER: prisma/

## ルール
- スキーマ変更は必ず `prisma migrate dev` でマイグレーションを作成すること
- `prisma db push` は開発初期のみ許容。本番環境では絶対に使わない
- マイグレーションファイルを手動で編集しない
- スキーマ変更後は `prisma generate` で型を再生成すること

## スキーマ変更の手順
1. `schema.prisma` を編集
2. `npx prisma migrate dev --name {変更内容}` を実行
3. `npx prisma generate` で型再生成
4. `src/domain/models/` の型定義も合わせて更新
