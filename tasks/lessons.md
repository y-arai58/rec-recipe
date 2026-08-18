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

### L-001: 既存データを使う機能を足す前に、そのデータの品質を数えて確かめる
- **Date:** 2026-07-31
- **Category:** implementation
- **Task:** TASK-012
- **Context:** 未使用だった protein タグを質問フローに追加しようとした
- **Mistake:** タグが正しく付いている前提で UI から作り始めそうになった。
  実際は 224件中116件（52%）が `tag-protein-none` で、カツ丼・肉じゃが・
  青椒肉絲・カルボナーラまで「タンパク源なし」扱いだった
- **Correction:** 先に分布を数え、`scripts/tag-assign.ts` のルールを直してから UI を作った
- **Root Cause:** タグ付けスクリプトの「マッチしなければデフォルト値」が、
  `none`（＝存在しない）と「判定できなかった」を区別していなかった
- **Prevention:** 既存データを新しい軸で使うときは、まず
  `node -e "..."` で分布を出す。デフォルト値が過半数を占めていたら、
  それはデータではなく判定漏れだと疑う
- **Applied:** false

### L-002: 貪欲アルゴリズムのスコアは「個数」ではなく「割合」で測る
- **Date:** 2026-07-31
- **Category:** implementation
- **Task:** TASK-014
- **Context:** 献立プランナーで「食材を使い回せる料理」を優先して選ぶ実装
- **Mistake:** `共有した食材の個数 × 重み - 新規食材の個数 × 重み` でスコアリングしたところ、
  材料が1つしかない料理（鶏の照り焼きなど）が常に勝ち、
  5日間すべて肉のみ・野菜ゼロの献立が出た
- **Correction:** `共有食材 / その料理の食材数`（割合）に変え、野菜ボーナスを足した
- **Root Cause:** 「新規食材が少ない」を評価すると、材料が少ないこと自体が有利になる。
  評価軸が意図（使い回しの良さ）とずれていた
- **Prevention:** 貪欲選択のスコアを作ったら、必ず実データで最後まで回して
  出力を目視する。単体テストは「重複しない」「日数ぶん出る」を通してしまい、
  中身が偏っていることは検出できなかった
- **Applied:** false

### L-003: 静的エクスポートでは module scope の Zod がクライアントバンドルに載る
- **Date:** 2026-07-31
- **Category:** performance
- **Task:** TASK-013
- **Context:** `lib/data.ts` が読み込み時に `DishesDataSchema.parse(rawData)` を実行していた
- **Mistake:** Client Component からこのモジュールを import しているため、
  Zod とスキーマ定義がまるごとブラウザに配信されていた
- **Root Cause:** サーバーがある前提（Server Component でしか読まれない）で書いた検証が、
  静的エクスポート移行後もそのまま残っていた
- **Prevention:** スキーマ定義は `*-schema.ts` に分離し、import してよいのは
  テストとスクリプトだけにする。データの妥当性は CI のテストで担保する
- **Applied:** true（CLAUDE.md の Tech Stack に明記済み）

### L-004: 「提案する」対象は、データに役割の軸が無いと絞れない
- **Date:** 2026-08-18
- **Category:** implementation
- **Task:** TASK-015
- **Context:** 質問フローの結果に「ほうれん草のおひたし」「味噌汁」が
  カレーライスと同列に並んでいた
- **Mistake:** タグは genre / volume / base / protein / cookTime / season の
  6軸あったが、どれも「その料理が食事の主役になるか」を表していなかった。
  スコアが高ければ副菜でもメインとして提案してしまう
- **Correction:** role 軸（onedish / main / side / soup / staple）を足し、
  提案は onedish / main だけ、残りはメインの付け合わせとして出すようにした
- **Root Cause:** 「料理の属性」は増やしていたが、
  「アプリが何を提案する場所なのか」を表す軸を持っていなかった
- **Prevention:** レコメンドやリスト表示を作るときは、
  「この一覧に出てよいものは何か」を表すフラグ／軸がデータにあるか先に確認する。
  無ければ UI で除外条件を書く前にデータ側の軸として足す
- **Applied:** false

### L-005: 主菜と副菜はキーワードでは分けられない。料理名で明示的に持つ
- **Date:** 2026-08-18
- **Category:** implementation
- **Task:** TASK-015
- **Context:** `scripts/tag-assign.ts` に role の判定を足すとき、
  他のカテゴリと同じくキーワードルールで書こうとした
- **Mistake:** 「煮物」「炒め物」「サラダ」はどれも主菜にも副菜にもなる。
  肉じゃが（主菜）とかぼちゃの煮物（副菜）、
  コブサラダ（主菜）とポテトサラダ（副菜）を同じキーワードでは分けられない
- **Correction:** side / soup / staple / 例外の onedish は料理名の Set で明示し、
  残りは主食タグ（rice / donburi / noodle / bread）の有無から導出した
- **Root Cause:** 料理名は「何で作るか」は表すが「食卓での役割」は表さない。
  役割は名前から機械的には決まらない
- **Prevention:** 新しいタグ軸を足すときは、まず既存の料理名10件で
  キーワード判定が成立するか手で試す。反例が2件出たら明示リストにする
- **Applied:** false
