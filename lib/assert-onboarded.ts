import { redirect } from "next/navigation"
import type * as ST from "@/sanity/types.gen"

export function assertOnboarded(
	participant: ST.ParticipantQueryResult | null | undefined,
	kickoff: NonNullable<ST.KickoffQueryResult>,
): asserts participant is NonNullable<ST.ParticipantQueryResult> {
	const code = kickoff.code.current

	const redirectToRegister = () => redirect("/kickoff/register?code=" + code)

	if (!participant) redirectToRegister()
	if (participant?.kickoff._id !== kickoff._id) redirectToRegister()
	if (!participant?.onboarded) redirect(`/kickoff/${code}`)
}
