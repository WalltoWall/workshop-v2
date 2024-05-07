import { ArrowBigLeftIcon, ArrowBigRightIcon } from "lucide-react"
import React from "react"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { Text } from "@/components/Text"
import { takeLast } from "@/lib/take-last"
import { useGroupContext } from "@/groups/group-context"
import { Checkmark } from "./icons/Checkmark"
import { Spinner } from "./Spinner"

const MAX_PAGINATION_DOTS = 3

interface Props {
	disabled?: boolean
	steps: number
	activeStep: number
	className?: string
	onFinish?: () => void
	onStepChange?: (step: number) => void
}

export const Steps = ({
	disabled = false,
	steps,
	activeStep = 1,
	className,
	onFinish,
	onStepChange,
}: Props) => {
	const [pending, startTransition] = React.useTransition()
	const { actions } = useGroupContext()

	const goToStep = (step: number) => {
		actions.send({ type: "go-to-step", value: step })
		onStepChange?.(step)
	}

	const handleNext = () => {
		if (activeStep - 1 === steps) {
			startTransition(() => onFinish?.())
		} else {
			goToStep(activeStep + 1)
		}
	}

	return (
		<div className={cx(className, "flex items-center justify-between")}>
			<button
				className={cx(
					activeStep <= 1 && "invisible",
					"flex w-20 items-center gap-1.5",
				)}
				onClick={() => goToStep(activeStep - 1)}
			>
				<ArrowBigLeftIcon className="w-5 shrink-0 fill-black" />
				<Text style="heading" size={20}>
					Back
				</Text>
			</button>

			<div className="relative">
				<div className="absolute inset-y-0 right-full mr-2 flex items-center gap-2">
					{R.pipe(
						R.range(0, activeStep - 1),
						takeLast(MAX_PAGINATION_DOTS),
						R.map((i) => (
							<button
								key={i}
								className="size-3 rounded-full bg-gray-75"
								onClick={() => goToStep(i + 1)}
							>
								<div className="sr-only">Go to step {i + 1}</div>
							</button>
						)),
					)}
				</div>

				<button
					className="flex h-8 w-8 items-center justify-center rounded-full bg-black px-2 text-white disabled:bg-gray-50"
					onClick={handleNext}
					disabled={disabled}
				>
					{pending ? (
						<Spinner className="size-4 text-white" />
					) : activeStep - 1 === steps ? (
						<Checkmark />
					) : (
						<Text className="font-bold" size={16}>
							{activeStep}
						</Text>
					)}
				</button>

				<div className="absolute inset-y-0 left-full ml-2 flex items-center gap-2">
					{R.pipe(
						R.range(activeStep, steps + 1),
						R.take(MAX_PAGINATION_DOTS),
						R.map((i) => (
							<button
								key={i}
								className="size-3 rounded-full bg-gray-75"
								onClick={() => goToStep(i + 1)}
							>
								<div className="sr-only">Go to step {i + 1}</div>
							</button>
						)),
					)}
				</div>
			</div>

			<button
				className={cx("flex w-20 items-center justify-end gap-1.5")}
				onClick={handleNext}
			>
				<Text style="heading" size={20}>
					{activeStep > steps ? "Finish" : "Next"}
				</Text>
				<ArrowBigRightIcon className="w-5 shrink-0 fill-black" />
			</button>
		</div>
	)
}
