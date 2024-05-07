import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import type { FormStepAnswer } from "@/exercises/form/types"
import { FieldContainer } from "./FieldContainer"
import { FieldProvider } from "./FieldContext"
import { FieldRenderer } from "./FieldRenderer"
import { Prompt } from "./Prompt"

interface Props {
	allAnswers?: FormStepAnswer[]
	exercise: ST.Exercise
}

export const Review = ({ allAnswers = [], exercise }: Props) => {
	const steps = exercise.form?.steps ?? []

	return (
		<div>
			<Text
				style="heading"
				size={18}
				className="mt-6 rounded-2xl bg-gray-97 px-8 py-6 text-center"
			>
				Please, finalize your answers
			</Text>

			{steps.map((step, stepIdx) =>
				step.fields?.map((field, fieldIdx) => {
					const stepAnswer = allAnswers.at(stepIdx)
					const fieldAnswer = stepAnswer?.at(fieldIdx)
					const hasMultipleFields = step.fields!.length > 1

					return (
						<FieldProvider
							key={field.prompt}
							fieldIdx={fieldIdx}
							stepIdx={stepIdx}
							readOnly
							field={field}
							answer={fieldAnswer}
							exerciseId={exercise._id}
							allAnswers={allAnswers}
							allSteps={steps}
						>
							<FieldContainer>
								{field.type !== "Tagline" && (
									<Prompt
										className="mb-5"
										num={hasMultipleFields ? stepIdx + fieldIdx + 1 : undefined}
										additionalText={field.additionalText}
									>
										{field.prompt}
									</Prompt>
								)}

								<FieldRenderer />
							</FieldContainer>
						</FieldProvider>
					)
				}),
			)}
		</div>
	)
}
