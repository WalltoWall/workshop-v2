import { notFound } from "next/navigation"
import { uid } from "uid"
import { client } from "@/sanity/client"
import { FormPresenter } from "@/exercises/form/presenter-ui"
import { GroupProvider } from "@/groups/group-context"
import { PresenterHeader } from "../../PresenterHeader"

interface Props {
	params: { code: string; slug: string }
}

const PresenterExercisePage = async (props: Props) => {
	const [kickoff, exercise] = await Promise.all([
		client.findKickoffOrThrow(props.params.code),
		client.findExerciseBySlug(props.params.slug),
	])
	if (!exercise) notFound()

	const exercises = kickoff.exercises ?? []
	const id = `presenter-${uid(5)}`

	return (
		<GroupProvider
			slug={exercise.slug.current}
			type={exercise.type}
			participantId={id}
		>
			<PresenterHeader
				kickoffCode={props.params.code}
				exercises={exercises}
				exercise={exercise}
			/>

			{exercise.type === "form" && (
				<FormPresenter kickoff={kickoff} exercise={exercise} />
			)}
		</GroupProvider>
	)
}

export default PresenterExercisePage
