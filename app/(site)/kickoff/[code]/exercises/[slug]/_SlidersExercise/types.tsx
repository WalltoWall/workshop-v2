import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }


export type Answer = {
	today?: number;
	tomorrow?: number;
}

export type Answers = {
	[key: string]: Answer
}

export type SlidersParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Answer
		}
	}
}
