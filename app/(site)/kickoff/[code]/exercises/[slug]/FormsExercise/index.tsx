import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import Form from "./Form"
import type { FormParticipant } from "./types"

type Props = {
	exercise: ST.Exercise
	groupSlug?: string
}

export const FormExercise = async ({ exercise, groupSlug }: Props) => {
	const participant = await client.findParticipantOrThrow<FormParticipant>()

	return (
		<Form exercise={exercise} participant={participant} groupSlug={groupSlug} />
	)
}
