"use client"

import React from "react"
import { useFormState, useFormStatus } from "react-dom"
import clsx from "clsx"
import {
	OTPInput,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	type SlotProps,
} from "input-otp"
import { toast } from "sonner"
import { Chevron } from "../../components/icons/Chevron"
import { Spinner } from "../../components/Spinner"

const Slot = (props: SlotProps) => {
	return (
		<div
			className={clsx(
				"relative h-[4.5rem] w-10",
				"flex items-center justify-center rounded-lg",
				"border border-green-40",
				props.char &&
					"bg-green-40 font-extrabold uppercase text-black text-48 font-heading",
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	)
}

const FakeCaret = () => {
	return (
		<div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
			<div className="h-8 w-px bg-green-40" />
		</div>
	)
}

const FakeDash = () => {
	return (
		<div className="flex w-10 items-center justify-center">
			<div className="h-1 w-3 rounded-full bg-white" />
		</div>
	)
}

const CodeInput = () => {
	const [showSubmit, setShowSubmit] = React.useState(false)
	const status = useFormStatus()

	return (
		<div className="relative">
			<OTPInput
				maxLength={7}
				required
				autoFocus
				name="code"
				inputMode="text"
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				containerClassName="group flex items-center"
				className="text-16"
				onChange={(value) => setShowSubmit(value.length === 7)}
				render={({ slots }) => (
					<>
						<div className="flex gap-1">
							{slots.slice(0, 3).map((slot, idx) => (
								<Slot key={idx} {...slot} />
							))}
						</div>

						<FakeDash />

						<div className="flex gap-1">
							{slots.slice(3).map((slot, idx) => (
								<Slot key={idx} {...slot} />
							))}
						</div>
					</>
				)}
			/>
			{showSubmit && (
				<button
					className="absolute -bottom-5 -right-5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-black bg-green-40"
					type="submit"
				>
					{status.pending ? (
						<Spinner className="w-3 text-black" />
					) : (
						<Chevron className="w-1.5 rotate-180 text-black" />
					)}
				</button>
			)}
		</div>
	)
}

interface Props {
	action: (
		state: { error: string },
		data: FormData,
	) => Promise<{ error: string }>
}

export const CodeForm = (props: Props) => {
	const [state, action] = useFormState(props.action, { error: "" })

	React.useEffect(() => {
		if (!state.error) return

		toast.error(state.error)
	})

	return (
		<form className="flex flex-col space-y-1.5" action={action}>
			<CodeInput />
		</form>
	)
}
