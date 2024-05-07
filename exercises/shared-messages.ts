import { z } from "zod"

export const GoToStep = z.object({
	type: z.literal("go-to-step"),
	value: z.number().min(1),
})
