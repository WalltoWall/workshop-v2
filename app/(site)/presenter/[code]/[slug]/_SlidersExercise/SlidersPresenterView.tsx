
import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { SlidersPresenterViewClient } from "./SlidersPresenterViewClient"

interface SlidersPresenterViewProps {
	exercise: ST["exercise"]
}

export const SlidersPresenterView = async ({
	exercise,
}: SlidersPresenterViewProps) => {
	const participants = await client.findAllParticipantsInExercise(exercise._id)

	const participantAnswers = participants.flatMap(
		(participant) => participant.answers[exercise._id].answers
	)

	const groupedAnswers = participantAnswers.reduce((group, answer) => {
		const names = Object.keys(answer)
		names.forEach((name) => {
			group[name] = group[name] ?? []
			group[name].push(answer[name])
		})

		return group
	}, {})

	return (
		<div className="pt-12">
			<SlidersPresenterViewClient
				exercise={exercise}
				answers={groupedAnswers}
			/>
		</div>
	)
}
