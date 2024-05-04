import { ArrowBigLeftIcon, TriangleAlertIcon } from "lucide-react"
import React from "react"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"
import { Button } from "@/components/Button"
import { Text } from "@/components/Text"

export const InvalidField = (props: { className?: string }) => {
	const pathname = usePathname()

	// Just hard navigate back to the first step.
	const reset = () => {
		window.location.href = pathname
	}

	return (
		<div
			className={cx(
				props.className,
				"space-y-6 rounded bg-[#FFDCD3] px-4 py-6",
			)}
		>
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<TriangleAlertIcon className="size-6" />
					<Text style="heading" size={24}>
						Oops! Something went wrong.
					</Text>
				</div>

				<Text size={14}>
					You may have navigated ahead of your group captain, or something just
					went wrong.
				</Text>
			</div>

			<Button color="black" size="sm" onClick={reset}>
				<ArrowBigLeftIcon className="mt-0.5 size-4" />
				Go back
			</Button>
		</div>
	)
}
