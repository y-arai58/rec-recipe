import { z } from "zod"

export const RecommendInputSchema = z.object({
  selectedTagIds: z.array(z.string()).min(0).max(20),
})

export type RecommendInput = z.infer<typeof RecommendInputSchema>
