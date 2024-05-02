import type * as Party from "partykit/server"
import { z } from "zod"
import { json } from "./party-utils"

const TypeSchema = z.union([
	z.literal("form"),
	z.literal("brainstorm"),
	z.literal("quadrants"),
	z.literal("sliders"),
])

export type FormAnswer = { type: "form" }
export type BrainstormAnswer = { type: "brainstorm" }
export type QuadrantsAnswer = { type: "quadrants" }
export type SliderAnswer = { type: "sliders" }
export type Answer =
	| FormAnswer
	| BrainstormAnswer
	| QuadrantsAnswer
	| SliderAnswer
	| { type: "unknown" }

const Role = z.union([z.literal("captain"), z.literal("contributor")])
export type Role = z.infer<typeof Role>

const SetRoleMessage = z.object({
	type: z.literal("set-role"),
	role: Role,
	id: z.string(),
})
const ClearRoleMessage = z.object({
	type: z.literal("clear-role"),
	id: z.string(),
})

const PartyMessage = z.union([SetRoleMessage, ClearRoleMessage])
export type PartyIncomingMessage = z.infer<typeof PartyMessage>

type InitMessage = { type: "init"; answer: Answer; participants: Participants }
type ParticipantUpdateMessage = {
	type: "participant-update"
	participants: Participants
}
type AnswerUpdateMessage = { type: "answer-update"; answer: Answer }
export type PartyOutgoingMessage =
	| InitMessage
	| ParticipantUpdateMessage
	| AnswerUpdateMessage

export type Participants = Record<string, Role>

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

	outMsg(msg: PartyOutgoingMessage) {
		return JSON.stringify(msg)
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
		// Respond with the current reaction counts
		return json(JSON.stringify(this.answer))
	}

	// Called receiving a message from a connected client.
	onMessage(
		message: string | ArrayBuffer | ArrayBufferView,
		_sender: Party.Connection<unknown>,
	) {
		if (typeof message !== "string") return
		console.info("Message: ", message)

		const result = PartyMessage.safeParse(JSON.parse(message))
		if (!result.success) return

		const msg = result.data

		// Perform the appropriate tasks needed for the message type.
		switch (msg.type) {
			case "set-role": {
				this.participants[msg.id] = msg.role

				const outMsg = this.outMsg({
					type: "participant-update",
					participants: this.participants,
				})
				this.room.broadcast(outMsg)

				break
			}

			case "clear-role": {
				delete this.participants[msg.id]

				const outMsg = this.outMsg({
					type: "participant-update",
					participants: this.participants,
				})
				this.room.broadcast(outMsg)

				break
			}

			default:
				break
		}
	}

	// Called when a new incoming WebSocket connection is opened.
	onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
		console.info("New connection: ", conn.id)

		// Immediately send them the current state of the room.
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
