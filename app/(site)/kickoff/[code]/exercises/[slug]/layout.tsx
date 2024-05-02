import React from "react"
import { notFound } from "next/navigation"
import { client } from "@/sanity/client"
import { GroupProvider } from "@/groups/group-context"

interface Props {
	params: { slug: string; code: string }
	children: React.ReactNode
}

const ExerciseLayout = async ({ params, children }: Props) => {
	const exercise = await client.findExerciseBySlug(params.slug)
	if (!exercise) notFound()

	return (
		<GroupProvider slug={params.slug} type={exercise.type}>
			{children}
		</GroupProvider>
	)
}

export default ExerciseLayout
