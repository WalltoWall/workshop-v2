import { CheckIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { Text } from "@/components/Text"
import { pluralize } from "@/lib/pluralize"
import { useGroupContext } from "@/groups/group-context"
import { assertListSource, assertNarrowAnswer } from "../utils"
import { useFieldContext } from "./FieldContext"

const INPUT_NAME = "answer"

export const NarrowField = () => {
	const { getFieldSource, answer, field, readOnly, fieldIdx, stepIdx } =
		useFieldContext()
	const { actions } = useGroupContext()

	const source = getFieldSource()

	assertListSource(source)
	assertNarrowAnswer(answer)

	const { max = Infinity } = field
	const responses = source.groups.at(0)?.responses.filter(Boolean) ?? []
	const answers = answer?.responses ?? []

	const handleChange: React.MouseEventHandler<HTMLInputElement> = (e) => {
		if (readOnly) return

		if (answers.length > max) {
			e.preventDefault()

			const msg = pluralize`You can only select up to ${max} answer[|s].`
			return toast.error(msg)
		}

		actions.send({
			type: "add-narrow-field-item",
			value: e.currentTarget.value,
			fieldIdx,
			stepIdx,
		})
	}

	return (
		<div>
			<ul className="flex flex-col gap-2">
				{responses.map((response, idx) => (
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
								checked={answer?.responses.includes(response) ?? false}
								readOnly={readOnly}
							/>

							<CheckIcon className="ml-auto w-4 opacity-0 group-has-[:checked]:opacity-100" />
						</label>
					</li>
				))}
			</ul>
		</div>
	)
}
