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
