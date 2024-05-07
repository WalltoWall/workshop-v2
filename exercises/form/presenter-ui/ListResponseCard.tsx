import React from "react"
import { Text } from "@/components/Text"
import type { ListFieldAnswer } from "../types"
import { HighlightedResponses } from "../ui/HighlightedResponses"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"
import { Slider } from "./Slider"

export const ListResponseCard = ({
	answer,
	name,
	field,
	questionNumber,
}: ResponseCardProps<ListFieldAnswer>) => {
	return (
		<ResponseDialog
			name={name}
			field={field}
			questionNumber={questionNumber}
			trigger={answer.groups.map((g, idx) => (
				<div key={idx} className="mt-5 flex flex-col gap-5 first-of-type:mt-0">
					{g.label && (
						<Text asChild style="heading" size={18}>
							<h5>{g.label}</h5>
						</Text>
					)}

					<HighlightedResponses
						responses={g.responses.filter(Boolean)}
						answers={[]}
						size={14}
						validClassName="bg-black text-white"
					/>
				</div>
			))}
		>
			<div className="flex h-full flex-col items-center justify-center gap-12">
				<Slider.Container className="w-full">
					{answer.groups.map((g, idx) => (
						<Slider.Slide key={idx}>
							<div className="flex justify-center">
								<HighlightedResponses
									responses={g.responses ?? []}
									answers={[]}
									size={16}
									className="mt-5 w-full max-w-[40.625rem] items-center justify-center gap-3"
									validClassName="bg-black text-white"
									itemClassName="p-4 rounded-xl"
								/>
							</div>
						</Slider.Slide>
					))}
				</Slider.Container>
			</div>
		</ResponseDialog>
	)
}
