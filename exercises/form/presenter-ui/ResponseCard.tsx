"use client"

import React from "react"
import { match } from "ts-pattern"
import type { FormField, FormFieldAnswer, FormStepAnswer } from "../types"
import { ListResponseCard } from "./ListResponseCard"
import { NarrowResponseCard } from "./NarrowResponseCard"
import { TaglineResponseCard } from "./TaglineResponseCard"
import { TextResponseCard } from "./TextResponseCard"

export interface ResponseCardProps<
	T extends FormFieldAnswer = FormFieldAnswer,
> {
	answer: T
	stepAnswers: FormStepAnswer[]
	name: string
	field: FormField
	questionNumber: number
	isGroupExercise: boolean
}

export const ResponseCard = (props: ResponseCardProps) => {
	return match(props.answer)
		.with({ type: "List" }, (answer) => (
			<ListResponseCard {...props} answer={answer} />
		))
		.with({ type: "Narrow" }, (answer) => (
			<NarrowResponseCard {...props} answer={answer} />
		))
		.with({ type: "Text" }, (answer) => (
			<TextResponseCard {...props} answer={answer} />
		))
		.with({ type: "Tagline" }, (answer) => (
			<TaglineResponseCard {...props} answer={answer} />
		))
		.exhaustive()
}
