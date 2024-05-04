import { notFound } from "next/navigation"
import { InstructionsModal } from "@/components/InstructionsModal"
import { assertOnboarded } from "@/lib/assert-onboarded"
import { client } from "@/sanity/client"
import { RoleHeader } from "@/groups/ui/RoleHeader"

interface Props {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExercisePage = async (props: Props) => {
	const [participant, kickoff, exercise] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(props.params.code),
		client.findExerciseBySlug(props.params.slug),
	])
	assertOnboarded(participant, kickoff)
	if (!exercise) notFound()

	const group = exercise.groups?.find(
		(g) => g.slug.current === props.params.groupSlug,
	)
	if (!group) return null

	return (
		<div className="flex flex-[1_1_0] flex-col">
			<RoleHeader
				className="-mx-7 mb-7"
				participantId={participant._id}
				groupName={group.name}
			/>

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{/* exercise.type === "form" && (
				<FormExercise
					exercise={exercise}
					groupSlug={props.params.groupSlug}
					participant={participant}
				/>
			)*/}
		</div>
	)
}

export default GroupExercisePage
