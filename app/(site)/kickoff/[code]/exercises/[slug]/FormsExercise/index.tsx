"use client"

import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { InvalidField } from "./InvalidField"

interface Props {
	exercise: ST.Exercise
	participant: ST.Participant
	groupSlug?: string
}

export const FormExercise = ({ exercise, participant, groupSlug }: Props) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const params = useParams()

	const step = Number.parseInt(searchParams.get("step") ?? "1")
	const stepIdx = step - 1

	if (!exercise.form || !exercise.form.steps) {
		throw new Error("No form exercise data found.")
	}

	const stepData = exercise.form.steps.at(stepIdx)

	// const answers = snap.participants[participantOrGroupId] ?? []
	// const stepAnswers = answers.at(stepIdx)

	// const onReviewScreen = !stepData && stepIdx === exercise.form.steps.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	// const role = groupSlug
	// 	? snap.groups?.[groupSlug]?.[participant._id]
	// 	: undefined

	// const groupCount = exercise.groups?.length ?? 0

	return (
		<div className="mt-3 flex flex-[1_1_0] flex-col justify-between">
			<ErrorBoundary fallback={<InvalidField className="my-6" />}>
				{/* onReviewScreen && (
					<Review allAnswers={answers} exercise={exercise} actions={actions} />
				)*/}

				{/* !onReviewScreen && (
					<div>
						{stepData?.fields?.map((field, fieldIdx) => {
							const fieldAnswer = stepAnswers?.at(fieldIdx)

							return (
								<FieldContainer key={field._key}>
									{field.type !== "Tagline" && (
										<Prompt
											className="mb-5"
											num={
												stepData.fields!.length > 1 ? fieldIdx + 1 : undefined
											}
											additionalText={field.additionalText}
										>
											{field.prompt}
										</Prompt>
									)}

									<FieldRenderer
										exercise={exercise}
										field={field}
										stepIdx={stepIdx}
										fieldIdx={fieldIdx}
										allAnswers={answers}
										answer={fieldAnswer}
										actions={actions}
										readOnly={groupCount > 0 && role !== "captain"}
									/>
								</FieldContainer>
							)
						})}
					</div>
				)*/}
			</ErrorBoundary>

			<Steps
				steps={exercise.form.steps.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
				className="mt-auto"
			/>
		</div>
	)
}
