import * as Popover from "@radix-ui/react-popover"
import { Eye } from "./icons/Eye"
import { EyeSlash } from "./icons/EyeSlash"
import { Gear } from "./icons/Gear"

interface Props {
	children: React.ReactNode
}

export const SettingsMenu = ({ children }: Props) => (
	<Popover.Root>
		<Popover.Trigger className="ease fixed bottom-8 right-8 h-10 w-10 p-[0.125rem] transition duration-200 hover:opacity-75">
			<span className="sr-only">Open Settings Menu</span>
			<Gear />
		</Popover.Trigger>

		<Popover.Portal>
			<Popover.Content
				side="left"
				align="end"
				alignOffset={30}
				sideOffset={-4}
				className="z-20 grid min-w-[9rem] gap-4 rounded-2xl bg-black px-5 py-4 text-white"
			>
				{children}
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
)

interface SettingsVisibilityProps {
	label: string
	isVisible: boolean
	toggleVisibility: () => void
}

export const SettingVisibility = ({
	label,
	isVisible,
	toggleVisibility,
}: SettingsVisibilityProps) => {
	return (
		<button
			className="grid grid-cols-[auto_1fr] items-center gap-2 text-left transition-opacity hover:opacity-75"
			onClick={toggleVisibility}
		>
			{isVisible ? (
				<Eye className="h-auto w-[1.125rem]" />
			) : (
				<EyeSlash className="h-auto w-[1.125rem]" />
			)}
			<span className="text-12 capsize">{label}</span>
		</button>
	)
}
