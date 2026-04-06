# Git Conventions

## Branch: {type}/TASK-XXX-{short-desc}
feature/ fix/ design-system/ refactor/ docs/ chore/

## Commit: {type}(TASK-XXX): {description}
feat fix refactor style docs test chore perf ci
英語、小文字、現在形、72文字以内

## PR: [TASK-XXX] {description}
- Closes #{issue} 必須。レビュワー最低1人
- UI変更はスクリーンショット添付
- Squash and Merge。マージ後ブランチ削除
