import { SanityImage } from "@/components/SanityImage"
import { isFilled } from "@/sanity/helpers"
import type { SliderStep } from "../types"

interface Props {
	slider: SliderStep
}
export const BarGraphImages = ({ slider }: Props) => {
	return (
		<div className="absolute inset-0 flex h-full w-full">
			{isFilled.image(slider.left_image) && (
				<div className="w-full bg-black">
					<SanityImage
						image={slider.left_image}
						className="h-full w-full object-cover object-center opacity-50"
						aspectRatio={1}
					/>
				</div>
			)}

			{isFilled.image(slider.right_image) && (
				<div className="w-full bg-black">
					<SanityImage
						image={slider.right_image}
						className="h-full w-full object-cover object-center opacity-50"
						aspectRatio={1}
					/>
				</div>
			)}
		</div>
	)
}
