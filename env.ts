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
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
		NEXT_PUBLIC_SANITY_DATASET: z.string().default("development"),
		NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2023-02-10"),
		NEXT_PUBLIC_PARTYKIT_HOST: z.string().default("localhost:1999"),
	},

	/**
	 * "Special" environment variables that are shared amongst server and
	 * client. These are usually handled specially by the compiler or are
	 * replaced statically at build-time, such as NODE_ENV.
	 */
	shared: {
		NODE_ENV: z
			.union([
				z.literal("development"),
				z.literal("production"),
				z.literal("test"),
			])
			.default("development"),
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
		NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST,

		NODE_ENV: process.env.NODE_ENV,
	},
})
