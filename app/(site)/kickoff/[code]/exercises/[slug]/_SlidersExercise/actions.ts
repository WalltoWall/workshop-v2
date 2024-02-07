"use server"

import { revalidatePath } from "next/cache"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import { type SlidersParticipant } from "./types"

const submitSliderSchema = zfd.formData({
	isGroup: zfd.checkbox(),
	exerciseId: zfd.text(),
	slug: zfd.text(),
	todayValue: zfd.numeric(),
	tomorrowValue: zfd.numeric(),
})

// TODO: Error Handling
export async function submitSliderAction(formData: FormData) {
	const data = submitSliderSchema.parse(formData)

	const participant = await client.findParticipantOrThrow<SlidersParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? {}
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
			}
		: { type: "individual" as const }

	const answers: SlidersParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: {
				...oldAnswers,
				[data.slug]:{today: data.todayValue, tomorrow: data.tomorrowValue}
			},
		},
	}

	await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
