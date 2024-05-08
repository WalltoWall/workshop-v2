import type * as ST from "@/sanity/types.gen"

export type SliderAnswer = {
	type: "sliders"
	step: number
	data: Record<string, Array<SliderStepAnswer>>
}

export type SliderStepAnswer = {
	today: number
	tomorrow: number
}

export type SliderStep = NonNullable<ST.Exercise["sliders"]>[number]

export type BarGraphViewSettings = {
	type: "bar-graph"
	numbers: boolean
	images: boolean
	today: boolean
	tomorrow: boolean
	color: string
}

export type DotPlotViewSettings = {
	type: "dot-plot"
	lines: boolean
	color: string
}

export type SlidersPresenterViewSettings =
	| BarGraphViewSettings
	| DotPlotViewSettings
