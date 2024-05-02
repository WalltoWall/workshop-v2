import { notFound, redirect } from "next/navigation"
import { client } from "@/sanity/client"
import { FormExercise } from "./FormsExercise"
import { InstructionsModal } from "./InstructionsModal"

interface Props {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const participant = await client.findParticipantOrThrow()
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	if (exercise.groups && exercise.groups.length >= 1) {
		redirect(
			`/kickoff/${props.params.code}/exercises/${props.params.slug}/groups`,
		)
	}

	return (
		<div className="flex flex-[1_1_0] flex-col">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "form" && (
				<FormExercise exercise={exercise} participant={participant} />
			)}
		</div>
	)
}

export default ExercisePage
