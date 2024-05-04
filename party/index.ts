import type * as Party from "partykit/server"
import { debounce } from "perfect-debounce"
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
import { json } from "./party-utils"

const ANSWER_KEY = "answer"
const PARTICIPANTS_KEY = "participants"

const TypeSchema = z.union([
	z.literal("form"),
	z.literal("brainstorm"),
	z.literal("quadrants"),
	z.literal("sliders"),
])

export type Answer =
	| FormAnswer
	| BrainstormAnswer
	| QuadrantsAnswer
	| SliderAnswer
	| { type: "unknown" }

const PartyIncomingMessage = z.discriminatedUnion("type", [
	// Group Messages
	SetRoleMessage,
	ClearRoleMessage,

	// Form Messages
	ChangeListFieldItemMessage,
	AddListFieldItemMessage,
])
export type PartyIncomingMessage = z.infer<typeof PartyIncomingMessage>

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

export type Participants = Record<string, GroupRole>

export default class UnworkshopServer implements Party.Server {
	// The recorded answers for the exercise.
	answer: Answer = { type: "unknown" }

	// The group or participant ids mapped to their role.
	participants: Participants = {}

	constructor(readonly room: Party.Room) {}

	get type() {
		const [, type] = this.room.id.split("::")

		return TypeSchema.parse(type)
	}

	/**
	 * Helper for throwing an error and sending a formatted message to the
	 * connection that caused it.
	 */
	sendAndThrow(msg: string, conn: Party.Connection): never {
		conn.send(this.outMsg({ type: "error", error: msg }))
		throw new Error(msg)
	}

	outMsg(msg: PartyOutgoingMessage): string {
		return JSON.stringify(msg)
	}

	broadcastParticipants() {
		const msg = this.outMsg({
			type: "participants",
			participants: this.participants,
		})
		this.room.broadcast(msg)
	}

	broadcastAnswers() {
		const msg = this.outMsg({
			type: "answer",
			answer: this.answer,
		})
		this.room.broadcast(msg)
	}

	getDefaultAnswer(): Answer {
		switch (this.type) {
			case "form":
				return { type: "form", step: 1, data: {} }
			case "brainstorm":
				return { type: "brainstorm" }
			case "quadrants":
				return { type: "quadrants" }
			case "sliders":
				return { type: "sliders" }

			default:
				return { type: "unknown" }
		}
	}

	getListResponses(
		conn: Party.Connection,
		msg: Pick<
			ChangeListFieldItemMessage,
			"stepIdx" | "fieldIdx" | "groupIdx" | "label"
		>,
	) {
		if (this.answer.type !== "form") {
			this.sendAndThrow("Expected a form field!", conn)
		}

		// Initialize the list of step answers for this form exercise.
		this.answer.data[conn.id] ??= []
		const steps = this.answer.data[conn.id]!

		// Initialize the answer for this step.
		steps[msg.stepIdx] ??= []
		const stepAnswer = steps[msg.stepIdx]!

		// Initialize the field answer.
		stepAnswer[msg.fieldIdx] ??= { type: "List", groups: [] }
		const fieldAnswer = stepAnswer[msg.fieldIdx]!

		if (fieldAnswer.type !== "List") {
			this.sendAndThrow("Expeceted a list field!", conn)
		}

		// Initialize the group answer. If this is a plain list field,
		// then there is only one group.
		fieldAnswer.groups[msg.groupIdx] ??= { label: msg.label, responses: [] }
		const groupAnswer = fieldAnswer.groups[msg.groupIdx]!

		return groupAnswer.responses
	}

	save = debounce(async () => {
		console.info("Saving exercise data...")

		await Promise.all([
			this.room.storage.put(ANSWER_KEY, this.answer),
			this.room.storage.put(PARTICIPANTS_KEY, this.participants),
		])

		console.info("Saved exercise data.")
	}, 5000)

	// Called receiving a message from a connected client.
	async onMessage(
		message: string | ArrayBuffer | ArrayBufferView,
		conn: Party.Connection<unknown>,
	) {
		if (typeof message !== "string") return
		console.info("Message: ", message)

		const msg = PartyIncomingMessage.parse(JSON.parse(message))

		// Reducer for messages.
		switch (msg.type) {
			case "set-role": {
				this.participants[conn.id] = msg.role
				this.broadcastParticipants()

				break
			}

			case "clear-role": {
				delete this.participants[conn.id]
				this.broadcastParticipants()

				break
			}

			case "change-list-field-item": {
				const responses = this.getListResponses(conn, msg)
				responses[msg.responseIdx] = msg.value

				this.broadcastAnswers()

				break
			}

			case "add-list-field-item": {
				const responses = this.getListResponses(conn, msg)
				responses.push("")

				this.broadcastAnswers()

				break
			}

			default:
				break
		}

		// Save changes to storage every 5 seconds.
		await this.save()
	}

	// Called when the server is started, before first `onConnect` or `onRequest`.
	// Useful for loading data from storage.
	//
	// You can use this to load data from storage and perform other asynchronous
	// initialization, such as retrieving data or configuration from other
	// services or databases.
	async onStart() {
		const storedAnswer = await this.room.storage.get<Answer>("answer")
		const storedParticipants =
			await this.room.storage.get<Participants>("participants")

		this.answer = storedAnswer ?? this.getDefaultAnswer()
		this.participants = storedParticipants ?? {}
	}

	// Called when a plain HTTP request is made to this server.
	// Example: curl http://localhost:1999/parties/main/dig-deeper-stupski::form
	async onRequest(_req: Party.Request) {
		// Respond with the current data.
		return json({
			answer: this.answer,
			participants: this.participants,
		})
	}

	// Called when a new incoming WebSocket connection is opened.
	onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
		console.info("New connection: ", conn.id)

		// Immediately send the current state of the room.
		const msg = this.outMsg({
			type: "init",
			answer: this.answer,
			participants: this.participants,
		})
		conn.send(msg)
	}

	// Called when a WebSocket connection is closed by the client.
	onClose(conn: Party.Connection<unknown>): void | Promise<void> {
		console.info("Disconnected: ", conn.id)
	}
}

UnworkshopServer satisfies Party.Worker
