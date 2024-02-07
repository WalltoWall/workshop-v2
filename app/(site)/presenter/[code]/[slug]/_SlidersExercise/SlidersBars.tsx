"use client"

import React from "react"
import type { ST } from "@/sanity/config"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"


interface barProps {
    // this works as the exercise type, but its really not an exercise...
	slider: ST["exercise"]
	answers: Answer[]
    images: boolean
    color: string
	showToday: boolean
	showTomorrow: boolean
}

export const SlidersBars = ({
	slider,
	answers,
	showToday,
	showTomorrow,
    images,
    color,
}: barProps) => {
	const Bars = (hasImages:boolean) => {
		let content = [];
		
		// 1 = minRange and 6 = max slider range.
		for (let i = 1; i <= 6; i++) {
			let countToday = 0
			let countTomorrow = 0

			// find answers that match iteration 
            answers[slider.slug.current].map((answer: any) => (
                (answer.today == i) ? countToday++ : countToday,
                (answer.tomorrow == i) ? countTomorrow++ : countTomorrow
            ))
            
            // find a percentage of answers.
            let allAnswers = countToday + countTomorrow
            let todayResults = countToday/allAnswers * 100
            let tomorrowResults = countTomorrow/allAnswers * 100

			
			// push html to the array
			content.push(
                <div key={i} className="h-full w-full flex justify-between items-end gap-2">
                    <div 
                        className={"transition-opacity transition-[background] relative block w-full max-w-[4rem]"}
                        style={{
                            backgroundColor: color,
                            height: countToday == 0 ? "1rem" : `${todayResults}%`,
                            opacity: showToday ? "1":"0"
                        }}
                    >
                        {!hasImages &&
                            <span className="absolute z-20 -top-6 w-full text-center">{countToday}</span>
                        }
                    </div>
                    <div 
                        key={i}
                        className={"transition-opacity transition-[background] relative block w-full max-w-[4rem] bg-yellow-68"}
                        style={{
                            height: countTomorrow == 0 ? "1rem" : `${tomorrowResults}%`,
                            backgroundImage: `repeating-linear-gradient(-45deg,${color},${color} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 18px)`,
                            backgroundColor: 'transparent',
                            border: `2px solid ${color}`,
                            borderBottom: `none`,
                            opacity: showTomorrow ? "1":"0"
                        }}
                    >
                        {!hasImages &&
                            <span className="absolute z-20 -top-6 w-full text-center">{countTomorrow}</span>
                        }
                    </div>
                </div>
			);
		}
		return content;
	}

	return (
		<div className="top-0 left-0 right-0 px-4 pt-8 w-full flex justify-evenly items-end gap-4 lg:gap-8"
        style={{
            position: images ? 'absolute' : 'static',
            height: images ? 'calc(50vh - 0.666rem)' : '100%'
        }}
        >
			{Bars(images)}
		</div>
	)
}
