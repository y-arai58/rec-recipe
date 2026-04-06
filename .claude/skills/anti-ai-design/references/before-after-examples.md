# Anti-AI Design: Before / After Examples

## Example 1: Dashboard Stats

### ❌ Before (AI-typical)
```tsx
<div className="grid grid-cols-4 gap-4">
  <Card className="p-4">
    <p className="text-sm text-gray-500">売上</p>
    <p className="text-2xl font-bold">¥1,234,567</p>
  </Card>
  <Card className="p-4">
    <p className="text-sm text-gray-500">注文数</p>
    <p className="text-2xl font-bold">1,234</p>
  </Card>
  <Card className="p-4">
    <p className="text-sm text-gray-500">顧客数</p>
    <p className="text-2xl font-bold">567</p>
  </Card>
  <Card className="p-4">
    <p className="text-sm text-gray-500">平均単価</p>
    <p className="text-2xl font-bold">¥1,000</p>
  </Card>
</div>
```
問題: 4つのカードが同じサイズ・同じ重み。主役がない。テンプレ的。

### ✅ After (Anti-AI)
```tsx
<div className="space-y-6">
  {/* 主役: 最も重要なKPI */}
  <Card className="p-8 border-l-4 border-l-primary">
    <p className="text-sm text-muted-foreground">今月の売上</p>
    <p className="text-4xl font-bold tracking-tight">¥1,234,567</p>
    <p className="text-sm text-success mt-1">前月比 +12.3%</p>
  </Card>

  {/* 補助: 2列で控えめに */}
  <div className="grid grid-cols-3 gap-3">
    <div className="p-4">
      <p className="text-xs text-muted-foreground">注文数</p>
      <p className="text-lg font-medium">1,234</p>
    </div>
    <div className="p-4">
      <p className="text-xs text-muted-foreground">顧客数</p>
      <p className="text-lg font-medium">567</p>
    </div>
    <div className="p-4">
      <p className="text-xs text-muted-foreground">平均単価</p>
      <p className="text-lg font-medium">¥1,000</p>
    </div>
  </div>
</div>
```
改善: 売上が主役（大きく、ボーダー付き）。補助は控えめ。視線フローが明確。

---

## Example 2: Empty State

### ❌ Before
```tsx
{data.length === 0 && <p>データがありません</p>}
```

### ✅ After
```tsx
{data.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="rounded-full bg-muted p-4 mb-4">
      <InboxIcon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium">まだデータがありません</h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
      最初のデータを追加すると、ここに表示されます
    </p>
    <Button className="mt-4" variant="outline">
      データを追加する
    </Button>
  </div>
)}
```

---

## Example 3: Long Text Handling

### ❌ Before
```tsx
<td>{user.name}</td>
<td>{user.email}</td>
<td>{user.company}</td>
```
問題: 長いテキストでテーブルが崩壊する

### ✅ After
```tsx
<td className="max-w-[200px]">
  <span className="truncate block" title={user.name}>
    {user.name}
  </span>
</td>
<td className="max-w-[240px]">
  <span className="truncate block" title={user.email}>
    {user.email}
  </span>
</td>
<td className="max-w-[180px]">
  <span className="truncate block" title={user.company}>
    {user.company || <span className="text-muted-foreground">—</span>}
  </span>
</td>
```

---

## Example 4: Color Roles

### ❌ Before (同じ青が複数の意味)
```tsx
<Badge className="bg-blue-500">新規</Badge>        {/* ステータス */}
<Button className="bg-blue-500">保存</Button>       {/* CTA */}
<a className="text-blue-500">詳細を見る</a>          {/* リンク */}
```

### ✅ After (色=役割)
```tsx
<Badge variant="secondary">新規</Badge>              {/* 状態: secondary */}
<Button variant="default">保存</Button>              {/* CTA: primary */}
<a className="text-primary underline-offset-4 hover:underline">詳細を見る</a>
```

---

## Quick Checklist (コミット前に確認)

```
□ 画面の主役は1つか？（最も大きく、最も濃い要素はどれ？）
□ 全要素が同じサイズ・余白で並んでいないか？
□ Card を3列以上均等に並べていないか？
□ 色は4種以下に収まっているか？（primary, muted, success, destructive）
□ EmptyState は設計されているか？
□ テキストが2倍の長さになっても崩れないか？
□ 数値が ¥1 でも ¥9,999,999 でも収まるか？
□ 最後に「なくても困らない要素」を1つ以上削ったか？
```
