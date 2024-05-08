import { CirclePicker } from "@/components/CirclePicker"
import { SettingsMenu, SettingVisibility } from "@/components/SettingsMenu"
import { Text } from "@/components/Text"
import { COLORS } from "@/lib/constants"
import type { SlidersPresenterViewSettings } from "../types"

interface Props {
	settings: SlidersPresenterViewSettings
	setSettings: React.Dispatch<
		React.SetStateAction<SlidersPresenterViewSettings>
	>
}

export const SliderSettingsMenu = ({ settings, setSettings }: Props) => {
	return (
		<SettingsMenu>
			{settings.type === "bar-graph" && (
				<>
					<SettingVisibility
						label="Photos"
						isVisible={settings.images}
						toggleVisibility={() =>
							setSettings({ ...settings, images: !settings.images })
						}
					/>
					<SettingVisibility
						label="Numbers"
						isVisible={settings.numbers}
						toggleVisibility={() =>
							setSettings({ ...settings, numbers: !settings.numbers })
						}
					/>
					<SettingVisibility
						label="Show Today"
						isVisible={settings.today}
						toggleVisibility={() =>
							setSettings({ ...settings, today: !settings.today })
						}
					/>
					<SettingVisibility
						label="Show Tomorrow"
						isVisible={settings.tomorrow}
						toggleVisibility={() =>
							setSettings({ ...settings, tomorrow: !settings.tomorrow })
						}
					/>
				</>
			)}

			{settings.type === "dot-plot" && (
				<>
					<SettingVisibility
						label="Show Lines"
						isVisible={settings.lines}
						toggleVisibility={() =>
							setSettings({ ...settings, lines: !settings.lines })
						}
					/>
				</>
			)}

			<SettingVisibility
				label="Show Dot Plot"
				isVisible={settings.type === "dot-plot"}
				toggleVisibility={() =>
					setSettings({
						...settings,

						//@ts-expect-error - For some reason TS thinks we're assigning a union.
						// I honestly don't care enough to fix it.
						type: settings.type === "dot-plot" ? "bar-graph" : "dot-plot",
					})
				}
			/>

			<Text size={12} className="block pt-2 text-white">
				{settings.type === "dot-plot" ? "Dot Color" : "Bar Color"}
			</Text>

			<CirclePicker
				color={settings.color}
				colors={COLORS}
				onColorClick={(color) => setSettings({ ...settings, color })}
				className="w-[6.5rem]"
			/>
		</SettingsMenu>
	)
}
