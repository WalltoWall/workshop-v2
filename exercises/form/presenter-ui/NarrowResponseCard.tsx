import { Text } from "@/components/Text"
import type { NarrowFieldAnswer } from "../types"
import { HighlightedResponses } from "../ui/HighlightedResponses"
import { assertListAnswer } from "../utils"
import type { ResponseCardProps } from "./ResponseCard"
import { ResponseDialog } from "./ResponseDialog"

export const NarrowResponseCard = ({
	answer,
	field,
	questionNumber,
	stepAnswers,
	name,
}: ResponseCardProps<NarrowFieldAnswer>) => {
	const sourceStep = field.source?.step ?? Infinity
	const sourceField = field.source?.step ?? Infinity

	const sourceAnswer = stepAnswers?.at(sourceStep)?.at(sourceField)
	assertListAnswer(sourceAnswer)

	return (
		<ResponseDialog
			name={name}
			field={field}
			questionNumber={questionNumber}
			trigger={
				<ul className="list-inside list-decimal space-y-1">
					{answer.responses.map((resp) => (
						<Text asChild style="copy" size={18} key={resp} trim={false}>
							<li>{resp}</li>
						</Text>
					))}
				</ul>
			}
		>
			<div className="flex h-full flex-col items-center justify-center gap-12">
				{sourceAnswer && (
					<HighlightedResponses
						responses={sourceAnswer.groups.at(0)?.responses ?? []}
						answers={answer.responses}
						size={16}
						className="w-full max-w-[40.625rem] items-center justify-center gap-3"
						invalidClassName="bg-black text-white"
						validClassName="bg-gray-90 opacity-50"
						itemClassName="p-4 rounded-xl"
					/>
				)}
				<ul className="list-inside list-decimal space-y-2">
					{answer.responses.map((resp) => (
						<Text
							key={resp}
							asChild
							size={40}
							className="mx-auto w-full max-w-[46rem]"
							trim={false}
						>
							<li>{resp}</li>
						</Text>
					))}
				</ul>
			</div>
		</ResponseDialog>
	)
}
