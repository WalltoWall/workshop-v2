import { z } from "zod"
import type { BrainstormAnswer } from "@/exercises/brainstorm/types"
import {
	AddListFieldItemMessage,
	ChangeListFieldItemMessage,
} from "@/exercises/form/messages"
import type { FormAnswer } from "@/exercises/form/types"
import type { QuadrantsAnswer } from "@/exercises/quadrants/types"
import type { SliderAnswer } from "@/exercises/sliders/types"
import {
	ClearRoleMessage,
	SetRoleMessage,
	type GroupRole,
} from "@/groups/messages"

export type Answer =
	| FormAnswer
	| BrainstormAnswer
	| QuadrantsAnswer
	| SliderAnswer
	| { type: "unknown" }

export type Participants = Record<string, GroupRole>

// Incoming messages
export const PartyIncomingMessage = z.discriminatedUnion("type", [
	// Group Messages
	SetRoleMessage,
	ClearRoleMessage,

	// Form Messages
	ChangeListFieldItemMessage,
	AddListFieldItemMessage,
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
