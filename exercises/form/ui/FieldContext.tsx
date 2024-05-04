import React from "react"
import type { Exercise } from "@/sanity/types.gen"
import type { FormField, FormFieldAnswer, FormStepAnswer } from "../types"

interface FieldContextValue {
	allAnswers: FormStepAnswer[]
	allSteps: NonNullable<Exercise["form"]>["steps"]
	answer?: FormFieldAnswer
	field: FormField
	readOnly: boolean
	exerciseId: string
	stepIdx: number
	fieldIdx: number
}

const FieldContext = React.createContext<FieldContextValue>(undefined!)

interface Props extends FieldContextValue {
	children: React.ReactNode
}

export const FieldProvider = ({ children, ...props }: Props) => {
	return <FieldContext.Provider value={props}>{children}</FieldContext.Provider>
}

export const useFieldContext = () => {
	const value = React.useContext(FieldContext)
	if (!value) {
		throw new Error("useFieldContext must be used within a FieldProvider.")
	}

	return value
}
