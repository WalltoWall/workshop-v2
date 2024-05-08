import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"

interface Props {
	children?: React.ReactNode
	className?: string
}

export const FinalizeBanner = ({
	children = "Please, finalize your answers",
	className,
}: Props) => (
	<Text
		style="heading"
		size={18}
		className={cx(className, "rounded-2xl bg-gray-97 px-8 py-6 text-center")}
	>
		{children}
	</Text>
)
