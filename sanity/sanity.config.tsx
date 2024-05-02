import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { media, mediaAssetSource } from "sanity-plugin-media"
import { structureTool } from "sanity/structure"
import { Logo } from "@/components/Logo"
import { schemaTypes } from "@/sanity/schemas"
import { env } from "@/env"

const config = defineConfig({
	name: "default",
	title: "UnWorkshop",
	subtitle: "Welcome back to the UnWorkshop CMS.",
	basePath: "/admin",

	document: { comments: { enabled: false } },
	scheduledPublishing: { enabled: false },

	logo: () => <Logo style={{ width: "2.1875rem" }} />,
	icon: () => <Logo />,

	auth: {
		redirectOnSingle: false,
		loginMethod: "dual",
		mode: "replace",
		providers: [
			{
				name: "google",
				title: "Google",
				url: "https://api.sanity.io/v1/auth/login/google",
			},
			{
				name: "sanity",
				title: "E-mail / password",
				url: "https://api.sanity.io/v1/auth/login/sanity",
			},
		],
	},

	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,

	studio: {
		components: {
			logo: () => (
				<div style={{ display: "flex", gap: 8 }}>
					<Logo style={{ width: "2.1875rem" }} />
					<p style={{ fontWeight: 900 }}>ShopShop</p>
				</div>
			),
		},
	},

	form: {
		// Remove the media and unsplash plugins for static assets.
		file: {
			assetSources: (assetSources) =>
				assetSources.filter(
					(assetSource) => ![mediaAssetSource].includes(assetSource),
				),
		},

		// Unsplash and media plugin for images.
		image: {
			assetSources: (assetSources) =>
				assetSources.filter((assetSource) =>
					[mediaAssetSource].includes(assetSource),
				),
		},
	},

	plugins: [
		structureTool({
			// Customize the content sidebar.
			structure: (S) => {
				const hideFromNav = ["settings", "media.tag"]

				return S.list()
					.title("Content")
					.items([
						...S.documentTypeListItems().filter(
							(item) => !hideFromNav.includes(String(item.getId())),
						),
					])
			},
		}),
		media(),
		visionTool(),
	],

	schema: { types: schemaTypes },
})

export default config
