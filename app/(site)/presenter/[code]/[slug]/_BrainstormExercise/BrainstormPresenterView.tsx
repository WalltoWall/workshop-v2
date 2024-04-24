import React from "react"
import { type BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import BrainstormPresenterViewClient from "./BrainstormPresenterViewClient"

type Props = { exercise: BrainstormExercise }

export const BrainstormPresenterView = async ({ exercise }: Props) => {
	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient exercise={exercise} />
		</div>
	)
}
