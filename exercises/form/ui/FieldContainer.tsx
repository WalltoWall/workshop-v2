import React from "react"

export const FieldContainer = React.memo(
	(props: { children: React.ReactNode }) => {
		return (
			<div className="-mx-7 border-b-2 border-gray-90 px-7 py-6 last:border-b-0">
				{props.children}
			</div>
		)
	},
)
FieldContainer.displayName = "FieldContainer"
