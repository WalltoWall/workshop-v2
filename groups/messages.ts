import { z } from "zod"

const GroupRole = z.union([z.literal("captain"), z.literal("contributor")])
export type GroupRole = z.infer<typeof GroupRole>

export const SetRole = z.object({
	type: z.literal("set-role"),
	role: GroupRole,
})
export const ClearRole = z.object({ type: z.literal("clear-role") })
