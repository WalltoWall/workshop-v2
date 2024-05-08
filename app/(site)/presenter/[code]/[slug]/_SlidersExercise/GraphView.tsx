import { ArrowLeft, ArrowRight } from "lucide-react"
import React from "react"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/Button"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"

const MotionButton = motion(Button)

export interface GraphViewProps {
	color: string
	showLines: boolean
	answers: Array<{ today: number; tomorrow: number }>
	leftText: string
	rightText: string
	setSliderIndex: React.Dispatch<React.SetStateAction<number>>
	isDisabledLeft: boolean
	isDisabledRight: boolean
}

const AxisBar = (props: { color: string }) => (
	<div className="h-20" style={{ backgroundColor: props.color }} />
)

const arrowCns = {
	left: "left-[17px] top-[-2.5px] origin-right border-b-[12px] border-r-[12px] border-t-[12px] border-b-transparent border-t-transparent",
	right:
		"right-[17px] top-[-2.5px] origin-left border-b-[12px] border-l-[12px] border-t-[12px] border-b-transparent border-t-transparent",
}

const Line = (props: {
	color: string
	col: [start: number, end: number]
	row: [start: number, end: number]
}) => {
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

export const GraphView = ({
	color,
	showLines,
	answers,
	leftText,
	rightText,
	setSliderIndex,
	isDisabledLeft,
	isDisabledRight,
}: GraphViewProps) => {
	const [isTomorrow, setIsTomorrow] = React.useState(false)

	return (
		<div className="relative flex h-full grow flex-col">
			<div className="flex justify-between">
				{/* TODO: Share component with other "dot" view */}
				<div className="rounded-2xl bg-black px-5 py-4 text-white">
					<div className="mb-2 flex items-center">
						<span
							className="block h-6 w-6 rounded-full border-[3px] bg-white"
							style={{ borderColor: color }}
						/>
						<Text className="ml-2 uppercase text-24 font-heading capsize">
							<span style={{ color: color }}>Today</span>
						</Text>
					</div>

					<div className="flex items-center">
						<span
							className="block h-6 w-6 rounded-full"
							style={{ backgroundColor: color }}
						/>
						<Text className="ml-2 uppercase text-24 font-heading capsize">
							<span style={{ color: color }}>Tomorrow</span>
						</Text>
					</div>
				</div>

				<AnimatePresence initial={false}>
					{!showLines && (
						<MotionButton
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							initial={{ opacity: 0 }}
							onClick={() => setIsTomorrow((p) => !p)}
						>
							{isTomorrow ? (
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
				className="grid grow grid-cols-[repeat(6,20px)] content-between gap-x-[calc((100%-120px)/5)] py-4"
				style={{ gridTemplateRows: `repeat(${answers.length}, 20px)` }}
			>
				<AnimatePresence>
					{showLines &&
						answers.map((answer, idx) => (
							<Line
								key={"line-" + idx}
								color={color}
								col={[answer.today, answer.tomorrow]}
								row={[idx + 1, idx + 1]}
							/>
						))}

					{answers.map((answer, idx) => (
						<motion.div
							key={"dot-" + idx}
							layout
							layoutDependency={isTomorrow}
							className="relative h-5 w-5 rounded-full border-[3px]"
							initial={false}
							transition={{ type: "spring", duration: 2, bounce: 0.05 }}
							animate={{ backgroundColor: isTomorrow ? color : "#fff" }}
							style={{
								gridColumn: isTomorrow ? answer.tomorrow : answer.today,
								gridRow: idx + 1,
								borderColor: color,
							}}
						/>
					))}

					{showLines &&
						answers.map((answer, idx) => (
							<motion.div
								key={"line-dot-" + idx}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, transition: { delay: 0.25 } }}
								transition={{ duration: 0.25 }}
								className="relative h-5 w-5 rounded-full border-[3px]"
								style={{
									backgroundColor: isTomorrow ? "#fff" : color,
									gridColumn: isTomorrow ? answer.today : answer.tomorrow,
									gridRow: idx + 1,
									borderColor: color,
								}}
							/>
						))}
				</AnimatePresence>
			</div>

			<div className="relative -mb-8 grid grid-cols-[repeat(6,20px)] gap-x-[calc((100%-120px)/5)]">
				<AxisBar color={color} />
				<AxisBar color={color} />
				<AxisBar color={color} />
				<AxisBar color={color} />
				<AxisBar color={color} />
				<AxisBar color={color} />
			</div>

			<div className="h-2 bg-black" />
		</div>
	)
}
