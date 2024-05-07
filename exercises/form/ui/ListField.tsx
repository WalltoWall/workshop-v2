import React from "react"
import * as R from "remeda"
import { match } from "ts-pattern"
import { Text } from "@/components/Text"
import { useGroupContext } from "@/groups/group-context"
import { useRememberCursorPosition } from "../hooks"
import type { ListFieldAnswer } from "../types"
import { assertListAnswer } from "../utils"
import { PositiveNumber } from "../validators"
import { AddButton } from "./AddButton"
import { useFieldContext } from "./FieldContext"

const DEFAULT_INPUT_NAME = "answer"

interface InputProps {
	number: number
	placeholder?: string
	value?: string
	onChange?: React.ChangeEventHandler<HTMLInputElement>
	name?: string
	readOnly?: boolean
}

const Input = ({
	number,
	placeholder,
	value,
	onChange,
	name = DEFAULT_INPUT_NAME,
	readOnly = false,
}: InputProps) => {
	const { ref: rInput, onChange: wrappedOnChange } = useRememberCursorPosition({
		onChange,
		value,
	})

	return (
		<li className="flex gap-2">
			<div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-gray-90">
				<Text style="heading" size={16}>
					{number}
				</Text>
			</div>

			<input
				ref={rInput as React.RefObject<HTMLInputElement>}
				type="text"
				placeholder={placeholder}
				name={name}
				className="h-9 grow rounded-lg border border-gray-90 px-2.5 text-black text-16 placeholder:text-gray-75"
				value={value}
				onChange={wrappedOnChange}
				readOnly={readOnly}
			/>
		</li>
	)
}

interface SourceListSectionProps {
	label: string
	groupIdx: number
	groupAnswer?: ListFieldAnswer["groups"][number]
}

const SourceListSection = ({
	label,
	groupIdx,
	groupAnswer,
}: SourceListSectionProps) => {
	const { field, answer, readOnly, stepIdx, fieldIdx } = useFieldContext()
	assertListAnswer(answer)

	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = field

	const answerCount = groupAnswer?.responses.length ?? 0
	const rows = Math.max(answerCount, initialRows)

	const { actions } = useGroupContext()

	const submitAnswer = (value: string, responseIdx: number) => {
		if (readOnly) return

		actions.send({
			type: "change-list-field-item",
			label,
			value,
			stepIdx,
			fieldIdx,
			responseIdx,
			groupIdx,
		})
	}

	const appendNewRow = () => {
		if (readOnly) return

		actions.send({
			type: "add-list-field-item",
			label,
			groupIdx,
			fieldIdx,
			stepIdx,
		})
	}

	return (
		<div>
			<Text style="heading" size={24} className="uppercase">
				{label}
			</Text>

			<ul className="mt-4 flex flex-col gap-2">
				{R.range(0, rows).map((idx) => (
					<Input
						key={idx}
						number={idx + 1}
						placeholder={placeholder}
						value={groupAnswer?.responses.at(idx) ?? ""}
						name={label}
						onChange={(e) => submitAnswer(e.target.value, idx)}
						readOnly={readOnly}
					/>
				))}
			</ul>

			{showAddButton && (
				<AddButton className="mt-2.5" onClick={appendNewRow}>
					{addButtonText}
				</AddButton>
			)}
		</div>
	)
}

const SourceListField = () => {
	const { answer, allSteps, allAnswers, field } = useFieldContext()
	assertListAnswer(answer)

	const stepSrc = PositiveNumber.parse(field.source?.step)
	const fieldSrc = PositiveNumber.parse(field.source?.field)

	const sourceAnswer = allAnswers?.at(stepSrc - 1)?.at(fieldSrc - 1)
	const sourceField = allSteps?.at(stepSrc - 1)?.fields?.at(fieldSrc - 1)

	if (!sourceAnswer || !sourceField) {
		throw new Error("No valid source found. Check field or step config.")
	}

	const labels = match(sourceAnswer)
		.with({ type: "Narrow" }, (sa) => sa.responses)
		.otherwise(() => {
			throw new Error("Invalid source answer.")
		})

	return (
		<div className="flex flex-col gap-6">
			{labels.map((label, idx) => (
				<SourceListSection
					key={label}
					label={label}
					groupAnswer={answer?.groups.find((a) => a.label === label)}
					groupIdx={idx}
				/>
			))}
		</div>
	)
}

const PlainListField = () => {
	const { answer } = useFieldContext()
	assertListAnswer(answer)

	const { actions, id } = useGroupContext()
	const { field, stepIdx, fieldIdx, readOnly } = useFieldContext()

	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = field

	const resolvedAnswer = answer?.groups.at(0)
	const answerCount = resolvedAnswer?.responses.length ?? 0
	const rows = Math.max(answerCount, initialRows)

	const submitAnswer = (value: string, idx: number) => {
		if (readOnly) return

		actions.send({
			type: "change-list-field-item",
			id,
			stepIdx,
			fieldIdx,
			groupIdx: 0,
			responseIdx: idx,
			value,
		})
	}

	const appendNewRow = () => {
		if (readOnly) return

		actions.send({
			type: "add-list-field-item",
			id,
			fieldIdx,
			stepIdx,
			groupIdx: 0,
		})
	}

	return (
		<div>
			<ul className="flex flex-col gap-2">
				{R.range(0, rows).map((idx) => (
					<Input
						key={idx}
						number={idx + 1}
						placeholder={placeholder}
						value={resolvedAnswer?.responses.at(idx) ?? ""}
						onChange={(e) => submitAnswer(e.target.value, idx)}
						readOnly={readOnly}
					/>
				))}
			</ul>

			{showAddButton && !readOnly && (
				<AddButton
					onClick={appendNewRow}
					className="mt-2.5"
					disabled={answerCount < initialRows}
				>
					{addButtonText}
				</AddButton>
			)}

			<input type="submit" className="hidden" />
		</div>
	)
}

export const ListField = () => {
	const { field } = useFieldContext()

	if (field.source?.field && field.source.step) {
		return <SourceListField />
	}

	return <PlainListField />
}
