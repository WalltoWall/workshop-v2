import type * as Party from "partykit/server"
import { debounce } from "perfect-debounce"
import type { FormField } from "@/exercises/form/messages"
import {
	type FormFieldAnswer,
	type ListFieldAnswer,
	type NarrowFieldAnswer,
	type TaglineFieldAnswer,
	type TextFieldAnswer,
} from "@/exercises/form/types"
import {
	ExerciseType,
	PartyIncomingMessage,
	type Answer,
	type Participants,
	type PartyOutgoingMessage,
} from "./types"
import { json } from "./utils"

const ANSWER_KEY = "answer"
const PARTICIPANTS_KEY = "participants"

export default class UnworkshopServer implements Party.Server {
	// The recorded answers for the exercise.
	answer: Answer = { type: "unknown" }

	// The group or participant ids mapped to their role.
	participants: Participants = {}

	constructor(readonly room: Party.Room) {}

	get type() {
		const [, type] = this.room.id.split("::")

		return ExerciseType.parse(type)
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
				return { type: "brainstorm", step: 1 }
			case "quadrants":
				return { type: "quadrants", step: 1 }
			case "sliders":
				return { type: "sliders", step: 1 }

			default:
				return { type: "unknown" }
		}
	}

	getFormFieldAnswer<T extends FormFieldAnswer>(
		conn: Party.Connection,
		msg: FormField,
		init: T,
	) {
		if (this.answer.type !== "form") {
			this.sendAndThrow("Expected a form field!", conn)
		}

		// Initialize the list of step answers for this form exercise.
		this.answer.data[msg.id] ??= []
		const steps = this.answer.data[msg.id]!

		// Initialize the answer for this step.
		steps[msg.stepIdx] ??= []
		const stepAnswer = steps[msg.stepIdx]!

		// Initialize the field answer.
		stepAnswer[msg.fieldIdx] ??= init
		const fieldAnswer = stepAnswer[msg.fieldIdx]!

		if (fieldAnswer.type !== init.type) {
			this.sendAndThrow(`Expeceted a ${init.type} field!`, conn)
		}

		return fieldAnswer as T
	}

	getListResponses(
		conn: Party.Connection,
		msg: FormField & { label?: string; groupIdx: number },
	) {
		const fieldAnswer = this.getFormFieldAnswer<ListFieldAnswer>(conn, msg, {
			type: "List",
			groups: [],
		})

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
			// Shared Messages
			case "go-to-step": {
				if (this.answer.type === "unknown") return
				this.answer.step = msg.value

				this.broadcastAnswers()

				break
			}

			// Group Messages
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

			// Form Messages
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

			case "change-tagline-field-item": {
				const fieldAnswer = this.getFormFieldAnswer<TaglineFieldAnswer>(
					conn,
					msg,
					{ type: "Tagline", responses: [] },
				)
				fieldAnswer.responses[msg.responseIdx] = msg.value

				this.broadcastAnswers()

				break
			}

			case "add-tagline-field-item": {
				const fieldAnswer = this.getFormFieldAnswer<TaglineFieldAnswer>(
					conn,
					msg,
					{ type: "Tagline", responses: [] },
				)
				fieldAnswer.responses.push("")

				this.broadcastAnswers()

				break
			}

			case "change-text-field": {
				const fieldAnswer = this.getFormFieldAnswer<TextFieldAnswer>(
					conn,
					msg,
					{ type: "Text", response: "" },
				)
				fieldAnswer.response = msg.value

				this.broadcastAnswers()

				break
			}

			case "set-narrow-field-item": {
				const fieldAnswer = this.getFormFieldAnswer<NarrowFieldAnswer>(
					conn,
					msg,
					{ type: "Narrow", responses: [] },
				)

				// If this message already exists in the array, remove it.
				if (fieldAnswer.responses.includes(msg.value)) {
					fieldAnswer.responses = fieldAnswer.responses.filter(
						(resp) => resp !== msg.value,
					)
				} else {
					// Otherwise, add it to the list.
					fieldAnswer.responses.push(msg.value)
				}

				this.broadcastAnswers()

				break
			}

			default:
				// @ts-expect-error - This should error if all cases are being handled.
				this.sendAndThrow("Unimplemented message type: " + msg.type, conn)
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
