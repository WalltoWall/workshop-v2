import React from "react"
import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import styles from "./BarGraphKey.module.css"

interface Props {
	className?: string
}

export const BarGraphKey = ({ className }: Props) => {
	return (
		<div
			className={cx(
				className,
				styles.container,
				"space-y-2 rounded-2xl bg-black px-5 py-4",
			)}
		>
			<div className="flex items-center gap-3">
				<div className={cx(styles.solid, "size-6")} />
				<Text style="heading" size={24}>
					Today
				</Text>
			</div>

			<div className="flex items-center gap-3">
				<div className={cx(styles.striped, "size-6 border-2")} />
				<Text style="heading" size={24}>
					Tomorrow
				</Text>
			</div>
		</div>
	)
}
