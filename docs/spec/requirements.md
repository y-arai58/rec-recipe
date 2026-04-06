# Requirements

## Functional Requirements

### FR-001: 料理レコメンド
- **Description:** ユーザーが質問フロー（3〜5問）に回答すると、回答タグに基づいて料理を 3〜5 件提案する。
- **Priority:** Must
- **Related:** US-001
- **Notes:** タグマッチングによるスコアリング。同スコアの場合はランダムまたはシャッフルで多様性を出す。

### FR-002: 質問フロー
- **Description:** 「ジャンル」「ボリューム感」「主食」「調理時間」など 3〜5 問の選択式質問を 1 問ずつ表示する。
- **Priority:** Must
- **Related:** US-001, US-006
- **Notes:** 質問の順序と選択肢は設定ファイルまたはDBで管理する。

### FR-003: 料理詳細・タグ表示
- **Description:** レコメンド結果の料理をタップすると、料理名とタグ一覧を表示する詳細画面に遷移する。
- **Priority:** Should
- **Related:** US-002
- **Notes:** タグはカテゴリ別にグループ化して表示するとわかりやすい。

### FR-004: 料理データベース（スクレイピング）
- **Description:** ネットから家庭料理を 200 件以上スクレイピングしてDBに格納する（初期構築用スクリプト）。
- **Priority:** Must
- **Related:** US-003
- **Notes:** 本番アプリのルーティングには含めない。スタンドアロンのスクリプトとして実装する。対象サイトの利用規約を事前確認すること。

### FR-005: タグ管理
- **Description:** 料理に複数のタグを紐付けて管理する。タグはカテゴリ（ジャンル・ボリューム・ベース食材・調理時間・タンパク源・季節感）を持つ。
- **Priority:** Must
- **Related:** US-003
- **Notes:** 1 料理あたり 5〜10 タグを目安とする。タグ数は 50〜100 程度。

### FR-006: 管理者向けデータ編集
- **Description:** 料理・タグの追加・編集・削除ができる管理者向けインターフェース（画面またはスクリプト）。
- **Priority:** Could
- **Related:** US-004
- **Notes:** MVP では管理画面を作らず、直接DBまたはPrisma Studio で操作する運用も許容する。

### FR-007: 再レコメンド
- **Description:** レコメンド結果から「もう一度」「別の候補を見る」で同条件で別の料理を再提案できる。
- **Priority:** Should
- **Related:** US-001
- **Notes:** 同じ結果が繰り返し表示されないようにシャッフルまたは除外する。

---

## Non-Functional Requirements

### NFR-001: レスポンシブ対応
- **Category:** Accessibility
- **Description:** スマートフォン（375px〜）をベースに設計し、タブレット・PC（最大 1280px）でも自然に表示される。
- **Metric:** 375px / 768px / 1280px の 3 ブレークポイントでレイアウト崩れなし。

### NFR-002: 初期表示パフォーマンス
- **Category:** Performance
- **Description:** レコメンド画面の初期表示を 3 秒以内に完了させる（Fast 3G 相当）。
- **Metric:** Lighthouse Performance スコア 80 以上 / LCP 3.0 秒以内。

### NFR-003: レコメンド応答速度
- **Category:** Performance
- **Description:** 質問回答後のレコメンド結果表示を 1 秒以内に完了させる。
- **Metric:** Server Action 実行時間 500ms 以内（DB クエリ含む）。

### NFR-004: モバイルタップ操作性
- **Category:** Accessibility
- **Description:** タップターゲット（ボタン・選択肢）は 44×44px 以上を確保する。
- **Metric:** WCAG 2.2 SC 2.5.8 準拠。

### NFR-005: 型安全性
- **Category:** Maintainability
- **Description:** TypeScript strict モードを有効にし、any 型を禁止する。Zod で入力バリデーションを行う。
- **Metric:** TypeScript コンパイルエラー 0。

### NFR-006: コード品質
- **Category:** Maintainability
- **Description:** Biome による lint + format を CI に組み込み、コード品質を担保する。
- **Metric:** Biome check でエラー 0（warning は許容）。
