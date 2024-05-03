"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import captainIllustration from "@/assets/images/captain-illustration.png"
import contibutorIllustration from "@/assets/images/contributerImage.png"
import { useGroupContext } from "@/groups/group-context"
import type { GroupRole } from "@/groups/messages"
import { InstructionsModal } from "../InstructionsModal"
import { useGroupParams } from "./hooks"
import { RoleCard } from "./RoleCard"

interface Props {
	exercise: ST.Exercise
}

export const RoleSelector = ({ exercise }: Props) => {
	const params = useGroupParams()
	const router = useRouter()
	const { actions } = useGroupContext()

	const group = exercise.groups?.find(
		(g) => g.slug.current === params.groupSlug,
	)
	const href = `/kickoff/${params.code}/exercises/${params.slug}/groups`

	function onRoleCardClick(role: GroupRole) {
		actions.send({ type: "set-role", role })
		router.push(`${href}/${params.groupSlug}`)
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
						<Link href={href} className="text-gray-19 underline">
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
