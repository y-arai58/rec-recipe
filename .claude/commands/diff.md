現在のブランチの変更サマリーを表示する。

1. `git diff main...HEAD --stat` で変更ファイル一覧
2. `git log main..HEAD --oneline` でコミット一覧
3. サマリー:
```
📊 Branch: {name} | 📝 {N} commits | 📁 {N} files
Changes: {ファイルごとの概要}
Summary: {変更全体の説明}
```
