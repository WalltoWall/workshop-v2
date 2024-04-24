import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import SlidersClient from "./SlidersClient"
import type { SlidersParticipant } from "./types"

export type SliderItem = NonNullable<ST.Exercise["sliders"]>[number]

type Props = {
	exercise: ST.Exercise
	groupSlug?: string
}

export const SlidersExercise = async ({ exercise, groupSlug }: Props) => {
	const participant = await client.findParticipantOrThrow<SlidersParticipant>()

	return (
		<SlidersClient
			exercise={exercise}
			participant={participant}
			groupSlug={groupSlug}
		/>
	)
}
