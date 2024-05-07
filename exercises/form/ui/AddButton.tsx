import { cx } from "class-variance-authority"
import { Button } from "@/components/Button"
import { PlusIcon } from "@/components/icons/Plus"

export const AddButton = (props: {
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	children: string
	className?: string
	disabled?: boolean
}) => {
	return (
		<Button
			color="black"
			uppercase={false}
			size="xs"
			outline
			rounded="sm"
			fontFamily="sans"
			className={cx(props.className, "disabled:opacity-50")}
			onClick={props.onClick}
			type="button"
			disabled={props.disabled}
		>
			<PlusIcon className="w-[18px]" />
			<span className="capsize">{props.children}</span>
		</Button>
	)
}
