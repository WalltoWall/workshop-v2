import { useParams } from "next/navigation"
import { z } from "zod"

const ParamsSchema = z.object({
	code: z.string(),
	slug: z.string(),
	groupSlug: z.string(),
})

export const useGroupParams = () => ParamsSchema.parse(useParams())
