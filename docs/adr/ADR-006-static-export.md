# ADR-006: 静的エクスポート + GitHub Pages 配信

## Status
Accepted

## Date
2026-04-06

## Context

ADR-005 でDBを廃止し、料理データを静的JSONに一本化した。
その結果アプリは「起動時に確定するデータ」しか扱わなくなり、
実行時にサーバーを持つ必然性がなくなった。

一方で当初は Vercel + Server Actions を前提に実装しており、
`features/recommend/actions.ts`（Server Action）と `queries.ts`（`unstable_cache`）が存在していた。

## Decision

`next.config.ts` に `output: "export"` / `basePath: "/rec-recipe"` / `images.unoptimized` を設定し、
GitHub Pages（`https://y-arai58.github.io/rec-recipe/`）へ配信する。

これに伴い:

- レコメンドのスコアリングは `QuestionFlow`（Client Component）がブラウザ上で実行する
- 料理詳細は `generateStaticParams()` で224ページを事前生成する
- Server Actions / Route Handlers / `unstable_cache` / ISR / middleware は使わない

## Alternatives

- **Vercel + Server Actions のまま**: 動くが、静的データにサーバーは過剰。無料枠管理も発生する
- **Vercel の静的配信**: 可能だが、リポジトリと同じ場所で完結する GitHub Pages を選んだ

## Consequences

- **メリット:** ホスティング費用ゼロ・インフラ管理ゼロ・main への push だけでデプロイ完了
- **デメリット:**
  - 料理データ（`dishes.json`, 約67KB）と Zod パースがクライアントバンドルに載る
  - 検索・履歴などサーバー側の状態を要する機能は今後も持てない（localStorage で代替）
  - `basePath` が固定なので、別ドメインへ移す際は設定変更が必要
- 影響: TASK-010（未使用の Server Action 系コード削除・ワークフロー重複解消）
