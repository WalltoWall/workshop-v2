import { z } from "zod"
import type { BrainstormAnswer } from "@/exercises/brainstorm/types"
import * as FormMessages from "@/exercises/form/messages"
import type { FormAnswer } from "@/exercises/form/types"
import type { QuadrantsAnswer } from "@/exercises/quadrants/types"
import * as SharedMessages from "@/exercises/shared-messages"
import type { SliderAnswer } from "@/exercises/sliders/types"
import * as GroupMessages from "@/groups/messages"

export type Answer =
	| FormAnswer
	| BrainstormAnswer
	| QuadrantsAnswer
	| SliderAnswer
	| { type: "unknown" }

export type Participants = Record<string, GroupMessages.GroupRole>

// Incoming messages
export const PartyIncomingMessage = z.discriminatedUnion("type", [
	// Global Messages
	SharedMessages.GoToStep,

	// Group Messages
	GroupMessages.SetRole,
	GroupMessages.ClearRole,

	// Form Messages
	FormMessages.ChangeListFieldItem,
	FormMessages.AddListFieldItem,

	FormMessages.AddNarrowFieldItem,

	FormMessages.AddTaglineFieldItem,
	FormMessages.ChangeTaglineFieldItem,
])
export type PartyIncomingMessage = z.infer<typeof PartyIncomingMessage>

// Outgoing Messages
type InitMessage = { type: "init"; answer: Answer; participants: Participants }
type ParticipantsOutgoingMessage = {
	type: "participants"
	participants: Participants
}
type AnswerOutgoingMessage = { type: "answer"; answer: Answer }
type ErrorOutgoingMessage = { type: "error"; error: string }

export type PartyOutgoingMessage =
	| InitMessage
	| ParticipantsOutgoingMessage
	| AnswerOutgoingMessage
	| ErrorOutgoingMessage

export const ExerciseType = z.union([
	z.literal("form"),
	z.literal("brainstorm"),
	z.literal("quadrants"),
	z.literal("sliders"),
])
