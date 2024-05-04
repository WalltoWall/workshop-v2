"use client"

import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useParams, useRouter } from "next/navigation"
import { stripIndent } from "common-tags"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import { FieldContainer } from "./FieldContainer"
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
	const { answer, actions, role } = useGroupContext()

	if (answer.type !== "form") {
		throw new Error(stripIndent`
			Invalid answer found for this exercise. 
				Expected: "form"
				Received: "${answer.type}"
		`)
	}

	const isGroupExercise = exercise.groups && exercise.groups.length > 0

	const step = answer.step
	const stepIdx = step - 1

	if (!exercise.form || !exercise.form.steps) {
		throw new Error("Invalid exercise found. Check form configuration!")
	}

	const id = groupSlug ?? participant._id
	const allAnswers = answer.data[id] ?? []

	const stepData = exercise.form.steps.at(stepIdx)
	const stepAnswer = allAnswers.at(stepIdx)

	const onReviewScreen = stepIdx === exercise.form.steps.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-3 flex flex-[1_1_0] flex-col justify-between">
			<ErrorBoundary fallback={<InvalidField className="my-6" />}>
				{onReviewScreen && (
					<Review allAnswers={allAnswers} exercise={exercise} />
				)}

				{!onReviewScreen && (
					<div>
						{stepData?.fields?.map((field, fieldIdx) => {
							const fieldAnswer = stepAnswer?.at(fieldIdx)

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
										allAnswers={allAnswers}
										answer={fieldAnswer}
										readOnly={isGroupExercise && role !== "captain"}
									/>
								</FieldContainer>
							)
						})}
					</div>
				)}
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
