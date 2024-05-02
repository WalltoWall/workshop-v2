"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { client } from "@/sanity/client"

const CodeSchema = z
	.string()
	.length(7, "Code must be 7 characters in length.")
	.transform((val) => {
		const code = val.toLowerCase()

		return code.slice(0, 3) + "-" + code.slice(3)
	})

export async function checkCodeAction(
	_prevState: { error: string },
	data: FormData,
) {
	const result = CodeSchema.safeParse(data.get("code"))
	if (!result.success) {
		const msg = result.error.format()._errors.join(";")

		return { error: msg }
	}

	const code = result.data
	const kickoff = await client.findKickoff(code)

	if (!kickoff) {
		return { error: "Kickoff does not exist." }
	}

	redirect(`/kickoff/${result.data}`)
}
