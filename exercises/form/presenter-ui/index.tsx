import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import { FormResponses } from "./FormResponses"

interface Props {
	exercise: ST.Exercise
	kickoff: NonNullable<ST.KickoffQueryResult>
}

export const FormPresenter = async (props: Props) => {
	const participants = await client.findAllParticipantsInKickoff(
		props.kickoff._id,
	)

	const participantsById: Record<string, ST.Participant> = {}
	participants.forEach((p) => (participantsById[p._id] = p))

	return (
		<FormResponses participants={participantsById} exercise={props.exercise} />
	)
}
