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
		<>
			<PresenterHeader kickoffCode={props.params.code} exercises={exercises} />
			{props.children}
		</>
	)
}

export default PresenterKickoffLayout
