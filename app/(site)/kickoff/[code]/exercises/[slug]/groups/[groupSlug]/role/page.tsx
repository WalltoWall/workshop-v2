import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import RoleSelector from "../../RoleSelector"

type Props = {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExerciseRoleSelectionPage = async (props: Props) => {
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(props.params.slug),
		client.findParticipantOrThrow(),
	])
	if (!exercise) notFound()

	return <RoleSelector exercise={exercise} participant={participant} />
}

export default GroupExerciseRoleSelectionPage
