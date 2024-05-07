import { notFound } from "next/navigation"
import { uid } from "uid"
import { client } from "@/sanity/client"
import { FormPresenter } from "@/exercises/form/presenter-ui"
import { GroupProvider } from "@/groups/group-context"

interface Props {
	params: { code: string; slug: string }
}

const PresenterExercisePage = async (props: Props) => {
	const kickoff = await client.findKickoffOrThrow(props.params.code)
	const exercise = kickoff.exercises.find(
		(e) => e.slug.current === props.params.slug,
	)
	if (!exercise) notFound()

	const id = `presenter-${uid(5)}`

	return (
		<GroupProvider
			slug={exercise.slug.current}
			type={exercise.type}
			participantId={id}
		>
			{exercise.type === "form" && (
				<FormPresenter kickoff={kickoff} exercise={exercise} />
			)}
		</GroupProvider>
	)
}

export default PresenterExercisePage
