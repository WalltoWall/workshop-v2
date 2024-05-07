"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import { Quadrant } from "./_Quadrant/Quadrant"
import { QuadrantInstructions } from "./QuadrantInstructions"
import type { QuadrantsExercise, QuadrantsParticipant } from "./types"
import { useMultiplayerQuadrants } from "./use-multiplayer-quadrants"

export type State =
	| "today_pending"
	| "today_placed"
	| "tomorrow_pending"
	| "tomorrow_placed"
	| "complete"

type QuadrantsClientProps = {
	exercise: QuadrantsExercise
	participant: QuadrantsParticipant
	groupSlug?: string
	kickoffCode: string
	// FIXME: This is hacky, but i need this to work for now.
	keepStepperActive?: boolean
}

export const QuadrantsClient = ({
	exercise,
	participant,
	groupSlug,
	kickoffCode,
	keepStepperActive = false,
}: QuadrantsClientProps) => {
	if (!exercise.quadrants)
		throw new Error("Invalid Quadrant Exercise. No quadrants configured.")

	const router = useRouter()
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const totalSteps = exercise.quadrants.length * 2

	const todayInstructions = exercise.today_instructions
	const tomorrowInstructions = exercise.tomorrow_instructions
	const finalInstructions = exercise.finalize_instructions

	const currentQuadrantIdx = Math.ceil(step / 2) - 1
	const currentQuadrant = exercise.quadrants.at(currentQuadrantIdx)

	const { actions } = useMultiplayerQuadrants({
		exerciseId: exercise._id,
		participantId: participant._id,
		groupSlug: groupSlug,
	})

	const { answers, role } = actions.getAnswers()

	// step is passed explicitely here since this fires before url params have been updated
	const determineNextState = (step: number) => {
		// We are on the last quadrant, so we need to mark this is as complete.
		if (step - 1 === totalSteps) {
			return "complete"
		}
		const selectingForToday = step & 1
		const currentQuadrantIdx = Math.ceil(step / 2) - 1
		const currentQuadrant = exercise.quadrants!.at(currentQuadrantIdx)!
		if (selectingForToday) {
			return answers?.[currentQuadrant.slug.current]?.today
				? "today_placed"
				: "today_pending"
		} else {
			return answers?.[currentQuadrant.slug.current]?.tomorrow
				? "tomorrow_placed"
				: "tomorrow_pending"
		}
	}

	const [state, setState] = useState<State>(determineNextState(step))
	const isDisabled = state === "today_pending" || state === "tomorrow_pending"

	const onStepChange = (step: number) => {
		setState(determineNextState(step))
	}

	const handleClick = () => {
		switch (state) {
			case "today_pending":
				setState("today_placed")
				break

			case "tomorrow_pending":
				setState("tomorrow_placed")
				break
		}
	}

	return (
		<>
			<div className="mb-10">
				<QuadrantInstructions
					state={state}
					todayInstructions={todayInstructions}
					tomorrowInstructions={tomorrowInstructions}
					finalInstructions={finalInstructions}
				/>

				{state === "complete" ? (
					exercise.quadrants.map((quadrant, index) => (
						<div key={quadrant._key}>
							{index !== 0 && (
								<div className="-ml-7 h-[0.125rem] w-[calc(100%+3.5rem)] bg-gray-90" />
							)}

							<Quadrant
								item={quadrant}
								answer={answers?.[quadrant.slug.current]}
								state={state}
								index={index}
								actions={actions}
								onQuadrantClick={handleClick}
								readOnly={role === "contributor"}
							/>
						</div>
					))
				) : currentQuadrant ? (
					<div key={currentQuadrant?._key}>
						<Quadrant
							item={currentQuadrant}
							answer={answers?.[currentQuadrant.slug.current]}
							index={currentQuadrantIdx}
							state={state}
							actions={actions}
							onQuadrantClick={handleClick}
							readOnly={role === "contributor"}
						/>
					</div>
				) : null}
			</div>

			<Steps
				disabled={keepStepperActive ? false : isDisabled}
				steps={totalSteps}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
				onStepChange={onStepChange}
			/>
		</>
	)
}

export default QuadrantsClient
