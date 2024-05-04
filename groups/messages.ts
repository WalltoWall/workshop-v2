import { z } from "zod"

const GroupRole = z.union([z.literal("captain"), z.literal("contributor")])
export type GroupRole = z.infer<typeof GroupRole>

export const SetRoleMessage = z.object({
	type: z.literal("set-role"),
	role: GroupRole,
})
export const ClearRoleMessage = z.object({ type: z.literal("clear-role") })
