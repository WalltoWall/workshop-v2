import React from "react"
import { cx } from "class-variance-authority"
import clsx from "clsx"
import { SanityImage } from "@/components/SanityImage"
import { Text } from "@/components/Text"
import { showContributorWarning } from "@/lib/show-contributor-warning"
import { isFilled, type MaybeSanityImage } from "@/sanity/helpers"
import type { Actions } from "@/groups/group-context"
import { DEFAULT_TODAY, DEFAULT_TOMORROW } from "../constants"
import type { SliderStep, SliderStepAnswer } from "../types"
import { RangeInput } from "./RangeInput"

const FULL_RANGE = 6

interface RangeSliderProps {
	label: string
	leftLabel: string
	rightLabel: string
	readOnly?: boolean
	value: number
	onChange?: React.ChangeEventHandler<HTMLInputElement>
	onClick?: React.MouseEventHandler<HTMLInputElement>
	leftImage?: MaybeSanityImage
	rightImage?: MaybeSanityImage
	className?: string
}
const RangeSlider = ({
	label,
	leftLabel,
	rightLabel,
	readOnly,
	value,
	onChange,
	leftImage,
	rightImage,
	className,
	onClick,
}: RangeSliderProps) => {
	const leftToday = (value - 1) / (FULL_RANGE - 1)
	const rightToday = 1 - leftToday

	const leftFontSize = `${value * 10}px`
	const rightFontSize = `${(value * 10 - 70) * -1}px`

	return (
		<div className={cx("rounded-lg bg-gray-97 p-4", className)}>
			<Text>{label}</Text>

			<div className="relative mt-3 flex h-32 justify-between overflow-hidden rounded-lg">
				{isFilled.image(leftImage) && isFilled.image(rightImage) ? (
					<>
						<div className="h-32 w-1/2 bg-black">
							<SanityImage
								image={leftImage}
								className="h-full w-full object-cover object-center opacity-100 duration-300"
								aspectRatio={1}
								style={{
									opacity: 1.1 - value / 10,
									filter: `grayScale(${leftToday * 100 + "%"})`,
								}}
							/>
						</div>

						<div className="h-32 w-1/2 bg-black">
							<SanityImage
								image={rightImage}
								className="h-full w-full object-cover object-center opacity-100 duration-300"
								aspectRatio={1}
								style={{
									opacity: 0.4 + value / 10,
									filter: `grayScale(${rightToday * 100 + "%"})`,
								}}
							/>
						</div>
					</>
				) : (
					<>
						<div
							className="flex h-full min-w-min items-center justify-center bg-pink-85 px-2 text-center transition-[width]"
							style={{ width: leftToday * 100 + "%" }}
						>
							<p
								className={clsx(
									"uppercase transition-all font-heading",
									value === 1 && "rotate-[-90deg]",
								)}
								style={{ fontSize: leftFontSize }}
							>
								{rightLabel}
							</p>
						</div>

						<div
							className="flex h-full min-w-min items-center justify-center bg-green-78 px-2 text-center transition-[width]"
							style={{ width: rightToday * 100 + "%" }}
						>
							<p
								className={clsx(
									"w-full uppercase transition font-heading",
									value === 6 && "rotate-90",
								)}
								style={{ fontSize: rightFontSize }}
							>
								{leftLabel}
							</p>
						</div>
					</>
				)}
			</div>

			<RangeInput
				className="mt-6"
				name="todayValue"
				min={1}
				max={FULL_RANGE}
				value={value}
				readOnly={readOnly}
				onChange={onChange}
				onClick={onClick}
			/>

			<div className="mt-4 flex justify-between text-gray-50">
				<Text>{leftLabel}</Text>
				<Text>{rightLabel}</Text>
			</div>
		</div>
	)
}

interface Props {
	slider: SliderStep
	id: string
	stepAnswer?: SliderStepAnswer
	readOnly: boolean
	actions: Actions
	stepIdx: number
	className?: string
}

export const SliderPair = ({
	slider,
	stepAnswer,
	actions,
	readOnly,
	id,
	stepIdx,
	className,
}: Props) => {
	function onClick() {
		if (readOnly) showContributorWarning()
	}

	function onTodayChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (readOnly) return

		actions.send({
			type: "update-slider",
			pairType: "today",
			value: e.target.valueAsNumber,
			id,
			stepIdx,
		})
	}
	function onTomorrowChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (readOnly) return

		actions.send({
			type: "update-slider",
			pairType: "tomorrow",
			value: e.target.valueAsNumber,
			id,
			stepIdx,
		})
	}

	return (
		<div className={cx(className, "flex flex-col gap-4")}>
			<Text asChild>
				<h3>{slider.question_text}</h3>
			</Text>

			<RangeSlider
				label={slider.today_text}
				leftLabel={slider.left_value}
				rightLabel={slider.right_value}
				readOnly={readOnly}
				value={stepAnswer?.today ?? DEFAULT_TODAY}
				leftImage={slider.left_image}
				rightImage={slider.right_image}
				onClick={onClick}
				onChange={onTodayChange}
			/>

			<RangeSlider
				label={slider.tomorrow_text}
				leftLabel={slider.left_value}
				rightLabel={slider.right_value}
				readOnly={readOnly}
				value={stepAnswer?.tomorrow ?? DEFAULT_TOMORROW}
				leftImage={slider.left_image}
				rightImage={slider.right_image}
				onClick={onClick}
				onChange={onTomorrowChange}
			/>
		</div>
	)
}
