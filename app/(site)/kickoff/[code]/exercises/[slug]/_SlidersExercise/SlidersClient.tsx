"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Slider } from "./Slider"
import type { Answers } from "./types"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

type Props = {
	exerciseId: string
    sliders: NonNullable<ST["exercise"]["sliders"]>
    answers: Answers
    groups: ST["exercise"]["groups"]
}

export const SlidersClient = ({ exerciseId, sliders, answers, groups }: Props) => {
	const router = useRouter()
	const params = useParams()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const totalSteps = sliders.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-8">
			{sliders?.map((slider, i) => (
                <div key={i}>
                    {(step === i + 1 || step === totalSteps + 1) && (
                        <Slider
                            key={slider._key}
                            item={slider}
                            answer={answers[slider.slug.current]}
                            exerciseId={exerciseId}
                            group={groups && groups.length > 0}
                        />
                    )}
                </div>
			))}

			<Steps
				disabled={false}
				steps={totalSteps}
				activeStep={step}
				onFinish={goBackToExerciseList}
			/>
		</div>
	)
}
