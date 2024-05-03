import React from "react"
import { notFound } from "next/navigation"
import { assertOnboarded } from "@/lib/assert-onboarded"
import { client } from "@/sanity/client"
import { GroupProvider } from "@/groups/group-context"

interface Props {
	params: { slug: string; code: string }
	children: React.ReactNode
}

const ExerciseLayout = async ({ params, children }: Props) => {
	const [participant, kickoff, exercise] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(params.code),
		client.findExerciseBySlug(params.slug),
	])
	assertOnboarded(participant, kickoff)
	if (!exercise) notFound()

	return (
		<GroupProvider
			slug={params.slug}
			type={exercise.type}
			participantId={participant._id}
		>
			{children}
		</GroupProvider>
	)
}

export default ExerciseLayout
