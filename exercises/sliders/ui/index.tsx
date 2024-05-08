"use client"

import { useParams, useRouter } from "next/navigation"
import { FinalizeBanner } from "@/components/FinalizeBanner"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import { assertSlidersAnswer } from "../utils"
import { SliderPair } from "./SliderPair"

interface Props {
	exercise: ST.Exercise
	participant: NonNullable<ST.ParticipantQueryResult>
	groupSlug?: string
}

export const SlidersExercise = ({
	exercise,
	participant,
	groupSlug,
}: Props) => {
	const params = useParams()
	const router = useRouter()
	const { answer, actions, role } = useGroupContext()
	assertSlidersAnswer(answer)

	if (!exercise.sliders) {
		throw new Error("Invalid exercise found. Check slider configuration!")
	}

	const isGroupExercise = Boolean(exercise.groups && exercise.groups.length > 0)

	const step = answer.step
	const stepIdx = step - 1

	const id = groupSlug ?? participant._id

	const allSliders = exercise.sliders
	const allAnswers = answer.data[id] ?? []

	const slider = allSliders.at(stepIdx)
	const stepAnswer = allAnswers.at(stepIdx)

	const onReviewScreen = stepIdx === allSliders.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-6 flex flex-[1_1_0] flex-col gap-6">
			{onReviewScreen && (
				<div>
					<FinalizeBanner />

					{allSliders.map((slider, idx) => (
						<SliderPair
							className="-mx-7 border-b border-gray-90 px-7 py-8 last:border-b-0 last:pb-0"
							key={slider._key}
							id={id}
							slider={slider}
							actions={actions}
							stepAnswer={allAnswers.at(idx)}
							readOnly={isGroupExercise && role !== "captain"}
							stepIdx={idx}
						/>
					))}
				</div>
			)}

			{!onReviewScreen && slider && (
				<SliderPair
					key={slider._key}
					id={id}
					slider={slider}
					actions={actions}
					stepAnswer={stepAnswer}
					readOnly={isGroupExercise && role !== "captain"}
					stepIdx={stepIdx}
				/>
			)}

			<Steps
				steps={allSliders.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
				className="mt-auto"
			/>
		</div>
	)
}
