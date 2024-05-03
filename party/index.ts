import type * as Party from "partykit/server"
import { z } from "zod"
import type { BrainstormAnswer } from "@/exercises/brainstorm/types"
import type { FormAnswer } from "@/exercises/form/types"
import type { QuadrantsAnswer } from "@/exercises/quadrants/types"
import type { SliderAnswer } from "@/exercises/sliders/types"
import {
	ClearRoleMessage,
	SetRoleMessage,
	type GroupRole,
} from "@/groups/messages"
import { json } from "./party-utils"

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

const PartyIncomingMessage = z.union([SetRoleMessage, ClearRoleMessage])
export type PartyIncomingMessage = z.infer<typeof PartyIncomingMessage>

type InitMessage = { type: "init"; answer: Answer; participants: Participants }
type ParticipantsOutgoingMessage = {
	type: "participants"
	participants: Participants
}
type AnswerOutgoingMessage = { type: "answer"; answer: Answer }

export type PartyOutgoingMessage =
	| InitMessage
	| ParticipantsOutgoingMessage
	| AnswerOutgoingMessage

export type Participants = Record<string, GroupRole>

export default class Server implements Party.Server {
	// The recorded answers for the exercise.
	answer: Answer = { type: "unknown" }

	// The group or participant ids mapped to their role.
	participants: Participants = {}

	constructor(readonly room: Party.Room) {}

	get type() {
		const [, type] = this.room.id.split("::")

		return TypeSchema.parse(type)
	}

	outMsg(msg: PartyOutgoingMessage): string {
		return JSON.stringify(msg)
	}

	broadcastParticipants() {
		const outMsg = this.outMsg({
			type: "participants",
			participants: this.participants,
		})
		this.room.broadcast(outMsg)
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

		this.answer = storedAnswer ?? { type: this.type }
		this.participants = storedParticipants ?? {}
	}

	// Called when a plain HTTP request is made to this server.
	async onRequest(_req: Party.Request) {
		const data = {
			answer: this.answer,
			participants: this.participants,
		}
		// Respond with the current data.
		return json(data)
	}

	// Called receiving a message from a connected client.
	onMessage(
		message: string | ArrayBuffer | ArrayBufferView,
		conn: Party.Connection<unknown>,
	) {
		if (typeof message !== "string") return
		console.info("Message: ", message)

		const result = PartyIncomingMessage.safeParse(JSON.parse(message))
		if (!result.success) return

		const msg = result.data

		// Perform the appropriate tasks needed for the message type.
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

			default:
				break
		}
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

Server satisfies Party.Worker
