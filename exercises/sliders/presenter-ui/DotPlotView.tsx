import { ArrowLeft, ArrowRight } from "lucide-react"
import React from "react"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import type {
	DotPlotViewSettings,
	SliderStep,
	SliderStepAnswer,
} from "../types"

const MotionButton = motion(Button)

const arrowCns = {
	left: "left-[17px] top-[-2.5px] origin-right border-b-[12px] border-r-[12px] border-t-[12px] border-b-transparent border-t-transparent",
	right:
		"right-[17px] top-[-2.5px] origin-left border-b-[12px] border-l-[12px] border-t-[12px] border-b-transparent border-t-transparent",
}

interface LineProps {
	color: string
	col: [start: number, end: number]
	row: [start: number, end: number]
}

const Line = (props: LineProps) => {
	const duration = 1.5
	const bounce = 0
	const delay = 0.65

	const colStart = Math.min(props.col[0], props.col[1])
	const colEnd = Math.max(props.col[0], props.col[1])

	const shouldShowArrow = colEnd !== colStart
	const arrowDirection = props.col[0] < props.col[1] ? "right" : "left"

	return (
		<motion.div
			className="relative h-full w-full"
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			style={{
				gridColumnStart: colStart,
				gridColumnEnd: colEnd + 1,
				gridRowStart: props.row[0],
				gridRowEnd: props.row[1],
			}}
		>
			<motion.svg
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				className="h-full w-full"
				style={{ rotate: arrowDirection === "left" ? 180 : 0 }}
			>
				<motion.line
					x1={0}
					x2={100}
					y1={50}
					y2={50}
					strokeWidth={20}
					stroke={props.color}
					initial={{ pathLength: 0 }}
					animate={{
						pathLength: 1,
						transition: { type: "spring", duration, bounce, delay },
					}}
					exit={{
						pathLength: 0,
						transition: { type: "spring", duration, bounce },
					}}
				/>
			</motion.svg>

			{shouldShowArrow && (
				<motion.div
					className={cx("absolute h-0 w-0", arrowCns[arrowDirection])}
					initial={{ opacity: 0, scaleX: 0 }}
					animate={{
						opacity: 1,
						scaleX: 1,
						transition: {
							type: "spring",
							delay: duration,
							bounce,
							duration: 0.25,
						},
					}}
					exit={{
						opacity: 0,
						scaleX: 0,
						transition: { scaleX: { duration: 0 } },
					}}
					style={{
						borderLeftColor: props.color,
						borderRightColor: props.color,
					}}
				/>
			)}
		</motion.div>
	)
}

const AxisBar = (props: { color: string }) => (
	<div className="h-20" style={{ backgroundColor: props.color }} />
)

interface Props {
	settings: DotPlotViewSettings
	slider: SliderStep
	stepAnswers: Array<SliderStepAnswer>
	toggleTomorrow: () => void
}

export const DotPlotView = ({
	settings,
	stepAnswers,
	toggleTomorrow,
}: Props) => {
	return (
		<div className="flex grow flex-col gap-8">
			<div className="flex justify-between">
				<div
					className="space-y-2 rounded-2xl bg-black px-5 py-4 text-white"
					style={{ color: settings.color }}
				>
					<div className="flex items-center gap-3">
						<div
							className="size-6 rounded-full border-[3px] bg-white"
							style={{ borderColor: settings.color }}
						/>
						<Text style="heading" size={24}>
							Today
						</Text>
					</div>

					<div className="flex items-center gap-3">
						<div
							className="size-6 rounded-full"
							style={{ backgroundColor: settings.color }}
						/>

						<Text style="heading" size={24}>
							Tomorrow
						</Text>
					</div>
				</div>

				<AnimatePresence initial={false}>
					{!settings.lines && (
						<MotionButton
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							onClick={toggleTomorrow}
						>
							{settings.tomorrow ? (
								<>
									<ArrowLeft className="mt-0.5 h-5 w-5" />
									See Today
								</>
							) : (
								<>
									See Tomorrow
									<ArrowRight className="mt-0.5 h-5 w-5" />
								</>
							)}
						</MotionButton>
					)}
				</AnimatePresence>
			</div>

			<div
				className="grid grow grid-cols-[repeat(6,20px)] content-between gap-x-[calc((100%-120px)/5)] p-4"
				style={{ gridTemplateRows: `repeat(${stepAnswers.length}, 20px)` }}
			>
				<AnimatePresence>
					{settings.lines &&
						stepAnswers.map((answer, idx) => (
							<Line
								key={"line-" + idx}
								color={settings.color}
								col={[answer.today, answer.tomorrow]}
								row={[idx + 1, idx + 1]}
							/>
						))}

					{stepAnswers.map((answer, idx) => (
						<motion.div
							key={"dot-" + idx}
							layout
							layoutDependency={settings.tomorrow}
							className="relative h-5 w-5 rounded-full border-[3px]"
							initial={false}
							transition={{ type: "spring", duration: 2, bounce: 0.05 }}
							animate={{
								backgroundColor: settings.tomorrow ? settings.color : "#fff",
							}}
							style={{
								gridColumn: settings.tomorrow ? answer.tomorrow : answer.today,
								gridRow: idx + 1,
								borderColor: settings.color,
							}}
						/>
					))}

					{settings.lines &&
						stepAnswers.map((answer, idx) => (
							<motion.div
								key={"line-dot-" + idx}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, transition: { delay: 0.25 } }}
								transition={{ duration: 0.25 }}
								className="relative h-5 w-5 rounded-full border-[3px]"
								style={{
									backgroundColor: settings.tomorrow ? "#fff" : settings.color,
									gridColumn: settings.tomorrow
										? answer.today
										: answer.tomorrow,
									gridRow: idx + 1,
									borderColor: settings.color,
								}}
							/>
						))}
				</AnimatePresence>
			</div>

			<div className="relative -mb-16 grid grid-cols-[repeat(6,20px)] gap-x-[calc((100%-120px)/5)] px-4">
				<AxisBar color={settings.color} />
				<AxisBar color={settings.color} />
				<AxisBar color={settings.color} />
				<AxisBar color={settings.color} />
				<AxisBar color={settings.color} />
				<AxisBar color={settings.color} />
			</div>

			<div className="h-2.5 bg-black" />
		</div>
	)
}
