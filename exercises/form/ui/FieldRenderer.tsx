import { unreachable } from "@/lib/unreachable"
import { PositiveNumber } from "../validators"
import { useFieldContext } from "./FieldContext"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
import { TaglineField } from "./TaglineField"
import { TextField } from "./TextField"

export const FieldRenderer = () => {
	const { field, allAnswers } = useFieldContext()

	// TODO: Maybe this should exist on context?
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
			return <ListField key={field.prompt} />
		}

		case "Narrow":
			return <NarrowField key={field.prompt} source={getFieldSource()} />

		case "Text":
		case "Big Text":
			return <TextField key={field.prompt} />

		case "Tagline":
			return <TaglineField key={field.prompt} source={getFieldSource()} />

		default:
			return unreachable(field.type)
	}
}
