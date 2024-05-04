import React from "react"

interface Args {
	onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
	value?: string
}

/**
 * Helper hook to maintain the cursor position in a text input after an
 * asynchronous DOM update. This is useful since `partykit` pretty
 * much makes every DOM text input update asynchronous.
 *
 * @see https://github.com/facebook/react/issues/5386
 */
export function useRememberCursorPosition({ onChange, value }: Args) {
	const rInput = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null)
	const rCursor = React.useRef<number | null>(null)

	// Once the async update has updated `value`, update the cursor position
	// to what we saved.
	React.useLayoutEffect(() => {
		if (rCursor.current === null) return

		rInput.current?.setSelectionRange(rCursor.current, rCursor.current)
	}, [value])

	const wrappedOnChange: Args["onChange"] = (e) => {
		// Capture the cursor position right before we make an async
		// update.
		rCursor.current = rInput.current?.selectionStart ?? 0

		// Now, make the async update.
		onChange?.(e)
	}

	return { onChange: wrappedOnChange, ref: rInput }
}
