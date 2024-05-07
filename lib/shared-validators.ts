import { z } from "zod"

export const CodeSchema = z
	.string()
	.length(7, "Code must be 7 characters in length.")
	.transform((val) => {
		const code = val.toLowerCase()

		return code.slice(0, 3) + "-" + code.slice(3)
	})
