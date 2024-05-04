import { z } from "zod"

export const ChangeListFieldItemMessage = z.object({
	type: z.literal("change-list-field-item"),
	fieldIdx: z.number(),
	stepIdx: z.number(),
	groupIdx: z.number(),
	label: z.string().optional(),
	responseIdx: z.number(),
	value: z.string(),
})
export type ChangeListFieldItemMessage = z.infer<
	typeof ChangeListFieldItemMessage
>

export const AddListFieldItemMessage = z.object({
	type: z.literal("add-list-field-item"),
	fieldIdx: z.number(),
	stepIdx: z.number(),
	groupIdx: z.number(),
	label: z.string().optional(),
})
export type AddListFieldItemMessage = z.infer<typeof AddListFieldItemMessage>
