import type { Metadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { uid } from "uid"
import { zfd } from "zod-form-data"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import registerIllustration from "@/assets/images/register-illustration.jpg"
import { PARTICIPANT_COOKIE } from "@/constants"
import { RegisterInput } from "./RegisterInput"

const RegisterSchema = zfd.formData({ name: zfd.text() })

interface Props {
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffRegisterPage = async ({ searchParams }: Props) => {
	const code = searchParams.code
	if (typeof code !== "string") notFound()

	const [kickoff, participant] = await Promise.all([
		client.findKickoff(code),
		client.findParticipantViaCookie(),
	])

	const isRegisteredAndOnboarded =
		participant?.kickoff.code.current === code && participant?.onboarded

	if (!kickoff) notFound()
	if (isRegisteredAndOnboarded) redirect(`/kickoff/${code}/exercises`)

	async function registerAction(data: FormData) {
		"use server"

		const form = RegisterSchema.parse(data)
		const participant = await client.registerParticipant({
			name: form.name,
			kickoffId: kickoff!._id,
			recoveryCode: uid(6),
		})

		cookies().set({
			name: PARTICIPANT_COOKIE,
			value: participant._id,
			httpOnly: true,
			maxAge: 604800, // 7 days
		})

		redirect(`/kickoff/${code}`)
	}

	return (
		<div className="flex grow flex-col justify-between">
			<div className="flex flex-col gap-3">
				<Text style="heading" size={64} className="!normal-case">
					{kickoff.greeting}
				</Text>

				<div className="flex w-full flex-wrap items-center">
					<Text size={64} style="heading" className="!normal-case">
						Let's
					</Text>

					<div className="ml-3 flex items-center">
						<Logo className="-mr-1.5 w-[53px] rotate-6" />
						<Text size={64} style="heading" className="!normal-case">
							ravel
						</Text>
					</div>
				</div>

				<Text size={64} style="heading" className="!normal-case">
					your brand.
				</Text>
			</div>

			<Image
				src={registerIllustration}
				alt=""
				placeholder="blur"
				className="mt-4"
			/>

			<form
				action={registerAction}
				className="mt-8 flex flex-col items-center text-center"
			>
				<Text style="heading" size={24} asChild className="text-green-40">
					<h2>Let's get started</h2>
				</Text>

				<RegisterInput />

				<Text style="copy" size={12} className="mt-3 text-black/50">
					Don't worry, your answers will be anonymous.
				</Text>
			</form>
		</div>
	)
}

export const metadata: Metadata = {
	title: "Register - UnWorkshop",
}

export default KickoffRegisterPage
