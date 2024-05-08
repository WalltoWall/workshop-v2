import { stripIndent } from "common-tags"
import type { Answer } from "@/party/types"
import type { SliderAnswer } from "./types"

export function assertSlidersAnswer(
	answer: Answer,
): asserts answer is SliderAnswer {
	if (answer.type !== "sliders") {
		throw new Error(stripIndent`
			Invalid answer found for this exercise. 
				Expected: "sliders"
				Received: "${answer.type}"
		`)
	}
}
