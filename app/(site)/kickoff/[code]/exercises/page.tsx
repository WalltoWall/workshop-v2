import { Text } from "@/components/Text"
import { findKickoffOrThrow } from "@/sanity/client"
import { ExerciseCard } from "./ExerciseCard"

const ExercisesPage = async (props: { params: { code: string } }) => {
	const kickoff = await findKickoffOrThrow(props.params.code)

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="mt-6 grid gap-4">
				{kickoff.exercises.map((exercise) => (
					<li key={exercise._id}>
						<ExerciseCard
							kickoffCode={kickoff.code.current}
							name={exercise.name}
							slug={exercise.slug.current}
							type={exercise.type}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

export const metadata = {
	title: "Exercises - W|W Workshop",
}

export default ExercisesPage
