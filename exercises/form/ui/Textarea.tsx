import clsx from "clsx"
import { useRememberCursorPosition } from "../hooks"

export const textareaStyles =
	"min-h-32 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-16 leading-copyMega"

interface Props
	extends Omit<React.ComponentPropsWithoutRef<"textarea">, "value"> {
	value?: string
}

export const Textarea = ({ className, onChange, value, ...props }: Props) => {
	const rememberCursor = useRememberCursorPosition({ onChange, value })

	return (
		<textarea
			ref={rememberCursor.ref as React.RefObject<HTMLTextAreaElement>}
			className={clsx(className, textareaStyles, "resize-y")}
			onChange={rememberCursor.onChange}
			value={value}
			{...props}
		/>
	)
}
