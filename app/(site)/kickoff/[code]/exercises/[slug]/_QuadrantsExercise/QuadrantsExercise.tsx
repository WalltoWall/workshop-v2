import React from "react"
import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import QuadrantsClient from "./QuadrantsClient"
import type { QuadrantsParticipant } from "./types"

export interface QuadrantsExerciseProps {
	exercise: ST.Exercise
	groupSlug?: string
	kickoffCode: string
	keepStepperActive?: boolean
}

export const QuadrantsExercise = async ({
	exercise,
	groupSlug,
	kickoffCode,
	keepStepperActive,
}: QuadrantsExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	return (
		<div className="mt-8 h-full">
			{exercise.quadrants && (
				<QuadrantsClient
					exercise={exercise}
					participant={participant}
					groupSlug={groupSlug}
					kickoffCode={kickoffCode}
					keepStepperActive={keepStepperActive}
				/>
			)}
		</div>
	)
}
