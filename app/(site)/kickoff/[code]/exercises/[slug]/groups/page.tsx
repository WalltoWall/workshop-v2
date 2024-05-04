import { notFound } from "next/navigation"
import { InstructionsModal } from "@/components/InstructionsModal"
import { assertOnboarded } from "@/lib/assert-onboarded"
import { client } from "@/sanity/client"
import { GroupSelector } from "@/groups/ui/GroupSelector"

interface Props {
	params: { code: string; slug: string }
}

const GroupsPage = async (props: Props) => {
	const [participant, kickoff, exercise] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(props.params.code),
		client.findExerciseBySlug(props.params.slug),
	])
	assertOnboarded(participant, kickoff)

	if (!exercise) notFound()

	const groups = exercise.groups ?? []

	return (
		<div className="h-full">
			<InstructionsModal exerciseName={exercise.name} />
			<GroupSelector groups={groups} />
		</div>
	)
}

export default GroupsPage
