import clsx from "clsx"
import { Text, type TextVariants } from "@/components/Text"
import { sanitizeString } from "../utils"

interface Props {
	responses: string[]
	answers: Array<string | undefined>
	className?: string
	size?: TextVariants["size"]
	validClassName?: string
	invalidClassName?: string
	itemClassName?: string
}

export const HighlightedResponses = ({
	answers: _answers,
	responses,
	className,
	size = 12,
	validClassName = "bg-gray-90",
	invalidClassName = "bg-red-57",
	itemClassName,
}: Props) => {
	const answers = new Set(
		_answers
			.filter(Boolean)
			.map(sanitizeString)
			.flatMap((a) => a.split(" ")),
	)

	return (
		<ul className={clsx(className, "flex flex-wrap gap-2")}>
			{responses.map((resp, idx) => {
				const badWords = sanitizeString(resp).split(" ")
				const invalid = badWords.some((bWord) => answers.has(bWord))

				return (
					<Text
						asChild
						key={idx}
						size={size}
						style="copy"
						className={clsx(
							"rounded-lg p-3",
							itemClassName,
							invalid ? invalidClassName : validClassName,
						)}
					>
						<li>{resp}</li>
					</Text>
				)
			})}
		</ul>
	)
}
