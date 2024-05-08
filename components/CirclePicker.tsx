import { cx } from "class-variance-authority"
import { COLORS } from "@/lib/constants"

interface Props {
	color: string
	colors?: string[]
	onColorClick?: (color: string) => void
	className?: string
}

export const CirclePicker = ({
	color,
	colors = COLORS,
	className,
	onColorClick,
}: Props) => {
	return (
		<div className={cx(className, "flex flex-wrap gap-2")}>
			{colors.map((c) => (
				<button
					key={c}
					className={cx(
						"aspect-square w-5 rounded-full border-[3px] border-solid transition duration-200 ease-out hover:scale-[1.2]",
						color === c && "!bg-transparent",
					)}
					style={{ backgroundColor: c, borderColor: c }}
					onClick={() => onColorClick?.(c)}
				>
					<span className="sr-only">Change to color: {c}</span>
				</button>
			))}
		</div>
	)
}
