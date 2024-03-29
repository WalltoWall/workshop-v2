"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/types.gen"
import { Slider } from "./Slider"
import type { SlidersExercise, SlidersParticipant } from "./types"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

type Props = {
	exercise: SlidersExercise
	participant: SlidersParticipant
	groupSlug?: string
}

export const SlidersClient = ({ exercise, participant, groupSlug }: Props) => {
	if (!exercise.sliders) throw new Error("Invalid Sliders Exercise steps.")

	const router = useRouter()
	const params = useParams()
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { actions, multiplayer } = useMultiplayerSliders({
		exerciseId: exercise._id,
		participantId: participant._id,
		slug: exercise.sliders[stepIdx].slug.current,
		groupSlug,
	})

	const { answers, role } = actions.getAnswers()

	if (!multiplayer.provider.synced) return null

	const sliders = exercise.sliders
	const answer = answers?.[exercise.sliders[stepIdx].slug.current]

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
							readOnly={role === "contributor"}
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
