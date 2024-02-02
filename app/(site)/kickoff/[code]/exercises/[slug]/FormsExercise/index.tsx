import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { InstructionsModal } from "../InstructionsModal"
import type { FormParticipant } from "./types"

const Form = dynamic(() => import("./Form"), { ssr: false })

type Props = {
	exercise: ST["exercise"]
}

export const FormExercise = async ({ exercise }: Props) => {
	const participant = await client.findParticipantOrThrow<FormParticipant>()

	return (
		<>
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			<Form exercise={exercise} participant={participant} />
		</>
	)
}
