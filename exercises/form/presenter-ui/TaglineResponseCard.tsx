import React from "react"
import { Text } from "@/components/Text"
import type { TaglineFieldAnswer } from "../types"
import { HighlightedResponses } from "../ui/HighlightedResponses"
import {
	assertListAnswer,
	assertValidSource,
	getTaglineVariant,
} from "../utils"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"
import { Slider } from "./Slider"

export const TaglineResponseCard = ({
	name,
	answer,
	stepAnswers,
	field,
	questionNumber,
}: ResponseCardProps<TaglineFieldAnswer>) => {
	assertValidSource(field.source)

	const sourceAnswer = stepAnswers
		?.at(field.source.step - 1)
		?.at(field.source.field - 1)
	assertListAnswer(sourceAnswer)

	const variant = getTaglineVariant(field.color ?? "red")

	const words = sourceAnswer?.groups.at(0)?.responses.filter(Boolean) ?? []
	const answers = answer.responses.filter(Boolean)

	return (
		<ResponseDialog
			name={name}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<>
					<HighlightedResponses
						responses={words}
						answers={answers}
						size={14}
						className="mt-5"
						validClassName="bg-black text-white"
						invalidClassName={variant.invalidBgCn}
					/>

					<ul className="mt-6 flex flex-col gap-8">
						{answers.map((resp, idx) => (
							<Text key={idx} asChild size={18}>
								<li>{resp}</li>
							</Text>
						))}
					</ul>
				</>
			}
		>
			<div className="flex h-full flex-col items-center justify-between gap-12">
				<HighlightedResponses
					responses={words}
					answers={answers}
					size={16}
					className="w-full max-w-[40.625rem] items-center justify-center gap-3"
					validClassName="bg-black text-white"
					itemClassName="p-4 rounded-xl"
					invalidClassName={variant.invalidBgCn}
				/>

				<Slider.Container>
					{answers.map((resp, idx) => (
						<Slider.Slide key={idx}>
							<Text
								size={40}
								className="mx-auto w-full max-w-[46rem] text-center"
							>
								{resp}
							</Text>
						</Slider.Slide>
					))}
				</Slider.Container>
			</div>
		</ResponseDialog>
	)
}
