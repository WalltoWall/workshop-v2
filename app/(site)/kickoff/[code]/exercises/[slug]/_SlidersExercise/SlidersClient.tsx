"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Slider } from "./Slider"
import type { SlidersExercise, SlidersParticipant } from "./types"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

type Props = {
	exercise: SlidersExercise
	participant: SlidersParticipant
}

export const SlidersClient = ({ exercise, participant }: Props) => {
	if (!exercise.sliders) throw new Error("Invalid Sliders Exercise steps.")

	const router = useRouter()
	const params = useParams()
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { snap, actions } = useMultiplayerSliders({
		exerciseId: exercise._id,
		stepIdx,
		participantId: participant._id,
	})

	const sliders = exercise.sliders
	const participantAnswers = snap.participants[participant._id]
	let answer = {}

	if (participantAnswers) answer = participantAnswers[stepIdx]

	return (
		<div className="mt-8">
			{sliders?.map((slider, i) => (
				<div key={i}>
					{(step === i + 1 || step === sliders.length + 1) && (
						<Slider
							key={slider._key}
							item={slider}
							answer={answer}
							actions={actions}
						/>
					)}
				</div>
			))}

			<Steps
				steps={exercise.sliders.length - 1}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${params.code}/exercises`)}
			/>
		</div>
	)
}

export default SlidersClient