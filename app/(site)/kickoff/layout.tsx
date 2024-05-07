import { client } from "@/sanity/client"
import { ParticipantModal } from "./[code]/exercises/ParticipantModal"
import { LogoLink } from "./LogoLink"

const UnregisterLink = async () => {
	const participant = await client.findParticipantViaCookie()
	if (!participant) return null

	return (
		<ParticipantModal
			participantName={participant.name}
			heading="Not You?"
			message="Press the confirm button to re-register under a new name."
		/>
	)
}

interface Props {
	children: React.ReactNode
}

const KickoffLayout = (props: Props) => {
	return (
		<div className="bg-white">
			<div className="mx-auto flex min-h-svh w-full max-w-[32rem] flex-col bg-white px-7 pb-16 text-black">
				<header className="flex items-center gap-2 bg-white py-5">
					<LogoLink />
					<UnregisterLink />
				</header>

				<main id="main" className="flex grow flex-col">
					{props.children}
				</main>
			</div>
		</div>
	)
}

export default KickoffLayout
