
import type { ST } from "@/sanity/config"
import { client } from "@/sanity/client"
import type { SlidersParticipant } from "./types"
import { SlidersClient } from "./SlidersClient"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

type Props = {
	exercise: ST["exercise"]
}

// TODO: Currently does not support nested sliders. E.g. 2 sliders per step.
// TODO: Ensure answers are persisted on refresh / page load.
// TODO: Tie the current step to search parameters.
export const SlidersExercise = async ({ exercise }: Props) => {
	const groups = exercise.groups ?? []
	const sliders = exercise.sliders ?? []

	const participant =
		await client.findParticipantOrThrow<SlidersParticipant>()
	const answers = participant.answers?.[exercise._id]?.answers ?? {}
	
	console.log(answers)
	return (
		<div className="mt-8">
			{sliders && (
				<SlidersClient 
					sliders={sliders} 
					answers={answers} 
					groups={groups}
					exerciseId={exercise._id}
				/>
			)}
		</div>
	)
}
