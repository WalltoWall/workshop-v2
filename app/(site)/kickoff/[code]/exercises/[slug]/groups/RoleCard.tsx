import Image, { type StaticImageData } from "next/image"
import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import type { Role } from "./types"

interface Props {
	role: Exclude<Role, "unset">
	onClick: (role: Role) => void
	className?: string
	name: string
	instructions: string
	img: StaticImageData
}

export const RoleCard = ({
	role,
	onClick,
	className,
	name,
	instructions,
	img,
}: Props) => {
	return (
		<button
			className={cx(
				"relative flex min-h-[200px] flex-col rounded-lg border border-black p-4 text-left transition duration-200 focus-within:border-green-40 focus-within:bg-green-40 hover:border-green-40 hover:bg-green-40",
				className,
			)}
			onClick={() => onClick(role)}
		>
			<Image src={img} alt="" className="absolute right-2 top-2" />

			<Text
				asChild
				size={32}
				className="relative mt-auto uppercase font-heading"
			>
				<h3>{name}</h3>
			</Text>

			<Text size={16} className="relative mt-3">
				{instructions}
			</Text>
		</button>
	)
}
