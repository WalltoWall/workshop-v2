import { notFound } from "next/navigation"
import * as R from "remeda"
import { uid } from "uid"
import { client } from "@/sanity/client"
import { FormPresenter } from "@/exercises/form/presenter-ui"
import { SlidersPresenter } from "@/exercises/sliders/presenter-ui"
import { GroupProvider } from "@/groups/group-context"

interface Props {
	params: { code: string; slug: string }
}

const PresenterExercisePage = async (props: Props) => {
	const [kickoff, participants] = await Promise.all([
		client.findKickoffOrThrow(props.params.code),
		client.findAllParticipantsInKickoff(props.params.code),
	])
	const exercise = kickoff.exercises.find(
		(e) => e.slug.current === props.params.slug,
	)
	if (!exercise) notFound()

	const participantsById = R.mapToObj(participants, (p) => [p._id, p])
	const presenterId = `presenter-${uid(5)}`

	return (
		<GroupProvider
			slug={exercise.slug.current}
			type={exercise.type}
			participantId={presenterId}
		>
			{exercise.type === "form" && (
				<FormPresenter
					exercise={exercise}
					participantsById={participantsById}
				/>
			)}

			{exercise.type === "sliders" && <SlidersPresenter exercise={exercise} />}
		</GroupProvider>
	)
}

export default PresenterExercisePage
