import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { assertOnboarded } from "../assert-onboarded"
import type { GroupExercise } from "./[slug]/groups/types"
import { ExerciseCard } from "./ExerciseCard"

interface Props {
	params: { code: string }
}

const ExercisesPage = async (props: Props) => {
	const [participant, kickoff] = await Promise.all([
		client.findParticipantViaCookie(),
		client.findKickoffOrThrow(props.params.code),
	])
	assertOnboarded(participant, kickoff)

	const code = props.params.code

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<div className="mt-6 grid gap-4">
				{kickoff.exercises?.map((exercise: GroupExercise) => {
					const groups = exercise.groups ?? []
					const slug = exercise.slug.current

					const baseHref = `/kickoff/${code}/exercises/${slug}`
					const groupsHref = `${baseHref}/groups`

					const href = groups.length > 0 ? groupsHref : baseHref

					return (
						<ExerciseCard key={exercise._id} name={exercise.name} href={href} />
					)
				})}
			</div>
		</div>
	)
}

export const metadata = {
	title: "Exercises - UnWorkshop",
}

export default ExercisesPage
