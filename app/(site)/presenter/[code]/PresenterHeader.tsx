"use client"

import React from "react"
import Link from "next/link"
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { match } from "ts-pattern"
import { z } from "zod"
import { Chevron } from "@/components/icons/Chevron"
import { Hamburger } from "@/components/icons/Hamburger"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"

interface StepNavigationProps {
	steps: number
	slug: string
	step: number
}

const StepNavigation = ({ steps, slug, step }: StepNavigationProps) => {
	const params = useParams()

	return (
		<ul className="mt-6 flex flex-col gap-3">
			{R.range(0, steps).map((idx) => (
				<li key={idx}>
					<Link
						href={{
							href: `/presenter/${params.code}/${slug}`,
							query: { step: idx + 1 },
						}}
						className={cx(
							"mx-6 block uppercase transition-opacity text-24 leading-none font-heading capsize hover:opacity-100 focus:opacity-100",
							idx + 1 === step ? "opacity-100" : "opacity-50",
						)}
					>
						Step {idx + 1}
					</Link>
				</li>
			))}
		</ul>
	)
}

interface PresenterHeaderProp {
	kickoffCode?: string
	exercises: Array<ST.Exercise>
}

export const PresenterHeader = ({
	kickoffCode,
	exercises,
}: PresenterHeaderProp) => {
	const [isOpen, setIsOpen] = React.useState(false)

	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const searchParams = useSearchParams()

	const exerciseSlug = z.string().optional().parse(params.slug)

	const exercise = exercises.find((e) => e.slug.current === exerciseSlug)
	const step = parseInt(searchParams?.get("step") ?? "1")

	const steps = match(exercise?.type)
		.with("quadrants", () => exercise?.quadrants?.length ?? 1)
		.with("brainstorm", () => exercise?.steps?.length ?? 1)
		.otherwise(() => null)

	const changeStep = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams({
			step: e.target.value.toString(),
		})

		router.push(pathname + "?" + params.toString())
	}

	// Close on page change.
	React.useEffect(() => setIsOpen(false), [pathname, searchParams])

	return (
		<header className="relative z-50 flex h-[5.5rem] items-center bg-black px-8 py-[1.125rem]">
			<Link href={`/presenter/${kickoffCode}`}>
				<Logo className="h-[3.25rem] w-[3.25rem] text-white" />
			</Link>

			<Text
				size={48}
				className="ml-10 font-bold uppercase text-white font-heading"
			>
				{exercise ? exercise.name : "Presenter"}
			</Text>

			{steps && (
				<div className="relative mx-6">
					<select
						value={step}
						onChange={changeStep}
						className="h-9 min-w-28 appearance-none rounded-lg border border-gray-58 bg-black pb-2 pl-2 pr-7 pt-1 uppercase text-white text-18 font-heading"
					>
						{R.range(0, steps).map((_, index) => (
							<option key={index} value={index + 1}>
								Step {index + 1}
							</option>
						))}
					</select>

					<Chevron className="absolute right-2.5 top-1/2 h-[0.75rem] -translate-y-1/2 -rotate-90 text-white" />
				</div>
			)}

			{exercises && (
				<>
					<Hamburger open={isOpen} setOpen={setIsOpen} />

					<nav
						className={cx(
							"fixed right-0 top-0 h-[100vh] w-[23.75rem] overflow-auto bg-yellow-59 px-6 pb-6 pt-24 shadow-md transition-transform duration-500",
							isOpen ? "translate-x-0" : "translate-x-full",
						)}
					>
						<ul className="flex flex-col gap-10">
							{exercises.map((e) => {
								return (
									<li key={e._id}>
										<Link
											className={cx(
												"relative inline-block pb-1 uppercase underline-offset-8 text-48 font-heading capsize hover:underline",
												exercise?._id === e._id && "underline",
											)}
											href={`/presenter/${kickoffCode}/${e.slug.current}`}
										>
											{e.name}
										</Link>

										{match(e.type)
											.with("quadrants", () => (
												<StepNavigation
													steps={e.quadrants?.length ?? 1}
													slug={e.slug.current}
													step={step}
												/>
											))
											.with("brainstorm", () => (
												<StepNavigation
													steps={e.steps?.length ?? 1}
													slug={e.slug.current}
													step={step}
												/>
											))
											.otherwise(() => null)}
									</li>
								)
							})}
						</ul>
					</nav>
				</>
			)}
		</header>
	)
}
