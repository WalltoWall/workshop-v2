import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "../../_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "../../_QuadrantsExercise/QuadrantsExercise"
import { SlidersExercise } from "../../_SlidersExercise/SlidersExercise"
import { FormExercise } from "../../FormsExercise"
import GroupExerciseSubmissionForm from "../GroupExerciseSubmissionForm"

type Props = {
	params: { code: string; slug: string; groupSlug: string }
}

const GroupExercisePage = async (props: Props) => {
	const [exercise, participant] = await Promise.all([
		client.findExerciseBySlug(props.params.slug),
		client.findParticipantOrThrow(),
	])
	if (!exercise) notFound()

	return (
		<GroupExerciseSubmissionForm exercise={exercise} participant={participant}>
			{exercise.type === "brainstorm" && (
				<BrainstormExercise
					exercise={exercise}
					kickoffCode={props.params.code}
					groupSlug={props.params.groupSlug}
				/>
			)}

			{exercise.type === "sliders" && (
				<SlidersExercise
					exercise={exercise}
					groupSlug={props.params.groupSlug}
				/>
			)}

			{exercise.type === "quadrants" && (
				<QuadrantsExercise
					exercise={exercise}
					kickoffCode={props.params.code}
					groupSlug={props.params.groupSlug}
					keepStepperActive
				/>
			)}

			{exercise.type === "form" && (
				<FormExercise exercise={exercise} groupSlug={props.params.groupSlug} />
			)}
		</GroupExerciseSubmissionForm>
	)
}

export default GroupExercisePage
