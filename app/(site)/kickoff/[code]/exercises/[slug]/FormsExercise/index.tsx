import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { Form } from "./Form"
import type { FormParticipant } from "./types"

type Props = {
	exercise: ST["exercise"]
}

export const FormExercise = async ({ exercise }: Props) => {
	const participant = await client.findParticipantOrThrow<FormParticipant>()

	return <Form exercise={exercise} participant={participant} />
}