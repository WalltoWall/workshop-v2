"use client"

import usePartySocket from "partysocket/react"
import React from "react"
import { useParams } from "next/navigation"
import type PartySocket from "partysocket"
import { toast } from "sonner"
import { z } from "zod"
import type * as ST from "@/sanity/types.gen"
import { env } from "@/env"
import type {
	Answer,
	Participants,
	PartyIncomingMessage,
	PartyOutgoingMessage,
} from "@/party/types"
import type { GroupRole } from "./messages"

export interface Actions {
	send: (message: PartyIncomingMessage) => void
}

export interface GroupContextValue {
	ws: PartySocket
	answer: Answer
	actions: Actions
	participants: Participants
	role?: GroupRole

	/** Participant or group ID */
	id: string
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
	const params = useParams()
	const groupSlug = z.string().optional().parse(params.groupSlug)

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
			id: groupSlug || participantId,
		}),
		[ws, answer, participants, actions, participantId, groupSlug],
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
