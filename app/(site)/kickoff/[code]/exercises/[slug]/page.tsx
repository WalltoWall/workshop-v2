import { Text } from "@/components/Text"
import { findExerciseBySlug } from "@/sanity/client"
import { notFound } from "next/navigation"
import { BrainstormExercise } from "./BrainstormExercise"
import { QuadrantsExercise } from "./QuadrantsExercise"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<div>
			<Text style="heading" size={40} asChild>
				<h1>{exercise.name}</h1>
			</Text>

			{exercise.type === "brainstorm" && <BrainstormExercise />}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise quadrants={exercise.quadrants} />
			)}
		</div>
	)
}

export default ExercisePage
