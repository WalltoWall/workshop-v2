import Image from "next/image"
import type { ST } from "@/sanity/config"
import { altFor, urlFor, type SanityImage } from "@/sanity/helpers"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { QuadrantAnswer } from "./QuadrantAnswer"

interface PresentQuadrantProps {
	quadrant: NonNullable<ST["exercise"]["quadrants"]>[number]
	answers: Answer[]
	showToday: boolean
	showTomorrow: boolean
	showLines: boolean
	showPhotos: boolean
	showLabels: boolean
	color: string
	animating: boolean
}

export const PresentQuadrant = ({
	quadrant,
	answers,
	showToday,
	showTomorrow,
	showLines,
	showPhotos,
	showLabels,
	color,
	animating,
}: PresentQuadrantProps) => {
	return (
		<div className="relative h-full px-52 py-12">
			{showLabels && (
				<>
					<h3 className="absolute left-1/2 top-0 -translate-x-1/2 uppercase text-24 font-heading">
						{quadrant.topValue}
					</h3>
					<h3 className="absolute bottom-0 left-1/2 -translate-x-1/2 uppercase text-24 font-heading">
						{quadrant.bottomValue}
					</h3>
					<h3 className="absolute right-[calc(100%-12rem)] top-1/2 -translate-y-1/2 uppercase text-24 font-heading">
						{quadrant.leftValue}
					</h3>
					<h3 className="absolute left-[calc(100%-12rem)] top-1/2 -translate-y-1/2 uppercase text-24 font-heading">
						{quadrant.rightValue}
					</h3>
				</>
			)}

			<div className="relative grid h-full w-full grid-cols-2">
				<div className="flex items-center justify-center border-b-4 border-r-4 border-black">
					{showPhotos && quadrant.topLeftImage?.asset && (
						<QuadrantImage image={quadrant.topLeftImage} />
					)}
				</div>
				<div className="flex items-center justify-center border-b-4 border-black">
					{showPhotos && quadrant.topRightImage?.asset && (
						<QuadrantImage image={quadrant.topRightImage} />
					)}
				</div>
				<div className="flex items-center justify-center border-r-4 border-black">
					{showPhotos && quadrant.bottomLeftImage?.asset && (
						<QuadrantImage image={quadrant.bottomLeftImage} />
					)}
				</div>
				<div className="flex items-center justify-center">
					{showPhotos && quadrant.bottomRightImage?.asset && (
						<QuadrantImage image={quadrant.bottomRightImage} />
					)}
				</div>

				{answers.map((answer, index) => (
					<QuadrantAnswer
						key={index}
						answer={ansshowPhotoswer}
						showToday={showToday}
						showTomorrow={showTomorrow}
						showLabels={showLabels}
						showLines={showLines}
						color={color}
						animating={animating}
					/>
				))}
			</div>
		</div>
	)
}

const QuadrantImage = ({ image }: { image: SanityImage }) => {
	const url = urlFor(image).width(150).height(150).format("webp").toString()
	if (!url) return null

	return (
		<Image
			src={url}
			alt={altFor(image)}
			className="pointer-events-none max-h-[45px] w-full max-w-[45px] object-contain opacity-20 sm:max-h-[90px] sm:max-w-[90px]"
			width={150}
			height={150}
		/>
	)
}
