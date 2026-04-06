# Lessons Learned

> このファイルはプロジェクトの「学習記憶」である。
> Claudeは以下のタイミングで必ずこのファイルを参照・更新する。

## Usage Rules（Claudeへの指示）

### 読むタイミング（MUST READ）

1. **セッション開始時**: /product-resume, /task-run, /task-start の冒頭で必ず読む
2. **タスク着手前**: そのタスクの labels, phase, 関連技術に該当する教訓をフィルタして確認
3. **実装計画作成時**: Plan Mode で計画を立てるとき、過去に同じパターンで失敗していないか確認

### 書くタイミング（MUST WRITE）

1. **ユーザーから修正指示を受けた時**: 即座に記録する。「あとで」ではなく「今」
2. **タスク完了時**: /task-done で「今回の学び」を振り返り、あれば記録
3. **レビューで指摘を受けた時**: 指摘パターンを記録
4. **デバッグで原因特定した時**: 根本原因と対策を記録

### 活用（MUST APPLY）

- 3回以上同じカテゴリの教訓が溜まったら → .claude/rules/ にルールとして昇格を提案
- 特定のファイル/ディレクトリに関する教訓 → そのディレクトリの CLAUDE.md に追記を提案
- 実装パターンの教訓 → design-system-docs や coding-standards への反映を提案

---

## Record Format

```
### L-XXX: {教訓タイトル}
- **Date:** {YYYY-MM-DD}
- **Category:** {design | implementation | architecture | review | figma | testing | performance}
- **Task:** {TASK-XXX or N/A}
- **Context:** {何をしていたか}
- **Mistake:** {何が間違っていたか / 何が期待と違ったか}
- **Correction:** {ユーザーからの修正内容}
- **Root Cause:** {なぜ間違えたか}
- **Prevention:** {次回から防ぐための具体的ルール}
- **Applied:** {false → ルール/docs に反映済みなら true に変更}
```

---

## Lessons

(ここに教訓が追記されていく)
