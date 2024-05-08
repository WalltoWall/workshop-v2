"use client"

import React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Arrow } from "@/components/icons/Arrow"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import { COLORS } from "@/lib/constants"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type * as ST from "@/sanity/types.gen"
import { useMultiplayerSliders } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/use-multiplayer-sliders"
import { GraphView } from "./GraphView"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"

interface PresenterViewProps {
	exercise: ST.Exercise
}

export const SlidersPresenterViewClient = ({
	exercise,
}: PresenterViewProps) => {
	const [color, setColor] = React.useState("#fecb2f")
	const [showImages, setShowImages] = React.useState(true)
	const [showNumbers, setShowNumbers] = React.useState(true)
	const [showGraph, setShowGraph] = React.useState(false)
	const [showLines, setShowLines] = React.useState(false)
	const [showTodayBar, setShowTodayBar] = React.useState(true)
	const [showTomorrowBar, setShowTomorrowBar] = React.useState(true)
	const [sliderIndex, setSliderIndex] = React.useState(0)

	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1
	const currentSliderSlug = exercise.sliders?.[stepIdx].slug.current

	if (!currentSliderSlug) throw new Error("Error: No slug for current slider")

	const { snap } = useMultiplayerSliders({
		exerciseId: exercise._id,
		slug: currentSliderSlug,
	})

	const participants = snap.participants

	const allStepAnswers = Object.values(participants).map((answers) => {
		const answer = answers[currentSliderSlug]

		return { today: answer.today, tomorrow: answer.tomorrow }
	})

	if (!exercise.sliders) return

	const slider = exercise.sliders[sliderIndex]
	const isDisabledLeft = sliderIndex <= 0
	const isDisabledRight = exercise.sliders.length <= sliderIndex + 1

	return (
		<>
			{showGraph ? (
				<GraphView
					color={color}
					showLines={showLines}
					answers={allStepAnswers}
					leftText={slider.left_value}
					rightText={slider.right_value}
					isDisabledLeft={isDisabledLeft}
					isDisabledRight={isDisabledRight}
					setSliderIndex={setSliderIndex}
				/>
			) : (
				<div>
					<SlidersKey barColor={color} key={color} />

					{slider && (
						<div key={slider._key} className="relative mb-6 mt-12 w-full">
							<div className="h-[45vh] w-full overflow-hidden rounded-t-3xl border-b-[0.667rem] border-black">
								{isFilled.image(slider.left_image) &&
									showImages &&
									isFilled.image(slider.right_image) && (
										<div className="flex h-full w-full bg-black">
											{isFilled.image(slider.left_image) && (
												<div className="w-full">
													<Image
														src={urlFor(slider.left_image).url()!}
														alt={altFor(slider.left_image)}
														className="h-full w-full object-cover object-center opacity-50"
														width={300}
														height={300}
													/>
												</div>
											)}

											{isFilled.image(slider.right_image) && (
												<div className="w-full">
													<Image
														src={urlFor(slider.right_image).url()!}
														alt={altFor(slider.right_image)}
														className="h-full w-full object-cover object-center opacity-50"
														width={300}
														height={300}
													/>
												</div>
											)}
										</div>
									)}

								<SlidersBars
									answers={allStepAnswers}
									barColor={color}
									showNumbers={showNumbers}
									showImages={showImages}
									showToday={showTodayBar}
									showTomorrow={showTomorrowBar}
								/>
							</div>

							<div className="mt-10 flex w-full items-end justify-between">
								<Text className="ml-1 uppercase text-40 font-heading capsize">
									{slider.left_value}
								</Text>
								<Text className="ml-1 uppercase text-40 font-heading capsize">
									{slider.right_value}
								</Text>
							</div>
						</div>
					)}
				</div>
			)}
			<div className="relative">
				{!showGraph && (
					<div className="flex items-center justify-center gap-5">
						<button
							onClick={() => {
								if (isDisabledLeft) return

								setSliderIndex((idx) => idx - 1)
							}}
							disabled={isDisabledLeft}
							className="disabled:opacity-50"
						>
							<span className="sr-only">Previous Slider</span>
							<Arrow className="w-7 text-gray-50" />
						</button>

						<button
							onClick={() => {
								if (isDisabledRight) return

								setSliderIndex((idx) => idx + 1)
							}}
							disabled={isDisabledRight}
							className="disabled:opacity-50"
						>
							<span className="sr-only">Next Slider</span>
							<Arrow className="w-7 rotate-180 text-gray-50" />
						</button>
					</div>
				)}

				<SettingsMenu>
					{!showGraph && (
						<>
							<SettingVisibility
								label="Photos"
								isVisible={showImages}
								toggleVisibility={() => setShowImages((prev) => !prev)}
							/>
							<SettingVisibility
								label="Numbers"
								isVisible={showNumbers}
								toggleVisibility={() => setShowNumbers((prev) => !prev)}
							/>
							<SettingVisibility
								label="Show Today"
								isVisible={showTodayBar}
								toggleVisibility={() => setShowTodayBar((prev) => !prev)}
							/>
							<SettingVisibility
								label="Show Tomorrow"
								isVisible={showTomorrowBar}
								toggleVisibility={() => setShowTomorrowBar((prev) => !prev)}
							/>
						</>
					)}

					{showGraph && (
						<SettingVisibility
							label="Show Lines"
							isVisible={showLines}
							toggleVisibility={() => setShowLines((prev) => !prev)}
						/>
					)}

					<SettingVisibility
						label="Show Dots View"
						isVisible={showGraph}
						toggleVisibility={() => setShowGraph((prev) => !prev)}
					/>

					<Text size={12} className="block pt-2 text-white">
						{showGraph ? "Dot Color" : "Bar Color"}
					</Text>
					<CirclePicker
						color={color}
						colors={COLORS}
						circleSize={20}
						circleSpacing={8}
						width="7.5rem"
						onChange={(newColor) => setColor(newColor.hex)}
					/>
				</SettingsMenu>
			</div>
		</>
	)
}

export default SlidersPresenterViewClient
