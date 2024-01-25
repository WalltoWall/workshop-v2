import React from "react"
import useYPartyKit from "y-partykit/react"
import { useUsers } from "y-presence"
import { env } from "@/env"
import { USER_COLORS } from "./colors"

export type MultiplayerArgs = {
	exerciseId: string
}

export type MultiplayerData = ReturnType<typeof useMultiplayer>

export const useMultiplayer = (args: MultiplayerArgs) => {
	const provider = useYPartyKit({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: `exercise::${args.exerciseId}`,
		options: { disableBc: env.NODE_ENV !== "production" },
	})

	const awareness = provider.awareness
	const doc = provider.doc

	const users = useUsers(awareness)

	React.useEffect(() => {
		const randomColor =
			USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]

		provider.awareness.setLocalStateField("color", randomColor)
	}, [provider.awareness])

	return { users, provider, awareness, doc }
}
