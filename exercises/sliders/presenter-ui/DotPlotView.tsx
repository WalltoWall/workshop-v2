import type {
	DotPlotViewSettings,
	SliderStep,
	SliderStepAnswer,
} from "../types"

interface Props {
	settings: DotPlotViewSettings
	slider: SliderStep
	stepAnswers: Array<SliderStepAnswer>
}

export const DotPlotView = ({ settings }: Props) => {
	return <div className="flex h-full flex-col gap-8">Dot Plot</div>
}
