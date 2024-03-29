import type { ST } from "@/sanity/types.gen"
import type { Group } from "../groups/types"

export type Answer = {
	today?: number
	tomorrow?: number
	participantOrGroupId?: string
}

export type SliderAnswers = {
	[slug: string]: Answer
}

export type SlidersParticipant = ST["participant"]

// each key in the participants object is a participant id which has an array of answers
// where the index of the array represents the step and the answers at that step
export type SlidersAnswers = {
	participants: Record<string, SliderAnswers>
	groups: Record<string, Group>
}

export type SlidersExercise = ST["exercise"] & {
	answers?: SlidersAnswers
}
