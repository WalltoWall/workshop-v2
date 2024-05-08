import Image from "next/image"
import Link from "next/link"
import { cx } from "class-variance-authority"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"
import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"
import formIllustration from "@/assets/images/form-illustration.png"
import slidersIllustration from "@/assets/images/sliders-illustration.jpg"

const VARIANTS = {
	brainstorm: {
		gradientClassName: "from-[#4BEEE1] to-[#E477D1]",
		imageSrc: brainstormIllustration,
		imageClassName:
			"-translate-y-[3%] translate-x-[28%] -rotate-[17deg] mix-blend-multiply h-[128%]",
	},
	sliders: {
		gradientClassName: "from-[#E561D0] to-[#EA892C]",
		imageSrc: slidersIllustration,
		imageClassName:
			"mix-blend-multiply h-[175%] translate-x-[27%] -translate-y-[3%]",
	},
	quadrants: {
		gradientClassName: "from-[#4BEEE1] to-[#90E477]",
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
	form: {
		gradientClassName: "from-[#FA927F] to-[#D7F082]",
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
}

export type CardVariant = keyof typeof VARIANTS

class CardVariantSequence {
	idx = 0

	constructor(public sequence: CardVariant[]) {}

	next() {
		const color = this.sequence[this.idx % this.sequence.length]!
		this.idx++

		return color
	}

	nextVariant() {
		const color = this.next()

		return VARIANTS[color]
	}
}

interface Props {
	name: string
	href: string
}

const sequence = new CardVariantSequence([
	"form",
	"sliders",
	"quadrants",
	"brainstorm",
])

export const ExerciseCard = ({ name, href }: Props) => {
	const variant = sequence.nextVariant()

	return (
		<Link
			href={href}
			className={cx(
				"relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r",
				variant.gradientClassName,
			)}
			suppressHydrationWarning
		>
			<div className="self-end pb-4 pl-3">
				<Text style="heading" size={24}>
					{name}
				</Text>

				<div className="mt-2 flex items-center gap-1">
					<Text style="copy" size={16}>
						Start Exercise
					</Text>

					<Arrow className="w-3 rotate-180" />
				</div>
			</div>

			<Image
				src={variant.imageSrc}
				alt=""
				placeholder="blur"
				suppressHydrationWarning
				className={cx(
					"absolute right-0 top-0 object-contain",
					variant.imageClassName,
				)}
			/>
		</Link>
	)
}
