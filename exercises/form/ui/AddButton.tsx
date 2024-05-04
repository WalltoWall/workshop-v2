import { Button } from "@/components/Button"
import { PlusIcon } from "@/components/icons/Plus"

export const AddButton = (props: {
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	children: string
	className?: string
}) => {
	return (
		<Button
			color="black"
			uppercase={false}
			size="xs"
			outline
			rounded="sm"
			fontFamily="sans"
			className={props.className}
			onClick={props.onClick}
			type="button"
		>
			<PlusIcon className="w-[18px]" />
			<span className="capsize">{props.children}</span>
		</Button>
	)
}
