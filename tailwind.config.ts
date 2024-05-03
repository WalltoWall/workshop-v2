//@ts-ignore
import tailwindCapsize from "@asyarb/tailwind-capsize"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export default {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./groups/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
		"./exercises/**/*.{ts,tsx}",
	],
	theme: {
		fontFamily: {
			sans: ["var(--sans)", "system-ui"],
			serif: ["var(--serif)", "serif"],
			heading: ["var(--heading)", "system-ui"],
		},

		capsize: {
			metrics: {
				sans: {
					capHeight: 718,
					ascent: 1060,
					descent: -201,
					lineGap: 0,
					unitsPerEm: 1000,
					xHeight: 518,
					xWidthAvg: 431,
				},
				heading: {
					capHeight: 718,
					ascent: 1060,
					descent: -201,
					lineGap: 0,
					unitsPerEm: 1000,
					xHeight: 522,
					xWidthAvg: 316,
				},
				serif: {
					capHeight: 700,
					ascent: 994,
					descent: -513,
					lineGap: 0,
					unitsPerEm: 1000,
					xHeight: 450,
					xWidthAvg: 419,
				},
			},
		},

		lineHeight: {
			none: "1",
			copyMega: "1.3",
			copy: "1.4",
			copyMicro: "1.5",
			heading: "0.9",
		},

		fontSize: {
			64: "4rem",
			56: "3.5rem",
			48: "3rem",
			40: "2.5rem",
			32: "2rem",
			24: "1.5rem",
			20: "1.25rem",
			18: "1.125rem",
			16: "1rem",
			14: "0.875rem",
			12: ".75rem",
		},

		colors: {
			transparent: "#fff0",
			white: "#fff",
			black: "#000",

			gray: {
				97: "#f7f7f7",
				90: "#E5E5E5",
				82: "#cdd6d4",
				75: "#bfbfbf",
				50: "#7f7f7f",
				58: "#8ca09c",
				38: "#5a6c69",
				19: "#2c3533",
			},

			red: {
				76: "#ff9488",
				70: "#ff7566",
				63: "#ff5745",
				57: "#e8503f",
				46: "#ba4033",
			},

			orange: {
				73: "#ff9e77",
				66: "#ff8655",
				63: "#ff7a45",
				57: "#e86f3f",
				52: "#d16439",
			},

			yellow: {
				77: "#ffee8b",
				70: "#ffe96a",
				64: "#ffe54a",
				59: "#fecb2f",
				58: "#e8d144",
				52: "#d1bc3d",
			},

			green: {
				78: "#96fad1",
				65: "#57f7b6",
				52: "#19f49b",
				48: "#17de8d",
				38: "#13b271",
				40: "#00CC82",
			},

			indigo: {
				82: "#a6afff",
				73: "#7987ff",
				68: "#5c6dff",
				55: "#4c5ad1",
				49: "#4350ba",
			},

			violet: {
				80: "#d7a0fa",
				70: "#c371f8",
				64: "#b652f7",
				58: "#a64be1",
				47: "#853cb4",
			},

			pink: {
				85: "#ffb7f1",
				80: "#fab99e",
				78: "#ff93ea",
				74: "#ff7be6",
				67: "#e870d2",
				63: "#e165bd",
			},
		},

		extend: {
			keyframes: {
				fadeIn: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				fadeOut: {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},

			animation: {
				fadeIn: "fadeIn 300ms linear",
				fadeOut: "fadeOut 300ms linear",
				"caret-blink": "caret-blink 1.2s ease-out infinite",
			},

			transitionProperty: {
				position: "top, bottom, left, right",
			},
		},
	},
	plugins: [
		tailwindCapsize,
		plugin(({ addUtilities, matchUtilities, theme }) => {
			addUtilities({
				".scrollbar-hide": {
					/* IE and Edge */
					"-ms-overflow-style": "none",

					/* Firefox */
					"scrollbar-width": "none",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},

				".scrollbar-default": {
					/* IE and Edge */
					"-ms-overflow-style": "auto",

					/* Firefox */
					"scrollbar-width": "auto",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "block",
					},
				},

				".scroll-shadow": {
					"mask-image":
						"linear-gradient(#000, #000, transparent 0, #000 var(--scroll-shadow-size), #000 calc(100% - var(--scroll-shadow-size)), transparent)",
				},

				".scroll-shadow-x": {
					"mask-image":
						"linear-gradient(to right, #000, #000, transparent 0, #000 var(--scroll-shadow-size), #000 calc(100% - var(--scroll-shadow-size)), transparent)",
				},
			})
			matchUtilities(
				{
					"scroll-shadow": (value) => ({
						"--scroll-shadow-size": value,
					}),
				},
				{ values: theme("spacing") },
			)
		}),
	],
} satisfies Config
