指定したタスクの実装を開始する。/task-start スキルのショートカット。

$ARGUMENTS にタスク番号を指定する。
例: `/task-run TASK-003`

1. tasks/$ARGUMENTS.md を読む
2. tasks/lessons.md から関連教訓を確認
3. 依存タスクが全て完了しているか確認
4. status を in-progress に更新
5. Plan Mode で実装計画を立てる → ユーザー確認
6. 実装開始

引数がない場合は tasks/ から着手可能な（依存解消済み + 優先度が高い）タスクを提案する。
