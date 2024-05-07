import React from "react"
import type { Exercise } from "@/sanity/types.gen"
import type { FormField, FormFieldAnswer, FormStepAnswer } from "../types"
import { PositiveNumber } from "../validators"

interface FieldContextValue {
	allAnswers: FormStepAnswer[]
	allSteps: NonNullable<Exercise["form"]>["steps"]
	answer?: FormFieldAnswer
	field: FormField
	readOnly: boolean
	exerciseId: string
	stepIdx: number
	fieldIdx: number
	getFieldSource: () => FormFieldAnswer
}

const FieldContext = React.createContext<FieldContextValue>(undefined!)

interface Props extends Omit<FieldContextValue, "getFieldSource"> {
	children: React.ReactNode
}

export const FieldProvider = ({ children, ...props }: Props) => {
	const getFieldSource = () => {
		const stepSrc = PositiveNumber.parse(props.field.source?.step)
		const fieldSrc = PositiveNumber.parse(props.field.source?.field)

		const sourceStepAnswer = props.allAnswers?.at(stepSrc - 1)
		const source = sourceStepAnswer?.at(fieldSrc - 1)

		if (!source) {
			throw new Error("No valid source found. Check field or step config.")
		}

		return source
	}

	const value = { ...props, getFieldSource }

	return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}

export const useFieldContext = () => {
	const value = React.useContext(FieldContext)
	if (!value) {
		throw new Error("useFieldContext must be used within a FieldProvider.")
	}

	return value
}
