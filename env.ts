import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		SANITY_TOKEN: z.string(),
	},

	/*
	 * Environment variables available on the client (and server).
	 */
	client: {
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
		NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
		NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2023-02-10"),
	},

	/*
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 */
	runtimeEnv: {
		SANITY_TOKEN: process.env.SANITY_TOKEN,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
	},
})
