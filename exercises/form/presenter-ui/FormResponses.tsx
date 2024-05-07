"use client"

import React from "react"
import * as R from "remeda"
import snarkdown from "snarkdown"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import type { FormPresenterViewSettings } from "../types"
import { assertFormAnswer } from "../utils"
import { ResponseCard } from "./ResponseCard"

interface Props {
	exercise: ST.Exercise
	participants: Record<string, ST.Participant>
}

export const FormResponses = ({ exercise, participants }: Props) => {
	const groups = exercise.groups ?? []
	const isGroupExercise = groups.length >= 1
	const steps = exercise.form?.steps

	if (!steps) throw new Error("Invalid form configuration found.")

	const [settings, setSettings] = React.useState<FormPresenterViewSettings>({
		names: isGroupExercise,
	})
	const { answer } = useGroupContext()
	assertFormAnswer(answer)

	function getSubmitter(id: string) {
		if (isGroupExercise) {
			const group = groups.find((g) => g.slug.current === id)
			if (!group) throw new Error("Could not find group for id: " + id)

			return {
				name: group.name,
				id,
			}
		}

		const participant = participants[id]
		if (!participant)
			throw new Error("Could not find participant for id: " + id)

		return {
			name: participant.name,
			id,
		}
	}

	return (
		<>
			<div className="space-y-12 px-8 py-10">
				{steps.map((step, stepIdx) => {
					const fields = step.fields ?? []
					const stepResponses = R.pipe(
						answer.data,
						R.mapValues((answers, id) => ({
							submitter: getSubmitter(id),
							stepAnswers: answers,
						})),
						R.values,
					)

					return (
						<div key={stepIdx}>
							<Text asChild style="heading" size={40}>
								<h2>Step {stepIdx + 1}</h2>
							</Text>

							{fields.map((field, fieldIdx) => {
								return (
									<div key={field._key} className="ml-8 mt-8">
										<div className="flex items-end gap-20">
											<Text asChild style="heading" size={32}>
												<h3>Question {fieldIdx + 1}</h3>
											</Text>

											<Text
												style="copy"
												size={16}
												dangerouslySetInnerHTML={{
													__html: snarkdown(field.prompt),
												}}
											/>
										</div>

										<div className="mt-7 flex flex-wrap gap-3">
											{stepResponses.map((resp, idx) => {
												const stepAnswer = resp.stepAnswers.at(stepIdx) ?? []
												const fieldAnswer = stepAnswer.at(fieldIdx)
												if (!fieldAnswer) return null

												const name = settings.names
													? resp.submitter.name
													: isGroupExercise
														? `Group ${idx + 1}`
														: `Participant ${idx + 1}`

												return (
													<ResponseCard
														key={idx}
														answer={fieldAnswer}
														stepAnswers={resp.stepAnswers}
														name={name}
														field={field}
														questionNumber={fieldIdx + 1}
														isGroupExercise={isGroupExercise}
													/>
												)
											})}
										</div>
									</div>
								)
							})}
						</div>
					)
				})}
			</div>

			<SettingsMenu>
				<SettingVisibility
					isVisible={settings.names}
					label="Names"
					toggleVisibility={() =>
						setSettings((prev) => ({ ...prev, names: !prev.names }))
					}
				/>
			</SettingsMenu>
		</>
	)
}
