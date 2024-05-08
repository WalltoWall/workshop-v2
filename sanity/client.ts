// import "server-only"
import React from "react"
import { groq } from "next-sanity"
import { cookies } from "next/headers"
import type { Reference } from "sanity"
import type * as ST from "@/sanity/types.gen"
import { PARTICIPANT_COOKIE } from "@/constants"
import { sanity } from "./sanity-client"

export const client = {
	findKickoff: React.cache(async (code: string) => {
		const kickoffQuery = groq`*[_type == "kickoff" && code.current == $code][0] {
            ...,
            exercises[]->
        }`

		const data = await sanity.fetch<ST.KickoffQueryResult>(
			kickoffQuery,
			{ code: code.toLowerCase() },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipant: React.cache(async (id: string) => {
		const participantQuery = groq`*[_type == "participant" && _id == $id][0] {
			...,
			kickoff->
		}`

		const data = await sanity.fetch<ST.ParticipantQueryResult>(
			participantQuery,
			{ id },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipantViaCookie: React.cache(async () => {
		const id = cookies().get(PARTICIPANT_COOKIE)?.value
		if (!id) return null

		return client.findParticipant(id)
	}),

	findParticipantOrThrow: React.cache(async () => {
		const participant = await client.findParticipantViaCookie()
		if (!participant) throw new Error("No participant found.")

		return participant
	}),

	findAllParticipantsInExercise: React.cache(async (exerciseId: string) => {
		const participants = await sanity.fetch<ST.Participant[]>(
			groq`*[_type == "participant" && answers[$exerciseId] != null]{
                ...,
                answers
            }`,
			{ exerciseId },
			{ cache: "no-store" },
		)

		return participants
	}),

	findAllParticipantsInKickoff: React.cache(async (kickoffId: string) => {
		const participantsInKickoffQuery = groq`*[_type == "participant" && kickoff._ref == $kickoffId]`

		const participants =
			await sanity.fetch<ST.ParticipantsInKickoffQueryResult>(
				participantsInKickoffQuery,
				{ kickoffId },
				{ cache: "no-store" },
			)

		return participants
	}),

	findKickoffOrThrow: React.cache(async (code: string) => {
		const kickoff = await client.findKickoff(code)
		if (!kickoff) throw new Error("Kickoff not found, when expected.")

		return kickoff
	}),

	async registerParticipant(args: {
		name: string
		kickoffId: string
		recoveryCode: string
	}) {
		type Data = Pick<ST.Participant, "name" | "recovery_code" | "_type"> & {
			kickoff: Reference
		}

		const existing = await sanity.fetch<ST.Participant | null>(
			groq`*[_type == "participant" && recovery_code == $name && kickoff._ref == $kickoffId][0]`,
			{ name: args.name, kickoffId: args.kickoffId },
			{ cache: "no-store" },
		)

		if (existing) return existing

		const data: Data = {
			_type: "participant",
			name: args.name,
			recovery_code: args.recoveryCode,
			kickoff: {
				_type: "reference",
				_weak: true,
				_ref: args.kickoffId,
			},
		}

		const res = await sanity.create(data)

		return res
	},

	async onboardParticipant(id: string) {
		const data: Pick<ST.Participant, "onboarded"> = {
			onboarded: true,
		}

		await sanity.patch(id).set(data).commit()
	},

	findExerciseBySlug: React.cache(async (slug: string) => {
		const data = await sanity.fetch<ST.Exercise | null>(
			groq`*[_type == "exercise" && slug.current == $slug][0]{
                    ...,
                }`,
			{ slug },
			{ cache: "no-store" },
		)

		return data
	}),
}
