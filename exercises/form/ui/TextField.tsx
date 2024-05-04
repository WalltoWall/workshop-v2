import React from "react"
import { match } from "ts-pattern"
import type { FieldProps } from "../types"
import { Textarea } from "./Textarea"

type Props = FieldProps

const DEFAULT_INPUT_NAME = "answer"

export const TextField = ({ answer, ...props }: Props) => {
	if (answer && answer.type !== "Text") {
		throw new Error("Invalid answer data found.")
	}

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		actions.submitFieldAnswer({
			answer: { type: "Text", response: e.target.value },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const sharedProps = {
		name: DEFAULT_INPUT_NAME,
		placeholder: props.field.placeholder,
		onChange,
		value: answer?.response,
		readOnly: props.readOnly,
	}

	return (
		<div>
			{match(props.field.type)
				.with("Text", () => (
					<input
						type="text"
						className="h-9 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-16 leading-copyMega"
						{...sharedProps}
					/>
				))
				.with("Big Text", () => <Textarea {...sharedProps} />)
				.otherwise(() => {
					throw new Error("Unreachable!")
				})}
		</div>
	)
}
