import { client } from "@/sanity/client"
import { PresenterHeader } from "./PresenterHeader"

interface Props {
	params: { code: string }
	children: React.ReactNode
}

const PresenterKickoffLayout = async (props: Props) => {
	const kickoff = await client.findKickoffOrThrow(props.params.code)
	const exercises = kickoff.exercises ?? []

	return (
		<div className="flex h-svh flex-col">
			<PresenterHeader kickoffCode={props.params.code} exercises={exercises} />

			<main id="main" className="grow p-8">
				{props.children}
			</main>
		</div>
	)
}

export default PresenterKickoffLayout
