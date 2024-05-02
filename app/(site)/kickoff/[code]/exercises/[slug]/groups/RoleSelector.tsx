"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import captainIllustration from "@/assets/images/captain-illustration.png"
import contibutorIllustration from "@/assets/images/contributerImage.png"
import { InstructionsModal } from "../InstructionsModal"
import { useGroupParams } from "./hooks"
import { RoleCard } from "./RoleCard"
import type { GroupExercise, Role } from "./types"

interface Props {
	participant: ST.Participant
	exercise: GroupExercise
}

export const RoleSelector = ({ participant, exercise }: Props) => {
	const params = useGroupParams()
	const router = useRouter()

	const group = exercise.groups?.find(
		(g) => g.slug.current === params.groupSlug,
	)
	const groupsHref = `/kickoff/${params.code}/exercises/${params.slug}/groups`

	function onRoleCardClick(role: Role) {
		// actions.setRole({ role, slug: params.groupSlug })
		router.push(`${groupsHref}/${params.groupSlug}`)
	}

	return (
		<div className="flex flex-[1_1_0] flex-col">
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			<div className="mt-4">
				<Text asChild size={16} className="mb-7">
					<div>
						What's your role? - <strong>{group?.name}</strong> -{" "}
						<Link href={groupsHref} className="text-gray-19 underline">
							(Wrong group?)
						</Link>
					</div>
				</Text>

				<div className="flex flex-col gap-4">
					<RoleCard
						role="contributor"
						onClick={onRoleCardClick}
						img={contibutorIllustration}
						name="Contributor"
						instructions="I’ll add in my two-cents."
					/>
					<RoleCard
						role="captain"
						onClick={onRoleCardClick}
						img={captainIllustration}
						name="Captain"
						instructions="I’ll lead and write for my group."
					/>
				</div>
			</div>
		</div>
	)
}

export default RoleSelector
