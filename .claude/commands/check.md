TypeScript コンパイルと Biome を素早く確認する。

```bash
npx tsc --noEmit
npx biome check .
```

エラーがあれば修正方法を提案。なければ「✅ All checks passed」。
