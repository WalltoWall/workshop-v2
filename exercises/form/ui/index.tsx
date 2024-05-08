"use client"

import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useParams, useRouter } from "next/navigation"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import { assertFormAnswer } from "../utils"
import { FieldContainer } from "./FieldContainer"
import { FieldProvider } from "./FieldContext"
import { FieldRenderer } from "./FieldRenderer"
import { InvalidField } from "./InvalidField"
import { Prompt } from "./Prompt"
import { Review } from "./Review"

interface Props {
	exercise: ST.Exercise
	participant: NonNullable<ST.ParticipantQueryResult>
	groupSlug?: string
}

export const FormExercise = ({ exercise, participant, groupSlug }: Props) => {
	const params = useParams()
	const router = useRouter()
	const { answer, role } = useGroupContext()
	assertFormAnswer(answer)

	if (!exercise.form || !exercise.form.steps) {
		throw new Error("Invalid exercise found. Check form configuration!")
	}

	const isGroupExercise = Boolean(exercise.groups && exercise.groups.length > 0)

	const step = answer.step
	const stepIdx = step - 1

	const id = groupSlug ?? participant._id

	const allSteps = exercise.form.steps
	const allAnswers = answer.data[id] ?? []

	const stepData = allSteps.at(stepIdx)
	const stepAnswer = allAnswers.at(stepIdx)

	const onReviewScreen = stepIdx === allSteps.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="flex flex-[1_1_0] flex-col justify-between">
			<ErrorBoundary fallback={<InvalidField className="my-6" />}>
				{onReviewScreen && (
					<Review allAnswers={allAnswers} exercise={exercise} />
				)}

				{!onReviewScreen && (
					<div>
						{stepData?.fields?.map((field, fieldIdx) => {
							const fieldAnswer = stepAnswer?.at(fieldIdx)
							const hasMultipleFields = stepData && stepData.fields!.length > 1

							return (
								<FieldProvider
									key={field.prompt}
									fieldIdx={fieldIdx}
									stepIdx={stepIdx}
									readOnly={isGroupExercise && role !== "captain"}
									field={field}
									answer={fieldAnswer}
									exerciseId={exercise._id}
									allAnswers={allAnswers}
									allSteps={allSteps}
								>
									<FieldContainer>
										{field.type !== "Tagline" && (
											<Prompt
												className="mb-5"
												num={hasMultipleFields ? fieldIdx + 1 : undefined}
												additionalText={field.additionalText}
											>
												{field.prompt}
											</Prompt>
										)}

										<FieldRenderer />
									</FieldContainer>
								</FieldProvider>
							)
						})}
					</div>
				)}
			</ErrorBoundary>

			<Steps
				steps={allSteps.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
				className="mt-auto"
			/>
		</div>
	)
}
