import React from "react"
import clsx from "clsx"

type Props = {
	children: React.ReactNode
	className?: string
}

const Container = ({ children, className }: Props) => {
	const [idx, setIdx] = React.useState(0)
	const rObs = React.useRef<IntersectionObserver>()
	const rContainer = React.useRef<HTMLUListElement>(null)

	React.useEffect(() => {
		if (!rContainer.current) return

		const items = Array.from(rContainer.current.children)

		rObs.current ??= new IntersectionObserver((entries) => {
			const entry = entries.find((e) => e.isIntersecting)
			if (!entry) return

			const newIdx = items.findIndex((item) => item === entry.target)
			setIdx(newIdx)
		})

		items.forEach((item) => {
			if (!item) return

			rObs.current?.observe(item)
		})

		return () => rObs.current?.disconnect()
	}, [])

	const numSlides = React.Children.count(children)
	const numSlidesArr = new Array(numSlides).fill(0)

	const goToSlide = (idx: number) => {
		rContainer.current?.children[idx]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		})
		setIdx(idx)
	}

	return (
		<div
			className={clsx(className, "relative flex grow flex-col justify-center")}
		>
			<ul
				ref={rContainer}
				className="-m-9 flex snap-x snap-mandatory items-center gap-20 overflow-auto overscroll-contain p-9 text-center scrollbar-hide scroll-shadow-x scroll-shadow-20"
			>
				{children}
			</ul>

			<div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-3">
				{numSlides > 1 &&
					numSlidesArr.map((_, i) => (
						<button
							key={i}
							className={clsx(
								"h-4 w-4 rounded-full transition ease-out",
								idx === i ? "bg-black" : "bg-gray-90",
							)}
							onClick={() => goToSlide(i)}
						>
							<span className="sr-only">Go to answer {idx + 1}</span>
						</button>
					))}
			</div>
		</div>
	)
}
Container.displayName = "Slider.Container"

const Slide = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"li">) => {
	return (
		<li
			className={clsx("mx-auto w-full shrink-0 snap-center", className)}
			{...props}
		/>
	)
}
Slide.displayName = "Slider.Slide"

export const Slider = {
	Slide,
	Container,
}
