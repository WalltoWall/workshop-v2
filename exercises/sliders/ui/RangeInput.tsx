import { cx } from "class-variance-authority"

export const RangeInput = ({
	className,
	readOnly,
	...props
}: React.ComponentPropsWithoutRef<"input">) => {
	return (
		<div className={cx("relative h-3 rounded-[10px] bg-gray-75", className)}>
			<div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1">
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
				<div className="h-1.5 w-1.5 rounded-full bg-gray-50" />
			</div>

			<input
				type="range"
				readOnly={readOnly}
				className={cx(
					readOnly &&
						"[&::-webkit-slider-thumb]:cursor-not-allowed [&::-webkit-slider-thumb]:bg-gray-82 [&::-webkit-slider-thumb]:bg-[url('/slider-arrows-read-only.svg')]",
					"absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent focus:outline-0 active:outline-0 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:bg-[url('/slider-arrows.svg')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:shadow-md",
				)}
				{...props}
			/>
		</div>
	)
}
