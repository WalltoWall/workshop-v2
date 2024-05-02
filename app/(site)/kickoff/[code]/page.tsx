import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { Scroller } from "./Scroller"

interface Props {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffOnboardingPage = async (props: Props) => {
	const participant = await client.findParticipantViaCookie()
	const code = props.params.code

	if (!participant) redirect(`/kickoff/register?code=${code}`)
	if (participant.onboarded) redirect(`/kickoff/${code}/exercises`)

	async function onboard() {
		"use server"

		if (!participant) return

		await client.onboardParticipant(participant._id)
		redirect(`/kickoff/${code}/exercises`)
	}

	return (
		<div className="flex grow flex-col justify-between">
			<div>
				<h1>
					<Text asChild style="heading" size={64}>
						<div>Welcome</div>
					</Text>

					<Text asChild style="serif" size={56} className="mt-5">
						<div>{participant.name}</div>
					</Text>
				</h1>

				<Text
					style="copy"
					size={12}
					className="mt-4 block text-gray-50 underline"
					asChild
				>
					<Link href={`/kickoff/register?code=${code}`}>Not you?</Link>
				</Text>
			</div>

			<form
				action={onboard}
				className="relative flex grow flex-col py-10 text-center"
			>
				<Scroller />
			</form>
		</div>
	)
}

export function generateMetadata(props: Props): Metadata {
	return {
		title: `${props.params.code} - UnWorkshop`,
	}
}

export default KickoffOnboardingPage
