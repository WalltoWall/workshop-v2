import "server-only"
import React from "react"
import { groq } from "next-sanity"
import { cookies } from "next/headers"
import type { Reference } from "sanity"
import { z } from "zod"
import type { ST } from "@/sanity/types.gen"
import { PARTICIPANT_COOKIE } from "@/constants"
import { sanity } from "./sanity-client"

export const client = {
	findKickoff: React.cache(async (code: string) => {
		type KickoffWithExercises = Omit<ST["kickoff"], "exercises"> & {
			exercises: Array<ST["exercise"]>
		}

		const data = await sanity.fetch<KickoffWithExercises | null>(
			groq`*[_type == "kickoff" && code.current == $code][0] {
                ...,
                exercises[]->
            }`,
			{ code: code.toLowerCase() },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipant: React.cache(
		async <T extends ST["participant"] = ST["participant"]>(id: string) => {
			const data = await sanity.fetch<T | null>(
				groq`*[_type == "participant" && _id == $id][0]`,
				{ id },
				{ cache: "no-store" },
			)

			return data
		},
	),

	findParticipantViaCookie: React.cache(async <
		T extends ST["participant"] = ST["participant"],
	>() => {
		const id = cookies().get(PARTICIPANT_COOKIE)?.value
		if (!id) return null

		type WithKickoffCode = Omit<T, "kickoff"> & {
			kickoff: { code: string }
		}

		const data = await sanity.fetch<WithKickoffCode | null>(
			groq`*[_type == "participant" && _id == $id][0] {
                ...,
                kickoff->{ "code": code.current }
            }`,
			{ id },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipantOrThrow: React.cache(async <
		T extends ST["participant"] = ST["participant"],
	>() => {
		const participantId = z
			.string()
			.parse(cookies().get(PARTICIPANT_COOKIE)?.value)

		const participant = await client.findParticipant<T>(participantId)
		if (!participant) throw new Error("No onboarded participant found.")

		return participant
	}),

	// prettier-ignore
	async findAllParticipantsInExercise<T extends ST["participant"] = ST["participant"]>(exerciseId: string) {
        const participants = await sanity.fetch<Array<T>>(
            groq`*[_type == "participant" && answers[$exerciseId] != null]{
                ...,
                answers
            }`,
            {exerciseId},
            { cache: "no-store" }
        )

        return participants
    },

	async findAllParticipantsInKickoff(kickoffId: string) {
		const participants = await sanity.fetch<Array<ST["participant"]>>(
			groq`*[_type == "participant" && kickoff._ref == $kickoffId]`,
			{ kickoffId },
			{ cache: "no-store" },
		)

		return participants
	},

	async findKickoffOrThrow(code: string) {
		const kickoff = await client.findKickoff(code)
		if (!kickoff) throw new Error("Kickoff not found, when expected.")

		return kickoff
	},

	async registerParticipant(args: {
		name: string
		kickoffId: string
		recoveryCode: string
	}) {
		type Data = Pick<ST["participant"], "name" | "recovery_code" | "_type"> & {
			kickoff: Reference
		}

		const existing = await sanity.fetch<ST["participant"] | null>(
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
		const data: Pick<ST["participant"], "onboarded"> = {
			onboarded: true,
		}

		const res: ST["participant"] = await sanity.patch(id).set(data).commit()

		return res
	},

	async findExerciseBySlug<T extends ST["exercise"] = ST["exercise"]>(
		slug: string,
	) {
		const data = await sanity.fetch<T | null>(
			groq`*[_type == "exercise" && slug.current == $slug][0]{
                    ...,
                }`,
			{ slug },
			{ cache: "no-store" }, // TODO: Note on caching.
		)

		return data
	},
}
