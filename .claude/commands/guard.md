指定ディレクトリに危険モジュール用 CLAUDE.md を作成する。

$ARGUMENTS にディレクトリパスを指定。例: `/guard src/lib/payments`

1. 指定ディレクトリのコードを読み取る
2. リスク分析（セキュリティ、データ整合性、不可逆操作等）
3. CLAUDE.md を作成:
```
# ⚠️ {モジュール名} — Handle With Care
## Risks
- {リスク}
## Rules
- {ルール}
```
