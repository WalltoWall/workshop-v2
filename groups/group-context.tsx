"use client"

import usePartySocket from "partysocket/react"
import React from "react"
import type PartySocket from "partysocket"
import type * as ST from "@/sanity/types.gen"
import { env } from "@/env"
import type {
	Answer,
	Participants,
	PartyIncomingMessage,
	PartyOutgoingMessage,
} from "@/party"

function createActions(ws: PartySocket) {
	const actions = {
		send: (message: PartyIncomingMessage) => ws.send(JSON.stringify(message)),
	}

	return actions
}

type Actions = ReturnType<typeof createActions>

export interface GroupContextValue {
	ws: PartySocket
	answer: Answer
	actions: Actions
	participants: Participants
}

const GroupContext = React.createContext<GroupContextValue>(undefined!)

interface Props {
	children: React.ReactNode
	slug: string
	type: ST.Exercise["type"]
}

export const GroupProvider = ({ slug, type, children }: Props) => {
	const [connected, setConnected] = React.useState(false)
	const [answer, setAnswer] = React.useState<Answer>({ type: "unknown" })
	const [participants, setParticipants] = React.useState<Participants>({})

	const ws = usePartySocket({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: `${slug}::${type}`,

		onOpen: () => setConnected(true),
		onClose: () => setConnected(false),
		onMessage: (e) => {
			const msg = JSON.parse(e.data) as PartyOutgoingMessage

			switch (msg.type) {
				case "init":
					setAnswer(msg.answer)
					setParticipants(msg.participants)
					break

				case "participant-update":
					setParticipants(msg.participants)
					break

				case "answer-update":
					setAnswer(msg.answer)
					break

				default:
					break
			}
		},
	})

	const value: GroupContextValue = React.useMemo(
		() => ({ ws, answer, participants, actions: createActions(ws) }),
		[ws, answer, participants],
	)

	// TODO: Loading Indicator
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
