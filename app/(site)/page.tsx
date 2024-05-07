import type { Viewport } from "next"
import { redirect } from "next/navigation"
import { Text } from "@/components/Text"
import { UnworkshopTitle } from "@/components/UnworkshopTitle"
import { CodeSchema } from "@/lib/shared-validators"
import { client } from "@/sanity/client"
import { CodeForm } from "./CodeForm"
import { IntroLayout } from "./IntroLayout"

async function action(_prevState: { error: string }, data: FormData) {
	"use server"

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

const Home = () => {
	return (
		<IntroLayout.Dark>
			<div className="mx-auto">
				<UnworkshopTitle className="w-[15.625rem]" />
			</div>

			<div className="space-y-4 px-4 pb-10 pt-8 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<CodeForm action={action} />
			</div>
		</IntroLayout.Dark>
	)
}

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#000",
}

export default Home
