import React from "react"
import { useGroupContext } from "@/groups/group-context"
import { assertTextAnswer } from "../utils"
import { useFieldContext } from "./FieldContext"
import { Textarea } from "./Textarea"

const DEFAULT_INPUT_NAME = "answer"

export const TextField = () => {
	const { answer, stepIdx, fieldIdx, readOnly, field } = useFieldContext()
	assertTextAnswer(answer)

	const { actions, id } = useGroupContext()

	function onChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) {
		actions.send({
			type: "change-text-field",
			id,
			value: e.target.value,
			fieldIdx,
			stepIdx,
		})
	}

	const sharedProps = {
		name: DEFAULT_INPUT_NAME,
		placeholder: field.placeholder,
		onChange,
		value: answer?.response,
		readOnly: readOnly,
	}

	return (
		<div>
			{field.type === "Text" && (
				<input
					type="text"
					className="h-9 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-16 leading-copyMega"
					{...sharedProps}
				/>
			)}
			{field.type === "Big Text" && <Textarea {...sharedProps} />}
		</div>
	)
}
