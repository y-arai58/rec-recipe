変更内容を確認し、Conventional Commits 形式でコミットする。

1. `git diff --cached --stat` 確認（未ステージなら `git add -A`）
2. 変更内容から type を選択: feat / fix / refactor / style / docs / test / chore / perf
3. 関連 TASK 番号を tasks/ から推測
4. メッセージ提案 → ユーザー確認 → `git commit`

Format: `{type}(TASK-XXX): {description}`
$ARGUMENTS があればそれを説明として使う。
