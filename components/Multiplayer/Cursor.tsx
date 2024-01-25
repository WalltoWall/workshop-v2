import * as React from "react"
import { PerfectCursor } from "perfect-cursors"

export function usePerfectCursor(
	cb: (point: number[]) => void,
	point?: number[],
) {
	const [pc] = React.useState(() => new PerfectCursor(cb))

	React.useLayoutEffect(() => {
		if (point) pc.addPoint(point)
		return () => pc.dispose()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pc])

	const onPointChange = React.useCallback(
		(point: number[]) => pc.addPoint(point),
		[pc],
	)

	return onPointChange
}

export const Cursor = React.memo(
	({ point, color }: { point?: number[]; color?: string }) => {
		const rCursor = React.useRef<SVGSVGElement>(null)

		const animateCursor = React.useCallback((point: number[]) => {
			const elm = rCursor.current
			if (!elm) return
			elm.style.setProperty(
				"transform",
				`translate(${point[0]}px, ${point[1]}px)`,
			)
		}, [])

		const onPointMove = usePerfectCursor(animateCursor)

		// Update the point whenever the component updates
		if (point) {
			onPointMove(point)
		}

		if (!point || !color) return null

		return (
			<svg
				ref={rCursor}
				className="absolute -left-[15px] -top-[15px] h-[35px] w-[35px]"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 35 35"
				fill="none"
				fillRule="evenodd"
			>
				<title>Cursor</title>
				<g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill="black">
					<path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
					<path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
				</g>
				<g fill={color}>
					<path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
					<path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
				</g>
			</svg>
		)
	},
)
Cursor.displayName = "Cursor"
