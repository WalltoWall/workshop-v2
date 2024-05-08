"use client"

import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react"
import React, { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowButton } from "@/components/ArrowButton"
import { Button } from "@/components/Button"
import { CirclePicker } from "@/components/CirclePicker"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import { PresentQuadrant } from "./PresentQuadrant"

interface PresenterViewProps {
	exercise: ST.Exercise
}

const colors = [
	"#ff5745",
	"#ff7a45",
	"#ffe54a",
	"#19f49b",
	"#5c6dff",
	"#b652f7",
	"#ff93ea",
]

export const QuadrantsPresenterViewClient = ({
	exercise,
}: PresenterViewProps) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	const { actions } = useMultiplayerQuadrants({
		exerciseId: exercise._id,
	})

	const answers = actions.getAllAnswers()

	const [isPending, startTransition] = React.useTransition()

	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
	})
	const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
	const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
	const [animating, setAnimating] = React.useState(false)
	const [showToday, setShowToday] = React.useState(true)
	const [showTomorrow, setShowTomorrow] = React.useState(true)
	const [showLines, setShowLines] = React.useState(true)
	const [showPhotos, setShowPhotos] = React.useState(true)
	const [showLabels, setShowLabels] = React.useState(true)
	const [color, setColor] = React.useState("#5c6dff")

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
			router.push(pathname + "?" + params.toString())
		})
	}

	const scrollNext = () => {
		const params = new URLSearchParams({
			step: (step + 1).toString(),
		})

		router.push(pathname + "?" + params.toString())
	}

	const animatePoints = () => {
		setAnimating(true)

		setTimeout(() => {
			setAnimating(false)
		}, 4000)
	}

	return exercise.quadrants ? (
		<div className="relative h-full">
			<Button
				className="absolute -right-1 -top-5 z-10 cursor-pointer"
				onClick={animatePoints}
				disabled={animating}
			>
				{animating ? (
					<>
						<Spinner className="mt-[3px] w-[1.125rem]" />
						Animating
					</>
				) : (
					"Animate"
				)}
			</Button>

			<div className="h-full overflow-hidden" ref={emblaRef}>
				<div className="flex h-full">
					{exercise.quadrants.map((quadrant) => (
						<div key={quadrant.name} className="min-w-0 [flex:0_0_100%]">
							<PresentQuadrant
								quadrant={quadrant}
								answers={answers[quadrant.slug.current]}
								showLines={showLines}
								showPhotos={showPhotos}
								showLabels={showLabels}
								color={color}
								showToday={showToday}
								showTomorrow={showTomorrow}
								animating={animating}
							/>
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

			<div className="fixed bottom-7 left-7 rounded-2xl bg-black px-5 py-4 text-white">
				<div className="mb-2 flex items-center">
					<span
						className="block h-6 w-6 rounded-full border-4"
						style={{
							borderColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						Today
					</Text>
				</div>

				<div className="flex items-center">
					<span
						className="block h-6 w-6 rounded-full"
						style={{
							backgroundColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						Tomorrow
					</Text>
				</div>
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
					label="Lines"
					isVisible={showLines}
					toggleVisibility={() => setShowLines((prev) => !prev)}
				/>
				<SettingVisibility
					label="Photos"
					isVisible={showPhotos}
					toggleVisibility={() => setShowPhotos((prev) => !prev)}
				/>
				<SettingVisibility
					label="Labels"
					isVisible={showLabels}
					toggleVisibility={() => setShowLabels((prev) => !prev)}
				/>
				<Text size={12} className="block pt-2 text-white">
					Dot Colors
				</Text>
				<CirclePicker
					color={color}
					colors={colors}
					className="w-[6.5rem]"
					onColorClick={setColor}
				/>
			</SettingsMenu>
		</div>
	) : null
}

export default QuadrantsPresenterViewClient
