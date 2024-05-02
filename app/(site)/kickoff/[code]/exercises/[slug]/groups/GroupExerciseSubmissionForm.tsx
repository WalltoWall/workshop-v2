"use client"

import React from "react"
import { useRouter } from "next/navigation"
import type { Participant } from "@/sanity/types.gen"
import { InstructionsModal } from "../InstructionsModal"
import { RoleHeader } from "../RoleHeader"
import { useGroupParams } from "./hooks"
import type { Group, GroupExercise, Role } from "./types"

interface Props {
	participant: Participant
	exercise: GroupExercise
	children?: React.ReactNode
}

export const GroupExerciseSubmissionForm = ({
	participant,
	exercise,
	children,
}: Props) => {
	const params = useGroupParams()
	const router = useRouter()

	// const groupParticipants: Group | undefined = snap.groups?.[params.groupSlug]
	// const role: Role | undefined = groupParticipants?.[participant._id]
	const group = exercise.groups?.find(
		(g) => g.slug.current === params.groupSlug,
	)

	const onRoleHeaderClear = () => {
		// actions.setRole({ slug: params.groupSlug, role: "unset" })
		router.push(
			`/kickoff/${params.code}/exercises/${params.slug}/groups/${params.groupSlug}/role`,
		)
	}

	return (
		<div className="flex flex-[1_1_0] flex-col">
			{group && (
				<RoleHeader
					className="-mx-7 -mt-3.5 mb-7"
					onClearClick={onRoleHeaderClear}
				>
					You are the <strong>captain</strong> of <strong>{group.name}</strong>.
				</RoleHeader>
			)}

			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			{children}
		</div>
	)
}
