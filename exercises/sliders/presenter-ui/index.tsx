"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import * as R from "remeda"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import type { SlidersPresenterViewSettings } from "../types"
import { assertSlidersAnswer } from "../utils"
import { BarGraphView } from "./BarGraphView"
import { DotPlotView } from "./DotPlotView"
import { SliderSettingsMenu } from "./SlidersSettingsMenu"
import { StepControlsAndLabels } from "./StepControlsAndLabels"

interface Props {
	exercise: ST.Exercise
}

export const SlidersPresenter = ({ exercise }: Props) => {
	const sliders = exercise.sliders ?? []

	const [settings, setSettings] = React.useState<SlidersPresenterViewSettings>({
		type: "bar-graph",
		color: "#fecb2f",
		today: true,
		tomorrow: true,
		numbers: true,
		images: true,
	})
	const searchParams = useSearchParams()
	const { answer } = useGroupContext()

	assertSlidersAnswer(answer)

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const slider = sliders.at(stepIdx)
	if (!slider) return null

	const stepAnswers = R.pipe(
		answer.data,
		R.values,
		R.flatMap((answer) => answer.at(stepIdx) ?? []),
	)

	const style = { "--color": settings.color } as React.CSSProperties

	return (
		<div className="flex h-full flex-col gap-8 pb-16" style={style}>
			{settings.type === "bar-graph" && (
				<BarGraphView
					settings={settings}
					stepAnswers={stepAnswers}
					slider={slider}
				/>
			)}

			{settings.type === "dot-plot" && (
				<DotPlotView
					settings={settings}
					stepAnswers={stepAnswers}
					slider={slider}
				/>
			)}

			<StepControlsAndLabels
				slider={slider}
				sliders={sliders}
				stepIdx={stepIdx}
			/>

			<SliderSettingsMenu setSettings={setSettings} settings={settings} />
		</div>
	)
}
