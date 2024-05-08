import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Arrow } from "@/components/icons/Arrow"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"
import type { SliderStep } from "../types"

interface Props {
	slider: SliderStep
	stepIdx: number
	sliders: SliderStep[]
}

export const StepControlsAndLabels = ({ slider, stepIdx, sliders }: Props) => {
	const pathname = usePathname()
	const router = useRouter()
	const [nextPending, startNextTransition] = React.useTransition()
	const [prevPending, startPrevTransition] = React.useTransition()

	const step = stepIdx + 1

	function goToStep(step: number) {
		const sParams = new URLSearchParams({ step: step.toString() })
		router.push(pathname + "?" + sParams.toString())
	}

	function previousStep() {
		startPrevTransition(() => goToStep(step - 1))
	}

	function nextStep() {
		startNextTransition(() => goToStep(step + 1))
	}

	return (
		<div className="flex justify-between gap-4">
			<Text style="heading" size={40} className="w-32">
				{slider.left_value}
			</Text>

			<div className="flex items-center justify-center gap-5">
				<button
					disabled={stepIdx === 0}
					className="text-gray-50 disabled:opacity-50"
					onClick={previousStep}
				>
					<span className="sr-only">Previous Slider</span>
					{prevPending ? (
						<Spinner className="size-7" />
					) : (
						<Arrow className="size-7" />
					)}
				</button>

				<button
					disabled={stepIdx >= sliders.length - 1}
					className="text-gray-50 disabled:opacity-50"
					onClick={nextStep}
				>
					<span className="sr-only">Next Slider</span>
					{nextPending ? (
						<Spinner className="size-7" />
					) : (
						<Arrow className="size-7 rotate-180" />
					)}
				</button>
			</div>

			<Text style="heading" size={40} className="w-32 text-right">
				{slider.right_value}
			</Text>
		</div>
	)
}
