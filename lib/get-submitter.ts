import type * as ST from "@/sanity/types.gen"

type Args = {
	id: string
	participantsById: Record<string, ST.Participant>
	groups?: ST.Exercise["groups"]
}

export function getSubmitter({ id, groups = [], participantsById }: Args) {
	if (groups.length >= 1) {
		const group = groups.find((g) => g.slug.current === id)
		if (!group) throw new Error("Could not find group for id: " + id)

		return {
			name: group.name,
			id,
		}
	}

	const participant = participantsById[id]
	if (!participant) throw new Error("Could not find participant for id: " + id)

	return {
		name: participant.name,
		id,
	}
}
