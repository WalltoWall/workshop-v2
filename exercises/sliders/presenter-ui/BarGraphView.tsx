import * as R from "remeda"
import type {
	BarGraphViewSettings,
	SliderStep,
	SliderStepAnswer,
} from "../types"
import { Bar } from "./Bar"
import { BarGraphImages } from "./BarGraphImages"
import { BarGraphKey } from "./BarGraphKey"

interface Props {
	settings: BarGraphViewSettings
	slider: SliderStep
	stepAnswers: Array<SliderStepAnswer>
}

export const BarGraphView = ({ settings, slider, stepAnswers }: Props) => {
	return (
		<div className="flex grow flex-col gap-8">
			<BarGraphKey className="self-start" />

			<div className="relative flex grow justify-between gap-4 overflow-hidden rounded-t-3xl border-b-[10px] border-black px-4">
				{settings.images && <BarGraphImages slider={slider} />}

				{R.range(0, 6).map((idx) => {
					const today = R.pipe(
						stepAnswers,
						R.filter((a) => a.today === idx + 1),
						R.sumBy((a) => a.today),
					)
					const tomorrow = R.pipe(
						stepAnswers,
						R.filter((a) => a.tomorrow === idx + 1),
						R.sumBy((a) => a.tomorrow),
					)

					const total = today + tomorrow

					return (
						<div key={idx} className="flex w-32 gap-2">
							{settings.today && (
								<Bar height={`${(today / total) * 100}%`} variant="solid">
									{settings.numbers && today}
								</Bar>
							)}

							{settings.tomorrow && (
								<Bar height={`${(tomorrow / total) * 100}%`} variant="striped">
									{settings.numbers && tomorrow}
								</Bar>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
