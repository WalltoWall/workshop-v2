"use client"

import usePartySocket from "partysocket/react"
import React from "react"
import type PartySocket from "partysocket"
import { toast } from "sonner"
import type * as ST from "@/sanity/types.gen"
import { env } from "@/env"
import type {
	Answer,
	Participants,
	PartyIncomingMessage,
	PartyOutgoingMessage,
} from "@/party/types"
import type { GroupRole } from "./messages"

interface Actions {
	send: (message: PartyIncomingMessage) => void
}

export interface GroupContextValue {
	ws: PartySocket
	answer: Answer
	actions: Actions
	participants: Participants
	role?: GroupRole
}

const GroupContext = React.createContext<GroupContextValue>(undefined!)

interface Props {
	children: React.ReactNode
	slug: string
	type: ST.Exercise["type"]
	participantId: string
}

export const GroupProvider = ({
	slug,
	type,
	children,
	participantId,
}: Props) => {
	const [connected, setConnected] = React.useState(false)
	const [answer, setAnswer] = React.useState<Answer>({ type: "unknown" })
	const [participants, setParticipants] = React.useState<Participants>({})

	const ws = usePartySocket({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: `${slug}::${type}`,
		id: participantId,

		onOpen: () => setConnected(true),
		onClose: () => setConnected(false),
		onMessage: (e) => {
			const msg = JSON.parse(e.data) as PartyOutgoingMessage

			switch (msg.type) {
				case "init":
					setAnswer(msg.answer)
					setParticipants(msg.participants)
					break

				case "participants":
					setParticipants(msg.participants)
					break

				case "answer":
					setAnswer(msg.answer)
					break

				case "error":
					toast.error(msg.error)
					break

				default:
					break
			}
		},
	})
	const actions = React.useMemo(
		() => ({
			send: (message: PartyIncomingMessage) => ws.send(JSON.stringify(message)),
		}),
		[ws],
	)

	const value: GroupContextValue = React.useMemo(
		() => ({
			ws,
			answer,
			participants,
			actions,
			role: participants[participantId],
		}),
		[ws, answer, participants, actions, participantId],
	)

	if (!connected || answer.type === "unknown") return null

	return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export const useGroupContext = () => {
	const value = React.useContext(GroupContext)
	if (!value) {
		throw new Error("useGroupContext must be used within a GroupProvider.")
	}

	return value
}
