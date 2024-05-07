import React from "react"
import clsx from "clsx"
import { useGroupContext } from "@/groups/group-context"
import {
	assertListSource,
	assertTaglineAnswer,
	getBadWords,
	getTaglineVariant,
	sanitizeString,
} from "../utils"
import { AddButton } from "./AddButton"
import { useFieldContext } from "./FieldContext"
import { HighlightedResponses } from "./HighlightedResponses"
import { Prompt } from "./Prompt"
import { Textarea, textareaStyles } from "./Textarea"

const INPUT_NAME = "answer"

interface HighlighterTextareaProps
	extends Omit<React.ComponentPropsWithoutRef<"textarea">, "value"> {
	value: string
	badWords: Set<string>
	invalidClassName?: string
}

const HighlighterTextarea = ({
	className,
	badWords,
	invalidClassName = "text-red-63",
	value = "",
	...props
}: HighlighterTextareaProps) => {
	const words = value.split(" ")

	return (
		<div className={clsx(className, "relative flex rounded-lg")}>
			<Textarea className="text-black/0 caret-black" value={value} {...props} />

			<div
				className={clsx(
					textareaStyles,
					"pointer-events-none absolute inset-0 whitespace-pre-wrap border-gray-90/0",
				)}
			>
				{words.map((_word, idx) => {
					const word = sanitizeString(_word)
					const invalid = badWords.has(word)

					return (
						<span
							key={_word + idx}
							className={clsx(invalid && invalidClassName)}
						>
							{_word + (idx === words.length - 1 ? "" : " ")}
						</span>
					)
				})}
			</div>
		</div>
	)
}

export const TaglineField = () => {
	const { getFieldSource, answer, field, readOnly, fieldIdx, stepIdx } =
		useFieldContext()
	const { actions } = useGroupContext()

	const source = getFieldSource()

	assertTaglineAnswer(answer)
	assertListSource(source)

	const variant = getTaglineVariant(field.color ?? "red")

	const [answerOne, answerTwo] = answer?.responses ?? []

	const handleChange = (value: string, idx: number) => {
		actions.send({
			type: "change-tagline-field-item",
			value,
			responseIdx: idx,
			fieldIdx,
			stepIdx,
		})
	}

	const addResponse = () => {
		actions.send({
			type: "add-tagline-field-item",
			stepIdx,
			fieldIdx,
		})
	}

	const sourceResponses = source.groups.at(0)?.responses.filter(Boolean) ?? []
	const badWords = getBadWords(sourceResponses)

	const sharedInputProps = {
		className: "mt-5",
		name: INPUT_NAME,
		readOnly,
		badWords,
		placeholder: field.placeholder,
	}

	// TODO: The children type of <Prompt> only accepts strings, not React
	// nodes. This is usually fine, but since we have an expression here things
	// kind of break. Just need to not be lazy and change the prompt field in
	// the CMS to be a rich text field.
	const prompt = `Your brand in ${sourceResponses.length.toString()} words.`

	return (
		<div>
			<Prompt num={fieldIdx + 1}>{prompt}</Prompt>

			<HighlightedResponses
				responses={sourceResponses}
				answers={[answerOne, answerTwo]}
				invalidClassName={variant.invalidBgCn}
				className="mt-5"
			/>

			<Prompt
				className="mt-8"
				num={fieldIdx + 2}
				additionalText={field.additionalText}
			>
				{field.prompt}
			</Prompt>

			<HighlighterTextarea
				value={answerOne ?? ""}
				onChange={(e) => handleChange(e.currentTarget.value, 0)}
				invalidClassName={variant.invalidTextCn}
				{...sharedInputProps}
			/>

			{answerTwo === undefined && !readOnly && (
				<AddButton className="mt-2.5" onClick={addResponse}>
					Add another response
				</AddButton>
			)}

			{answerTwo !== undefined && (
				<HighlighterTextarea
					value={answerTwo}
					onChange={(e) => handleChange(e.currentTarget.value, 1)}
					invalidClassName={variant.invalidTextCn}
					{...sharedInputProps}
				/>
			)}
		</div>
	)
}
