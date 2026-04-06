# ADR-005: DBなし設計（静的JSONファイル）

- **Status:** Accepted
- **Date:** 2026-04-06

## Context

料理データ（約200件）はスクレイピングで初回構築後、実質変更なし。
PostgreSQL + Prisma を使う設計だったが、インフラコストと複雑さを検討した結果、静的JSONファイルで十分と判断。

## Decision

PostgreSQL + Prisma を廃止し、`data/dishes.json` に料理データを格納する。

## Consequences

- **メリット:** Vercelのみで完結・DB接続不要・インフラコスト0・セットアップ簡単
- **デメリット:** データ更新にはデプロイが必要・200件超での検索パフォーマンス懸念（ただし許容範囲）
- 影響タスク: TASK-001（Prisma除去）, TASK-002（型定義のみ）, TASK-003（JSON出力）, TASK-007（JSON読み込み）
