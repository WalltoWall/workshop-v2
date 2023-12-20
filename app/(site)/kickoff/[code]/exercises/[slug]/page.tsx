import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { BrainstormExercise } from "./_BrainstormExercise/BrainstormExercise"
import { QuadrantsExercise } from "./_QuadrantsExercise/QuadrantsExercise"
import { InstructionsModal } from "./InstructionsModal"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = async (props: Props) => {
	const exercise = await client.findExerciseBySlug(props.params.slug)
	if (!exercise) notFound()

	return (
		<div className="h-full">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{exercise.type === "brainstorm" && (
				<BrainstormExercise exercise={exercise} />
			)}
			{exercise.type === "quadrants" && (
				<QuadrantsExercise exercise={exercise} />
			)}
		</div>
	)
}

export default ExercisePage
