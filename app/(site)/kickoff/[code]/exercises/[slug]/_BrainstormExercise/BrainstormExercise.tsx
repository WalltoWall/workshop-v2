import React from "react"
import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import BrainstormClient from "./BrainstormClient"
import type { BrainstormParticipant } from "./types"

export interface BrainstormExerciseProps {
	exercise: ST.Exercise
	kickoffCode: string
	groupSlug?: string
}

export const BrainstormExercise = async ({
	exercise,
	groupSlug,
}: BrainstormExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	return (
		<div className="mt-4 flex flex-[1_1_0] flex-col">
			<BrainstormClient
				exercise={exercise}
				participant={participant}
				groupSlug={groupSlug}
			/>
		</div>
	)
}
