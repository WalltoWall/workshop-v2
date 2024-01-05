import type { ST } from "@/sanity/config"

export type ListFieldAnswer = {
	type: "List"
	responses: string[]
}

export type TextFieldAnswer = {
	type: "Text"
	response: string
}

export type NarrowFieldAnswer = {
	type: "Narrow"
	responses: string[]
}

export type FormFieldAnswer =
	| ListFieldAnswer
	| TextFieldAnswer
	| NarrowFieldAnswer

export type FormAnswer = {
	data: Array<FormFieldAnswer>
}

export type FormStep = NonNullable<
	NonNullable<ST["exercise"]["form"]>["steps"]
>[number]

export type FormField = NonNullable<FormStep["fields"]>[number]

// TODO: Create a shared type for the mapped exercise ids.
export type FormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			steps: Array<FormAnswer>
		}
	}
}

export type SharedFieldProps = {
	answer?: FormFieldAnswer
	exerciseId: string
	stepIdx: number
	fieldIdx: number
	field: FormField
}

export type FieldProps<T = unknown> = T & SharedFieldProps
