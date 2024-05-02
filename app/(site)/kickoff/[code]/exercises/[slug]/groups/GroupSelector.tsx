"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"

interface Props {
	groups: ST.Exercise["groups"]
}

export const GroupSelector = ({ groups }: Props) => {
	const pathname = usePathname()

	return (
		<div className="my-4">
			<Text size={16}>Tap on or select the group you are assigned to.</Text>

			<div className="mt-7 flex flex-col gap-2">
				{groups?.map((group) => (
					<Link
						key={group._key}
						href={pathname + "/" + group.slug.current + "/role"}
						className="flex items-center justify-between rounded-lg bg-gray-90 px-3 py-5 transition leading-none focus-within:bg-green-40 hover:bg-green-40 focus:bg-green-40"
					>
						<Text size={32} style="heading">
							{group.name}
						</Text>

						<Arrow className="w-5 rotate-180" />
					</Link>
				))}
			</div>
		</div>
	)
}
