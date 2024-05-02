import { notFound } from "next/navigation"
import { assertOnboarded } from "@/lib/assert-onboarded"
import { client } from "@/sanity/client"
import { RoleSelector } from "../../RoleSelector"

interface Props {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExerciseRoleSelectionPage = async (props: Props) => {
	const [participant, kickoff, exercise] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(props.params.code),
		client.findExerciseBySlug(props.params.slug),
	])
	assertOnboarded(participant, kickoff)

	if (!exercise) notFound()

	return <RoleSelector exercise={exercise} participant={participant} />
}

export default GroupExerciseRoleSelectionPage
