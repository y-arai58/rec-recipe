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
      // 具だくさんサラダはそれ自体がメインになるので、ジャンルとして選べるようにする
      { label: "サラダ", tagIds: ["tag-genre-salad"] },
      { label: "なんでもいい", tagIds: [] },
    ],
  },
  {
    id: "protein",
    text: "主役の食材は？",
    options: [
      {
        label: "肉",
        tagIds: [
          "tag-protein-chicken",
          "tag-protein-pork",
          "tag-protein-beef",
          "tag-protein-mixed",
        ],
      },
      {
        label: "魚介",
        tagIds: [
          "tag-protein-salmon",
          "tag-protein-whitefish",
          "tag-protein-seafood",
          "tag-protein-shrimp",
          "tag-protein-squid",
          "tag-protein-shellfish",
        ],
      },
      {
        label: "卵・豆腐・豆",
        tagIds: ["tag-protein-egg", "tag-protein-tofu", "tag-protein-legume"],
      },
      { label: "野菜中心", tagIds: ["tag-protein-vegetable"] },
      { label: "こだわらない", tagIds: [] },
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
