import { notFound, redirect } from "next/navigation"
import { assertOnboarded } from "@/lib/assert-onboarded"
import { client } from "@/sanity/client"
import { FormExercise } from "./FormsExercise"
import { InstructionsModal } from "./InstructionsModal"

interface Props {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const [participant, kickoff, exercise] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(props.params.code),
		client.findExerciseBySlug(props.params.slug),
	])
	assertOnboarded(participant, kickoff)

	const code = props.params.code
	const slug = props.params.slug

	if (!exercise) notFound()
	if (exercise.groups && exercise.groups.length > 0) {
		redirect(`/kickoff/${code}/exercises/${slug}/groups`)
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
