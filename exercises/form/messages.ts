import { z } from "zod"

const BaseFormMessage = z.object({
	id: z.string(),
	fieldIdx: z.number(),
	stepIdx: z.number(),
})
export type BaseFormMessage = z.infer<typeof BaseFormMessage>

export const ChangeListFieldItem = BaseFormMessage.extend({
	type: z.literal("change-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddListFieldItem = BaseFormMessage.extend({
	type: z.literal("add-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
})

export const SetNarrowFieldItem = BaseFormMessage.extend({
	type: z.literal("set-narrow-field-item"),
	value: z.string(),
})

export const ChangeTaglineFieldItem = BaseFormMessage.extend({
	type: z.literal("change-tagline-field-item"),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddTaglineFieldItem = BaseFormMessage.extend({
	type: z.literal("add-tagline-field-item"),
})

export const ChangeTextField = BaseFormMessage.extend({
	type: z.literal("change-text-field"),
	value: z.string(),
})
