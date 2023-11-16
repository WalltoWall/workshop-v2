"use client"

import { useState } from "react"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./Quadrant"

export const getTime = (active: number, index: number) => {
	if (active === index * 2) {
		return "today"
	} else if (active === index * 2 + 1) {
		return "tomorrow"
	}

	return false
}

type QuadrantsExerciseProps = {
	quadrants?: ST["exercise"]["quadrants"]
	todayInstructions?: ST["exercise"]["today_instructions"]
	tomorrowInstructions?: ST["exercise"]["tomorrow_instructions"]
	finalInstructions?: ST["exercise"]["finalize_instructions"]
}

export type Result = {
	today: {
		top: number
		left: number
		placed: boolean
	}
	tomorrow: {
		top: number
		left: number
		placed: boolean
	}
	arrow: {
		top: number
		left: number
		width: number
		angle: number
	}
}

export const QuadrantsExercise = ({
	quadrants,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantsExerciseProps) => {
	const [results, setResults] = useState<Result[] | undefined>(
		quadrants?.map(() => ({
			today: { top: 0, left: 0, placed: false },
			tomorrow: { top: 0, left: 0, placed: false },
			arrow: { top: 0, left: 0, width: 0, angle: 0 },
		})),
	)
	const [active, setActive] = useState(0)
	if (!quadrants) return null

	const handleDisabled = () => {
		if (!results) return true
		const tomorrow = (active / 2) % 1 > 0 ? true : false

		if (tomorrow) {
			return !results[(active - 1) / 2]?.tomorrow?.placed
		} else if (active !== results.length * 2) {
			return !results[active / 2]?.today?.placed
		}

		return false
	}

	return (
		<div className="mt-8 h-full">
			{results && (
				<>
					{quadrants.map((quadrant, index) => (
						<div key={index}>
							{(getTime(active, index) === "today" ||
								getTime(active, index) === "tomorrow" ||
								active === results.length * 2) && (
								<Quadrant
									item={quadrant}
									index={index}
									active={active}
									results={results}
									setResults={setResults}
									todayInstructions={todayInstructions}
									tomorrowInstructions={tomorrowInstructions}
									finalInstructions={finalInstructions}
								/>
							)}
						</div>
					))}

					<Steps
						disabled={handleDisabled()}
						count={quadrants.length * 2}
						active={active}
						onActiveChange={setActive}
						onFinish={() => alert("done")}
					/>
				</>
			)}
		</div>
	)
}
