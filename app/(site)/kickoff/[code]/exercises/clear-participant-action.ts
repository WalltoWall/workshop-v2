"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PARTICIPANT_COOKIE } from "@/constants"

export async function clearParticipantAction(code: string) {
	cookies().delete(PARTICIPANT_COOKIE)

	redirect("/kickoff/register?code=" + code)
}
