import React from "react"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ExerciseCard } from "@/app/(site)/kickoff/[code]/exercises/ExerciseCard"

interface Props {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const PresenterKickoffPage = async (props: Props) => {
	const kickoff = await client.findKickoffOrThrow(props.params.code)

	return (
		<div className="px-7 py-8">
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{kickoff.exercises?.map((exercise) => (
					<ExerciseCard
						key={exercise._id}
						href={`/presenter/${kickoff.code.current}/${exercise.slug.current}`}
						name={exercise.name}
					/>
				))}
			</div>
		</div>
	)
}

export default PresenterKickoffPage
