# Review Checklist Sheet

## Code Review

### 🔴 Security (Critical)
```
□ XSS: dangerouslySetInnerHTML の使用箇所
□ CSRF: API Route の認証・トークンチェック
□ SQLi: Prisma raw query の使用箇所
□ Auth bypass: middleware の抜け穴
□ Secrets: 環境変数のハードコード
□ Type safety: as any の乱用
```

### 🟠 Quality (High)
```
□ Design tokens: ハードコード色値・サイズがないか
□ Error handling: try-catch, エラー境界
□ Performance: 不要な 'use client', useEffect 依存配列, N+1
□ Accessibility: aria-label, role, label紐づけ, キーボード操作
□ Tests: 主要ロジックのテストがあるか
□ Server/Client: 適切に分離されているか
```

### 🏗️ Architecture
```
□ CQRS: features/ 外から features/ をimportしていないか
□ Domain purity: domain/models/ にUI都合のコードがないか
□ Repository: Prisma 直接呼び出しが features/ を通っているか
□ Server Action: 'use server' + Zod バリデーション
□ Data flow: Read=ServerComponent→Repo, Write=Action→Zod→Repo
```

## 🎨 Anti-AI Design Review
```
□ 主役が明確（1画面1主役）
□ メリハリがある（サイズ・色・余白の差）
□ テンプレ感がない（業務固有の設計）
□ 色の役割が分離（primary=CTA, destructive=危険, muted=補助）
□ 同一色に複数意味がない
□ 実データ耐性:
  □ テキスト3行以上で崩れない
  □ データ0件でEmptyState表示
  □ 数値1桁〜6桁で収まる
  □ null/undefined でクラッシュしない
□ 装飾が最小限（削れるものを削ったか）
```

## Verdict Template
```markdown
## Review: {対象}

### Summary
{1-2文の総評}

### 🔴 Critical Issues
{なければ "None"}
**[C1]** `file:line` — {問題} → Fix: {修正方法}

### 🟠 High Priority
**[H1]** `file:line` — {問題} → Fix: {修正方法}

### 🟡 Medium
**[M1]** {問題} → Suggestion: {提案}

### 🟢 Nit
- {指摘}

### ✨ Good Points
- {具体的に良い点}

### 🎨 Anti-AI Design
{チェック結果}

### 🏗️ Architecture
{CQRS/domain チェック結果}

### Verdict
🟢 Approve | 🟡 Approve with comments | 🔴 Request changes
```
