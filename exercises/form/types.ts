import type * as ST from "@/sanity/types.gen"

export type FormAnswer = {
	type: "form"
	step: number
	data: Record<string, Array<FormStepAnswer>>
}

export type FormStep = NonNullable<
	NonNullable<ST.Exercise["form"]>["steps"]
>[number]

export type FormField = NonNullable<FormStep["fields"]>[number]

export type ListFieldAnswer = {
	type: "List"
	groups: Array<{
		label?: string
		responses: string[]
	}>
}

export type TextFieldAnswer = {
	type: "Text"
	response: string
}

export type NarrowFieldAnswer = {
	type: "Narrow"
	responses: string[]
}

export type TaglineFieldAnswer = {
	type: "Tagline"
	responses: string[]
}

export type FormFieldAnswer =
	| ListFieldAnswer
	| TextFieldAnswer
	| NarrowFieldAnswer
	| TaglineFieldAnswer

export type FormStepAnswer = Array<FormFieldAnswer>

export type SharedFieldProps = {}

export type FieldProps<T = unknown> = T & SharedFieldProps
