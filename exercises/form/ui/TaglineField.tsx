import React from "react"
import clsx from "clsx"
import type { FieldProps, FormFieldAnswer } from "../types"
import { getBadWords, getTaglineVariant, sanitizeString } from "../utils"
import { AddButton } from "./AddButton"
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
	...props
}: HighlighterTextareaProps) => {
	const words = props.value.split(" ")

	return (
		<div className={clsx(className, "relative flex rounded-lg")}>
			<Textarea className="text-black/0 caret-black" {...props} />

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

type Props = FieldProps<{
	source: FormFieldAnswer
}>

export const TaglineField = ({ source, answer, actions, ...props }: Props) => {
	if (source.type !== "List") {
		throw new Error(
			"Tagline fields only support List field answers as a source.",
		)
	}

	if (answer && answer.type !== "Tagline") {
		throw new Error("Invalid answer data found.")
	}

	const variant = getTaglineVariant(props.field.color ?? "red")

	const answerOne = answer?.responses.at(0) ?? ""
	const answerTwo = answer?.responses.at(1)

	const handleChange = (answerOne: string, answerTwo?: string) => {
		const answers = [answerOne]
		if (typeof answerTwo === "string") answers.push(answerTwo)

		actions.submitFieldAnswer({
			answer: { type: "Tagline", responses: answers },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const sourceResponses = source.groups.at(0)?.responses.filter(Boolean) ?? []
	const badWords = getBadWords(sourceResponses)

	const sharedInputProps = {
		className: "mt-5",
		name: INPUT_NAME,
		readOnly: props.readOnly,
		badWords,
		placeholder: props.field.placeholder,
	}

	// TODO: The children type of <Prompt> only accepts strings, not React
	// nodes. This is usually fine, but since we have an expression here things
	// kind of break. Just need to not be lazy and change the prompt field in
	// the CMS to be a rich text field.
	const prompt = `Your brand in ${sourceResponses.length.toString()} words.`

	return (
		<div>
			<Prompt num={props.fieldIdx + 1}>{prompt}</Prompt>

			<HighlightedResponses
				responses={sourceResponses}
				answers={[answerOne, answerTwo]}
				invalidClassName={variant.invalidBgCn}
				className="mt-5"
			/>

			<Prompt
				className="mt-8"
				num={props.fieldIdx + 2}
				additionalText={props.field.additionalText}
			>
				{props.field.prompt}
			</Prompt>

			<HighlighterTextarea
				value={answerOne}
				onChange={(e) => handleChange(e.currentTarget.value, answerTwo)}
				invalidClassName={variant.invalidTextCn}
				{...sharedInputProps}
			/>

			{typeof answerTwo === "undefined" && !props.readOnly && (
				<AddButton
					className="mt-2.5"
					onClick={() => handleChange(answerOne, "")}
				>
					Add another response
				</AddButton>
			)}

			{typeof answerTwo !== "undefined" && (
				<HighlighterTextarea
					value={answerTwo}
					onChange={(e) => handleChange(answerOne, e.currentTarget.value)}
					invalidClassName={variant.invalidTextCn}
					{...sharedInputProps}
				/>
			)}
		</div>
	)
}
