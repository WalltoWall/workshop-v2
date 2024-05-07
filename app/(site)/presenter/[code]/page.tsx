import React from "react"
import { notFound } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ExerciseCard } from "@/app/(site)/kickoff/[code]/exercises/ExerciseCard"
import { PresenterHeader } from "../PresenterHeader"

interface Props {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const PresenterKickOffPage = async (props: Props) => {
	const kickoff = await client.findKickoff(props.params.code)
	if (!kickoff) notFound()

	return (
		<React.Suspense>
			<PresenterHeader
				kickoffCode={props.params.code}
				exercises={kickoff.exercises ?? []}
			/>

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
		</React.Suspense>
	)
}

export default PresenterKickOffPage
