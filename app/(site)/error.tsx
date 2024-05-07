"use client"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { IntroLayout } from "./IntroLayout"

const Error = (props: { error: Error; reset: () => void }) => {
	return (
		<IntroLayout.Dark>
			<div className="my-auto space-y-4 px-7 pb-20">
				<Text style="heading" size={40}>
					Oops! Something went wrong
				</Text>

				<Button color="gray" outline size="sm" onClick={() => props.reset()}>
					Go back
				</Button>
			</div>
		</IntroLayout.Dark>
	)
}

export default Error
