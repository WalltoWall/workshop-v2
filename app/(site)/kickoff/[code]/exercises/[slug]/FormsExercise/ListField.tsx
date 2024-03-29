import React from "react"
import { match } from "ts-pattern"
import { Text } from "@/components/Text"
import { AddButton } from "./AddButton"
import type {
	FieldProps,
	FormField,
	FormStep,
	FormStepAnswer,
	ListFieldAnswer,
} from "./types"
import { AnswersArray, PositiveNumber } from "./validators"

const DEFAULT_INPUT_NAME = "answer"

type InputProps = {
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
	return (
		<li className="flex gap-2">
			<div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-gray-90">
				<Text style="heading" size={16}>
					{number}
				</Text>
			</div>

			<input
				type="text"
				placeholder={placeholder}
				name={name}
				className="h-9 grow rounded-lg border border-gray-90 px-2.5 text-black text-14 placeholder:text-gray-75"
				value={value}
				onChange={onChange}
				readOnly={readOnly}
			/>
		</li>
	)
}

type SourceListSectionProps = {
	label: string
	field: FormField
	answer?: ListFieldAnswer["groups"][number]
	onInputChange?: React.ChangeEventHandler<HTMLInputElement>
	readOnly?: boolean
}

const SourceListSection = (props: SourceListSectionProps) => {
	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const answerCount = props.answer?.responses.length ?? 0
	const [rows, setRows] = React.useState(Math.max(answerCount, initialRows))
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => setRows((prev) => prev + 1)

	return (
		<div>
			<Text style="heading" size={24} className="uppercase">
				{props.label}
			</Text>

			<ul className="mt-4 flex flex-col gap-2">
				{arr.map((number, idx) => {
					return (
						<Input
							key={number}
							number={number}
							placeholder={placeholder}
							value={props.answer?.responses.at(idx)}
							name={props.label}
							onChange={props.onInputChange}
							readOnly={props.readOnly}
						/>
					)
				})}
			</ul>

			{showAddButton && (
				<AddButton className="mt-2.5" onClick={appendNewRow}>
					{addButtonText}
				</AddButton>
			)}
		</div>
	)
}

type Props = FieldProps<{
	allAnswers?: FormStepAnswer[]
	allSteps?: FormStep[]
}>

const SourceListField = ({ answer, actions, ...props }: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<HTMLFormElement>(null)

	const stepSrc = PositiveNumber.parse(props.field.source?.step)
	const fieldSrc = PositiveNumber.parse(props.field.source?.field)

	const sourceAnswer = props.allAnswers?.at(stepSrc - 1)?.at(fieldSrc - 1)
	const sourceField = props.allSteps?.at(stepSrc - 1)?.fields?.at(fieldSrc - 1)

	if (!sourceAnswer || !sourceField)
		throw new Error("No valid source found. Check field or step config.")

	const labels = match(sourceAnswer)
		.with({ type: "Narrow" }, (sa) => sa.responses)
		.otherwise(() => {
			throw new Error("Invalid source answer.")
		})

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)

		actions.submitFieldAnswer({
			answer: {
				type: "List",
				groups: labels.map((label) => ({
					label,
					responses: AnswersArray.parse(data.getAll(label)),
				})),
			},
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	return (
		<form ref={rForm} className="space-y-6" onSubmit={handleSubmit}>
			{labels.map((label) => (
				<SourceListSection
					key={label}
					label={label}
					field={props.field}
					answer={answer?.groups.find((a) => a.label === label)}
					onInputChange={submitForm}
					readOnly={props.readOnly}
				/>
			))}
		</form>
	)
}

const PlainListField = ({ answer, actions, ...props }: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<React.ElementRef<"form">>(null)

	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const resolvedAnswer = answer?.groups.at(0)
	const answerCount = resolvedAnswer?.responses.length ?? 0
	const [rows, setRows] = React.useState(Math.max(answerCount, initialRows))
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)
		const answers = AnswersArray.parse(data.getAll(DEFAULT_INPUT_NAME))

		actions.submitFieldAnswer({
			answer: { type: "List", groups: [{ responses: answers }] },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	const appendNewRow = () => setRows((prev) => prev + 1)

	return (
		<form onSubmit={handleSubmit} ref={rForm}>
			<ul className="flex flex-col gap-2">
				{arr.map((number, idx) => (
					<Input
						key={number}
						number={number}
						placeholder={placeholder}
						value={resolvedAnswer?.responses.at(idx) ?? ""}
						onChange={submitForm}
						readOnly={props.readOnly}
					/>
				))}
			</ul>

			{showAddButton && !props.readOnly && (
				<AddButton onClick={appendNewRow} className="mt-2.5">
					{addButtonText}
				</AddButton>
			)}

			<input type="submit" className="hidden" />
		</form>
	)
}

export const ListField = (props: Props) => {
	return (
		<>
			{props.field.source?.field && props.field.source.step ? (
				<SourceListField {...props} />
			) : (
				<PlainListField {...props} />
			)}
		</>
	)
}
