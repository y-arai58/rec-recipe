デザインシステムの生成・拡張を実行する。

$ARGUMENTS の内容に応じて動作を変える:

- 引数なし: /design-system スキルと同等のフル構築フロー
- コンポーネント名: そのコンポーネントのみ生成（/component-add と同等）
- "tokens": トークンの再定義・更新のみ
- "sync": Figma同期（/figma-sync to-figma と同等）

例:

- `/ds-gen` → フルDS構築
- `/ds-gen Button` → Buttonコンポーネント追加
- `/ds-gen tokens` → トークン更新
- `/ds-gen sync` → Figma同期

Anti-AIデザイン原則を必ず適用すること:

- テンプレ的な見た目を避ける
- 色の役割を明確に分ける
- 実データで破綻しないか確認
- 最後に不要な装飾を削る
