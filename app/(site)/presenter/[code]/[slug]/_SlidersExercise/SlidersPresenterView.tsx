import React from "react"
import type { SlidersExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import SlidersPresenterViewClient from "./SlidersPresenterViewClient"

interface SlidersPresenterViewProps {
	exercise: SlidersExercise
}

export const SlidersPresenterView = async ({
	exercise,
}: SlidersPresenterViewProps) => {
	return (
		<div className="flex h-full grow flex-col px-8 pb-20 pt-12">
			<SlidersPresenterViewClient exercise={exercise} />
		</div>
	)
}
