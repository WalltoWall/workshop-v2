"use client"

import { UndoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"
import { useGroupContext } from "@/groups/group-context"
import { useGroupParams } from "./groups/hooks"

interface RoleHeaderProps {
	className?: string
	participantId: string
	groupName: string
}

export const RoleHeader = ({
	className,
	participantId,
	groupName,
}: RoleHeaderProps) => {
	const params = useGroupParams()
	const { actions, participants } = useGroupContext()
	const router = useRouter()

	const role = participants[participantId] ?? "contributor"

	const onClick = () => {
		actions.send({ type: "clear-role", id: participantId })
		router.push(
			`/kickoff/${params.code}/exercises/${params.slug}/groups/${params.groupSlug}/role`,
		)
	}

	return (
		<div
			className={cx(
				"relative flex items-center justify-center gap-1 bg-gray-50 py-4 pl-4 pr-10 text-white",
				className,
			)}
		>
			<PencilCircle className="mr-1 w-5" />
			<Text size={16}>
				{role === "contributor" ? (
					<>
						You are a <strong>contributor</strong> of{" "}
						<strong>{groupName}</strong>.
					</>
				) : (
					<>
						You are the <strong>captain</strong> of <strong>{groupName}</strong>
						.
					</>
				)}
			</Text>

			<button className="absolute right-4" onClick={onClick}>
				<span className="sr-only">Clear role.</span>
				<UndoIcon className="h-4 w-4" />
			</button>
		</div>
	)
}
