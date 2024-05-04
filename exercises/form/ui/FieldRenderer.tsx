import { unreachable } from "@/lib/unreachable"
import type * as ST from "@/sanity/types.gen"
import type {
	FormField,
	FormFieldAnswer,
	FormStepAnswer,
	SharedFieldProps,
} from "../types"
import { PositiveNumber } from "../validators"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
import { TaglineField } from "./TaglineField"
import { TextField } from "./TextField"

type Props = {
	field: FormField
	answer?: FormFieldAnswer
	exercise: ST.Exercise
	stepIdx: number
	fieldIdx: number
	allAnswers?: FormStepAnswer[]
	readOnly?: boolean
}

export const FieldRenderer = ({
	field,
	answer,
	exercise,
	stepIdx,
	fieldIdx,
	allAnswers,
	readOnly = false,
}: Props) => {
	const sharedProps: SharedFieldProps = {
		exerciseId: exercise._id,
		fieldIdx,
		stepIdx,
		answer,
		field,
		readOnly,
	}

	function getFieldSource() {
		const stepSrc = PositiveNumber.parse(field.source?.step)
		const fieldSrc = PositiveNumber.parse(field.source?.field)

		const sourceStepAnswer = allAnswers?.at(stepSrc - 1)
		const source = sourceStepAnswer?.at(fieldSrc - 1)

		if (!source)
			throw new Error("No valid source found. Check field or step config.")

		return source
	}

	switch (field.type) {
		case "List": {
			return (
				<ListField
					key={field.prompt}
					allAnswers={allAnswers}
					allSteps={exercise.form?.steps}
					{...sharedProps}
				/>
			)
		}

		case "Narrow":
			return (
				<NarrowField
					key={field.prompt}
					source={getFieldSource()}
					{...sharedProps}
				/>
			)

		case "Text":
		case "Big Text":
			return <TextField key={field.prompt} {...sharedProps} />

		case "Tagline":
			return (
				<TaglineField
					key={field.prompt}
					source={getFieldSource()}
					{...sharedProps}
				/>
			)

		default:
			return unreachable(field.type)
	}
}
