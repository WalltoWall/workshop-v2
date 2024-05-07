import { z } from "zod"

const FormField = z.object({
	id: z.string(),
	fieldIdx: z.number(),
	stepIdx: z.number(),
})
export type FormField = z.infer<typeof FormField>

export const ChangeListFieldItem = FormField.extend({
	type: z.literal("change-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddListFieldItem = FormField.extend({
	type: z.literal("add-list-field-item"),
	groupIdx: z.number(),
	label: z.string().optional(),
})

export const SetNarrowFieldItem = FormField.extend({
	type: z.literal("set-narrow-field-item"),
	value: z.string(),
})

export const ChangeTaglineFieldItem = FormField.extend({
	type: z.literal("change-tagline-field-item"),
	responseIdx: z.number(),
	value: z.string(),
})

export const AddTaglineFieldItem = FormField.extend({
	type: z.literal("add-tagline-field-item"),
})

export const ChangeTextField = FormField.extend({
	type: z.literal("change-text-field"),
	value: z.string(),
})
