export type QuestionOption = {
  label: string
  tagIds: string[] // 空配列 = このカテゴリでフィルタしない
}

export type Question = {
  id: string
  text: string
  options: QuestionOption[]
}

export const QUESTIONS: Question[] = [
  {
    id: "volume",
    text: "今日の気分は？",
    options: [
      { label: "ガッツリ食べたい", tagIds: ["tag-volume-hearty"] },
      { label: "さっぱりしたい", tagIds: ["tag-volume-light", "tag-season-refreshing"] },
      { label: "どちらでも", tagIds: [] },
    ],
  },
  {
    id: "genre",
    text: "何系が食べたい？",
    options: [
      { label: "和食", tagIds: ["tag-genre-japanese"] },
      { label: "中華", tagIds: ["tag-genre-chinese"] },
      { label: "洋食・イタリアン", tagIds: ["tag-genre-western", "tag-genre-italian"] },
      { label: "なんでもいい", tagIds: [] },
    ],
  },
  {
    id: "base",
    text: "主食は？",
    options: [
      { label: "ご飯もの", tagIds: ["tag-base-rice", "tag-base-donburi"] },
      { label: "麺類", tagIds: ["tag-base-noodle"] },
      { label: "パン", tagIds: ["tag-base-bread"] },
      { label: "こだわらない", tagIds: [] },
    ],
  },
  {
    id: "cookTime",
    text: "調理時間は？",
    options: [
      { label: "短め（15分以内）", tagIds: ["tag-cooktime-under15"] },
      { label: "普通（30分くらい）", tagIds: ["tag-cooktime-under30"] },
      { label: "じっくり作りたい", tagIds: ["tag-cooktime-under60", "tag-cooktime-over60"] },
    ],
  },
]
