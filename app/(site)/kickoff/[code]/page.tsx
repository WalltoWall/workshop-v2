import type { Metadata } from "next"
import { onboardParticipant } from "@/sanity/client"
import { redirect } from "next/navigation"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { Scroller } from "./Scroller"
import { getParticipantOrThrow } from "@/lib/getParticipantOrThrow"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffPage = async (props: Props) => {
	const participant = await getParticipantOrThrow()

	if (participant.onboarded) redirect(`/kickoff/${props.params.code}/exercises`)

	async function onboard() {
		"use server"

		await onboardParticipant(participant._id)
		redirect(`/kickoff/${props.params.code}/exercises`)
	}

	return (
		<LightLayout mainClassName="mt-2">
			<div>
				<Text asChild style="heading" size={56} className="max-w-[276px]">
					<h1>Welcome, {participant.name}</h1>
				</Text>

				<Text style="copy" size={12} className="mt-4 text-gray-50 underline">
					Not you?
				</Text>
			</div>

			<form
				action={onboard}
				className="relative flex grow flex-col py-10 text-center"
			>
				<Scroller />
			</form>
		</LightLayout>
	)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	return {
		title: `${props.params.code} - W|W Workshop`,
	}
}

export default KickoffPage
