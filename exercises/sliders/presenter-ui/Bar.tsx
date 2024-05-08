import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import styles from "./Bar.module.css"

interface Props {
	children?: React.ReactNode
	variant: "solid" | "striped"
	height?: React.CSSProperties["height"]
}

export const Bar = ({ variant, children, height = "100%" }: Props) => {
	return (
		<div className="flex w-full flex-col justify-end gap-3 text-center">
			<Text size={24} style="heading" className="whitespace-pre">
				{children}{" "}
			</Text>

			<div
				className={cx(
					styles[variant],
					styles.bar,
					"min-h-4 border-2 border-b-0 border-solid",
				)}
				style={{ height }}
			/>
		</div>
	)
}
