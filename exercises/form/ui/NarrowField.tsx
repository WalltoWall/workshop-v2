import { CheckIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { Text } from "@/components/Text"
import { pluralize } from "@/lib/pluralize"
import type { FieldProps, FormFieldAnswer } from "../types"
import { StringArray } from "../validators"

const INPUT_NAME = "answer"

type Props = FieldProps<{
	source: FormFieldAnswer
}>

export const NarrowField = ({ source, answer, ...props }: Props) => {
	if (source.type !== "List") {
		throw new Error(
			"Narrow fields only support List field answers as a source.",
		)
	}

	if (answer && answer.type !== "Narrow") {
		throw new Error("Invalid answer data found.")
	}

	const { max = Infinity } = props.field
	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const responses = source.groups.at(0)?.responses.filter(Boolean)

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)

		const answers = StringArray.transform((s) => s.filter(Boolean)).parse(
			data.getAll(INPUT_NAME),
		)

		actions.submitFieldAnswer({
			answer: { type: "Narrow", responses: answers },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const handleChange: React.MouseEventHandler<HTMLInputElement> = (e) => {
		if (!rForm.current || props.readOnly) return e.preventDefault()

		const data = new FormData(rForm.current)
		const answers = data.getAll(INPUT_NAME)

		if (answers.length > max) {
			e.preventDefault()
			toast.error(pluralize`You can only select up to ${max} answer[|s].`)

			return
		}

		submitForm()
	}

	return (
		<form ref={rForm}>
			<ul className="flex flex-col gap-2">
				{responses?.map((response, idx) => (
					<li key={response}>
						<label className="group flex cursor-pointer select-none items-center gap-2 rounded-lg border border-gray-50 bg-gray-90 py-1.5 pl-[5px] pr-3 has-[:checked]:border-black has-[:checked]:outline has-[:checked]:outline-1 has-[:checked]:outline-offset-0 has-[:checked]:outline-black">
							<div className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-gray-50 bg-white group-has-[:checked]:border-black group-has-[:checked]:bg-black">
								<Text
									style="heading"
									size={18}
									className="uppercase text-gray-50 group-has-[:checked]:text-white"
								>
									{idx + 1}
								</Text>
							</div>

							<Text
								className="text-gray-50 group-has-[:checked]:text-black"
								size={16}
							>
								{response}
							</Text>

							<input
								type="checkbox"
								name={INPUT_NAME}
								value={response}
								className="appearance-none outline-none"
								onClick={handleChange}
								checked={answer?.responses.includes(response)}
								readOnly={props.readOnly}
							/>

							<CheckIcon className="ml-auto w-4 opacity-0 group-has-[:checked]:opacity-100" />
						</label>
					</li>
				))}
			</ul>
		</form>
	)
}
