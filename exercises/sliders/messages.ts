import { z } from "zod"

const BaseSliderMessage = z.object({
	id: z.string(),
	stepIdx: z.number(),
})

export const UpdateSlider = BaseSliderMessage.extend({
	type: z.literal("update-slider"),
	value: z.number(),
	pairType: z.union([z.literal("today"), z.literal("tomorrow")]),
})
