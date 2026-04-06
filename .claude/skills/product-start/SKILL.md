---
name: product-start
description: 新規プロダクト開発をSDD（仕様駆動開発）で開始。ヒアリング→仕様書→アーキテクチャ→タスク分解→GitHub Issue作成。
---

# Product Start Workflow

See @references/templates.md for document and task file templates.

このワークフローは SDD（仕様駆動開発）に基づく。

ultrathink

> Reference: .claude/skills/anti-ai-design/SKILL.md

## Phase 1: 初期化
docs/spec/, docs/adr/, tasks/, tasks/lessons.md を作成。

既存ドキュメントの確認:
- docs/spec/ に既存ファイルがある場合: 内容を読み取り「これをベースに進めますか？」と確認
- ユーザーから仕様書を受け取った場合: その仕様書を元に読み解き、不明点を Phase 2 で質問する
- **仕様書が既に存在する場合でも、受け取った仕様書を元に改めて docs/spec/ に構造化した仕様書を作成する**

## Phase 2: ヒアリング
1つずつ質問。AskUserQuestion で選択肢ベース。
全回答を記憶し、全カテゴリ完了後にドキュメント生成。

### カテゴリ: ビジョン
- どんなプロダクトを作りたいか / 解決する課題 / 成功指標

### カテゴリ: ターゲットユーザー
- 誰が使うか / 技術リテラシー / 利用シーン

### カテゴリ: 主要機能
- 最重要機能 / 他の機能と優先度(MoSCoW) / スコープ外

### カテゴリ: ページ構成
- 必要なページ一覧 / 各ページのユーザーアクション / 重要な画面遷移

### カテゴリ: デザイン（重要 — 回答に応じて分岐する）

**Q1: 「既にデザイン（Figma, カンプ, ワイヤーフレーム）はありますか？」**

**→ デザインがある場合:**
1. 「FigmaファイルのURLを教えてください」と求める
2. Figma MCP (get_screenshot, get_design_context) でデザインの内容を読み取る
3. 読み取ったデザインから色・タイポグラフィ・レイアウトパターンを把握
4. 「このデザインに合わせてデザインシステムを構築しますか？」と確認
5. デザインの不明点（状態遷移、ホバー、エラー表示等）を追加で質問

**→ デザインがない場合:**
以下を1つずつ質問してデザインシステム構築の方針を固める:
1. 「デザインの方向性はありますか？（色、雰囲気、参考サイト）」
2. 「プライマリカラーの希望は？（例: blue, green, purple）」
3. 「ダークモード対応は必要ですか？」
4. 「フォントの指定はありますか？（デフォルト: Inter + Noto Sans JP）」
5. 「角丸は多め（柔らかい）か少なめ（シャープ）か？」
6. 「全体的にコンパクト？それともゆったり？」

**Q2: 「使用したいデザインシステムはありますか？（shadcn/ui, MUI 等）」**

**→ ある場合:** そのDSを前提にアーキテクチャを設計
**→ ない場合:** 「shadcn/ui ベースでデザインシステムを構築しますか？」
  - 構築する → タスクに「DS構築」タスクを含める（/design-system で実行）
  - 構築しない → shadcn/ui のデフォルトテーマのまま進める

### カテゴリ: 技術要件
- 認証方式 / 外部サービス連携 / DB要件

### カテゴリ: 非機能要件
- SEO / 多言語 / レスポンシブ範囲 / アクセシビリティ / パフォーマンス

### カテゴリ: スケジュール
- リリース目標 / MVP範囲 / チーム役割分担

## Phase 3: ドキュメント生成（順番厳守、各ユーザー確認）
1. docs/spec/interview-record.md
2. docs/spec/context-notes.md
3. docs/spec/user-stories.md (MoSCoW + Acceptance Criteria)
4. docs/spec/requirements.md (FR-XXX + NFR-XXX)

## Phase 4: アーキテクチャ
docs/architecture.md 生成。CQRS境界・features/構成・Prismaマルチスキーマを反映。
重要判断は docs/adr/ADR-XXX.md に記録。
危険モジュールに CLAUDE.md を配置（src/auth/, prisma/ 等）。

## Phase 5: タスク分解
tasks/TASK-001.md〜。チェックボックス付き Acceptance Criteria と Sub Tasks。

## Phase 6: GitHub Issue
親Issue + Sub-Issue。ラベル + マイルストーン。TASK-XXX.md に URL記録。

## 完了
```
✅ セットアップ完了
⏭️ /status → /task-start TASK-001 → /design-system
```
