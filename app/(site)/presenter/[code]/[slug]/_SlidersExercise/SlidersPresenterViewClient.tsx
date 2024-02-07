"use client"

import React, { useEffect } from "react"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import Image from "next/image"
import { cx } from "class-variance-authority"
import { altFor, isFilled, urlFor } from "@/sanity/helpers"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import { SlidersBars } from "./SlidersBars"
import { SlidersKey } from "./SlidersKey"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react"
import { Arrow } from "@/components/icons/Arrow"
import { Spinner } from "@/components/Spinner"

import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { CirclePicker } from "react-color"



interface PresenterViewProps {
	exercise: ST["exercise"]
	answers: Answer[]
}

const colors = [
	"#ff5745",
	"#ff7a45",
	"#fecb2f",
	"#19f49b",
	"#5c6dff",
	"#b652f7",
	"#ff93ea",
]

export const SlidersPresenterViewClient = ({
	exercise,
	answers,
}: PresenterViewProps) => {
	
	const [color, setColor] = React.useState("#fecb2f")
	const [showPhotos, setShowPhotos] = React.useState(true)
	const [showToday, setShowToday] = React.useState(true)
	const [showTomorrow, setShowTomorrow] = React.useState(true)
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const [isPending, startTransition] = React.useTransition()
	const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
	const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
	})
	const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev())
		setNextBtnDisabled(!emblaApi.canScrollNext())
	}, [])

	useEffect(() => {
		if (!emblaApi) return

		onSelect(emblaApi)

		emblaApi.on("reInit", onSelect)
		emblaApi.on("select", onSelect)
	}, [emblaApi, onSelect])

	useEffect(() => {
		if (!emblaApi) return

		emblaApi.scrollTo(step - 1)
	}, [step, emblaApi])

	const scrollPrev = () => {
		const params = new URLSearchParams({
			step: (step - 1).toString(),
		})

		startTransition(() => {
			router.push(pathname + "?" + params.toString(), { scroll: false })
		})
	}

	const scrollNext = () => {
		const params = new URLSearchParams({
			step: (step + 1).toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}


	return exercise.sliders ? (
		<div className="px-12 mx-8 relative"
		style={{
			width: "calc(100% - 4rem)"
		}}
		>
			<SlidersKey/>
			<div className="h-full overflow-hidden" ref={emblaRef}>
				<div className="flex h-full">
					{exercise.sliders.map((slider) => (
						<div key={slider._key} className="mt-12 mb-6 relative w-full min-w-0 [flex:0_0_100%]">
							<div className="w-full h-[50vh] rounded-t-3xl overflow-hidden border-b-[0.666rem] border-black">

									{(isFilled.image(slider.left_image) && isFilled.image(slider.right_image)) && (
										<div className="flex w-full h-full transition-[background] duration-300"
										style={{
											background: showPhotos ? "black" : "transparent"
										}}>
											{isFilled.image(slider.left_image) && (
													<div className="w-full">
														<Image
															src={urlFor(slider.left_image).url()!}
															alt={altFor(slider.left_image)}
															className="object-cover opacity-50 object-center h-full w-full"
															width={300}
															height={300}
															style={{
																display: showPhotos ? "block" : "none"
															}}
														/>
													</div>
											)}
											{isFilled.image(slider.right_image) && (
												<div className="w-full">
													<Image
														src={urlFor(slider.right_image).url()!}
														alt={altFor(slider.right_image)}
														className="object-cover opacity-50 object-center h-full w-full"
														width={300}
														height={300}
														style={{
															display: showPhotos ? "block" : "none"
														}}
													/>
												</div>
											)}
										</div>
									)}
									
									{/* David: Not sure what type to make the slider prop */}
									<SlidersBars showToday={showToday} showTomorrow={showTomorrow} color={color} answers={answers} slider={slider} images={(isFilled.image(slider.left_image) && isFilled.image(slider.right_image))}/>

							</div>
							
							<div className="w-full flex justify-between items-end mt-10">
								<Text className="ml-1 uppercase text-40 font-heading capsize">{slider.left_value}</Text>
								<Text className="ml-1 uppercase text-40 font-heading capsize">{slider.right_value}</Text>
							</div>
						</div>
					))}
				</div>
			</div>
			<div>
				<ArrowButton
					direction="prev"
					disabled={prevBtnDisabled}
					onClick={scrollPrev}
					loading={isPending}
				/>
				<ArrowButton
					direction="next"
					disabled={nextBtnDisabled}
					onClick={scrollNext}
					loading={isPending}
				/>
			</div>

			<SettingsMenu>
				<SettingVisibility
					label="Today"
					isVisible={showToday}
					toggleVisibility={() => setShowToday((prev) => !prev)}
				/>
				<SettingVisibility
					label="Tomorrow"
					isVisible={showTomorrow}
					toggleVisibility={() => setShowTomorrow((prev) => !prev)}
				/>
				
				<SettingVisibility
					label="Photos"
					isVisible={showPhotos}
					toggleVisibility={() => setShowPhotos((prev) => !prev)}
				/>
				{/* 
				<SettingVisibility
					label="Labels"
					isVisible={showLabels}
					toggleVisibility={() => setShowLabels((prev) => !prev)}
				/> */}
				<Text size={12} className="block pt-2 text-white">
					Bar Colors
				</Text>
				<CirclePicker
					color={color}
					colors={colors}
					circleSize={20}
					circleSpacing={8}
					width="7.5rem"
					onChange={(newColor) => setColor(newColor.hex)}
				/>
			</SettingsMenu>
		</div>
	) : null
}

const ArrowButton = ({
	direction,
	onClick,
	disabled,
	loading,
}: {
	direction: "prev" | "next"
	onClick: () => void
	disabled: boolean
	loading?: boolean
}) => (
	<button
		type="button"
		onClick={onClick}
		className={cx(
			"absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-38 disabled:bg-gray-50",
			direction === "prev" ? "left-0 rotate-180" : "right-0",
		)}
		disabled={disabled}
	>
		<span className="sr-only">
			{direction === "next" ? "Next Quadrant" : "Previous Quadrant"}
		</span>
		{loading ? <Spinner /> : <Arrow />}
	</button>
)
