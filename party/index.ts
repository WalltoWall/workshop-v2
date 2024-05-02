import type * as Party from "partykit/server"
import { z } from "zod"

const AddMessage = z.object({ type: z.literal("add") })
const RemoveMessage = z.object({ type: z.literal("remove") })

const Message = z.union([AddMessage, RemoveMessage])

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	get exerciseId() {
		const [, exerciseId] = this.room.id.split("::")

		return exerciseId
	}

	// Called when the server is started, before first `onConnect` or `onRequest`.
	// Useful for loading data from storage.
	//
	// You can use this to load data from storage and perform other asynchronous
	// initialization, such as retrieving data or configuration from other
	// services or databases.
	async onStart() {
		// this.messages = (await this.room.storage.get<string[]>("messages")) ?? []
	}

	// Called receiving a message from a client, or another connected party.
	onMessage(
		message: string | ArrayBuffer | ArrayBufferView,
		sender: Party.Connection<unknown>,
	) {
		if (typeof message !== "string") return

		const result = Message.safeParse(JSON.parse(message))
		if (!result.success) return

		const data = result.data

		switch (data.type) {
			case "add":
				break

			case "remove":
				break

			default:
				return
		}
	}

	// Called when a new incoming WebSocket connection is opened.
	onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {}

	// Called when a WebSocket connection is closed by the client.
	onClose(connection: Party.Connection<unknown>): void | Promise<void> {}
}

Server satisfies Party.Worker
