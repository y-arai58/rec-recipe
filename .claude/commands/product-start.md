新規プロダクト開発を開始する。

SDD（仕様駆動開発）に基づき、以下のフローを順に実行する:

1. プロジェクト初期化（docs/, tasks/ 作成）
2. ヒアリング（1つずつ質問、AskUserQuestionで選択肢ベース）
   - デザインが既にある場合 → FigmaのURLを求め、MCPでデザインを読み取る
   - デザインがない場合 → 色・フォント・雰囲気を質問してDS構築方針を決める
3. ドキュメント生成（interview-record → context-notes → user-stories → requirements）
4. アーキテクチャ設計（architecture.md + ADR）
5. タスク分解（tasks/TASK-XXX.md、チェックボックス付き）
6. GitHub Issue 作成（親Issue + Sub-Issue）

product-start スキルを参照して実行すること。
