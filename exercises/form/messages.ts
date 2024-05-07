import { z } from "zod"

const FormFieldItem = z.object({
	fieldIdx: z.number(),
	stepIdx: z.number(),
})

export const ChangeListFieldItem = FormFieldItem.extend({
	type: z.literal("change-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddListFieldItem = FormFieldItem.extend({
	type: z.literal("add-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
})

export const AddNarrowFieldItem = FormFieldItem.extend({
	type: z.literal("add-narrow-field-item"),
	value: z.string(),
})

export const ChangeTaglineFieldItem = FormFieldItem.extend({
	type: z.literal("change-tagline-field-item"),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddTaglineFieldItem = FormFieldItem.extend({
	type: z.literal("add-tagline-field-item"),
})
