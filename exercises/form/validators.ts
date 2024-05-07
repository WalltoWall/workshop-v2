import { z } from "zod"

export const PositiveNumber = z.number().positive()
