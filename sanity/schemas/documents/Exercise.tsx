import {
	Dumbbell,
	LayoutGrid,
	ListOrdered,
	RemoveFormatting,
} from "lucide-react"
import { defineArrayMember, defineField, defineType } from "@sanity-typed/types"
import { pluralize } from "@/lib/pluralize"
import { formFieldMember } from "@/sanity/schemas/fields/formField"
import { altText } from "../fields/altText"

export const Exercise = defineType({
	name: "exercise",
	type: "document",
	title: "Exercises",
	icon: () => <Dumbbell width={24} height={24} />,

	preview: {
		select: { title: "name", subtitle: "type" },
		prepare(select) {
			return {
				title: select.title,
				subtitle: select.subtitle,
				media: () => <Dumbbell width={24} height={24} />,
			}
		},
	},

	fields: [
		defineField({
			name: "name",
			title: "Name",
			description: "The name of this exercise.",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			description: "Determines the URL of the exercise page.",
			type: "slug",
			options: { source: "name" },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "groups",
			title: "Groups",
			description: "If provided, turns this exercise into a group exercise.",
			type: "array",
			initialValue: [],
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "name",
							title: "Name",
							type: "string",
							description: "The name of this group.",
							validation: (Rule) => Rule.required(),
						}),
					],
				}),
			],
		}),
		defineField({
			name: "type",
			title: "Type",
			description: "The type of exercise that this is.",
			type: "string",
			initialValue: "brainstorm",
			options: {
				list: [
					{ title: "Brainstorm", value: "brainstorm" },
					{ title: "Sliders", value: "sliders" },
					{ title: "Quadrants", value: "quadrants" },
					{ title: "Form", value: "form" },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "instructions",
			title: "Instructions",
			description:
				"Instructions associated with the specific exercise. To be seen when user clicks on the question mark near the title.",
			type: "text",
			validation: (Rule) => Rule.required(),
		}),

		// Brainstorm fields.
		defineField({
			name: "steps",
			title: "Steps",
			description: "The steps of this brainstorm exercise.",
			type: "array",

			initialValue: [],
			hidden: ({ document }) => document?.type !== "brainstorm",
			of: [
				defineArrayMember({
					type: "object",
					icon: () => <ListOrdered width={24} height={24} />,

					preview: {
						select: { title: "prompt", subtitle: "helpText" },
					},

					fields: [
						defineField({
							name: "prompt",
							title: "Prompt",
							description:
								"The main set of instructions for this step of the brainstorm.",
							type: "text",
							rows: 3,
						}),
						defineField({
							name: "helpText",
							title: "Help Text",
							description: "Small additional help text shown below the prompt.",
							type: "string",
							initialValue: "Single or short word responses are preferred.",
						}),
						defineField({
							name: "color",
							title: "Color",
							type: "string",
							description:
								"Choose what color post it note you want for each step of the brainstorm.",
							initialValue: "green",
							options: {
								list: [
									{ title: "Green", value: "green" },
									{ title: "Red", value: "red" },
									{ title: "Yellow", value: "yellow" },
								],
							},
						}),
					],
				}),
			],
		}),

		// Slider fields.
		defineField({
			name: "sliders",
			title: "Sliders",
			description: "The left and right values for this exercise.",
			type: "array",
			initialValue: [],
			hidden: ({ document }) => document?.type !== "sliders",
			of: [
				defineArrayMember({
					type: "object",
					icon: () => <LayoutGrid width={24} height={24} />,
					preview: {
						select: { title: "question_text" },
					},
					fields: [
						defineField({
							name: "question_text",
							title: "Question Text",
							description: "This text shows at the top of the slider",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "slug",
							title: "Slug",
							description: "Determines the URL of the slider.",
							type: "slug",
							options: {
								source: (_, opts) => (opts.parent as any)?.question_text,
							},
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "left_value",
							title: "Left Value",
							description: "This text is on the left side of the slider",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "left_image",
							title: "Left Image",
							description: "This image is on the left side of the slider",
							type: "image",
							fields: [altText],
						}),
						defineField({
							name: "right_value",
							title: "Right Value",
							description: "This text is on the right side of the slider",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "right_image",
							title: "Right Image",
							description: "This Image is on the right side of the slider",
							type: "image",
							fields: [altText],
						}),
					],
				}),
			],
		}),

		// Quadrant fields.
		defineField({
			name: "today_instructions",
			title: "Today Instructions",
			description: "Instructions on how to do this exercise",
			type: "array",

			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" as const }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),
		defineField({
			name: "tomorrow_instructions",
			title: "Tomorrow Instructions",
			description: "Instructions on how to do this exercise",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" as const }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),
		defineField({
			name: "finalize_instructions",
			title: "Finalize Instructions",
			description: "Instructions on how to finalize your answers.",
			type: "array",

			of: [
				defineArrayMember({
					type: "block",
					styles: [],
					lists: [],
					marks: {
						decorators: [{ title: "Bold", value: "strong" as const }],
						annotations: [],
					},
				}),
			],
			hidden: ({ document }) => document?.type !== "quadrants",
		}),
		defineField({
			name: "quadrants",
			title: "Quadrants",
			description: "The group of quadrant selectors for this exercise.",
			type: "array",

			initialValue: [],
			hidden: ({ document }) => document?.type !== "quadrants",
			of: [
				defineArrayMember({
					type: "object",
					icon: () => <LayoutGrid width={24} height={24} />,
					preview: {
						select: { title: "name" },
					},
					fields: [
						defineField({
							name: "name",
							title: "Name",
							description: "The name of this quadrant exercise",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "slug",
							title: "Slug",
							description: "Determines the URL of the quadrant.",
							type: "slug",
							options: {
								source: (_, opts) => (opts.parent as any)?.name,
							},
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "topValue",
							title: "Top Value",
							description: "The value at the top of the Y axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "bottomValue",
							title: "Bottom Value",
							description: "The value at the bottom of the Y axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "leftValue",
							title: "Left Value",
							description: "The value at the left of the X axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "rightValue",
							title: "Right Value",
							description: "The value at the right of the X axis",
							type: "string",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							title: "Top-Left Image",
							name: "topLeftImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Top-Right Image",
							name: "topRightImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Bottom-Left Image",
							name: "bottomLeftImage",
							type: "image",
							fields: [altText],
						}),
						defineField({
							title: "Bottom-Right Image",
							name: "bottomRightImage",
							type: "image",
							fields: [altText],
						}),
					],
				}),
			],
		}),

		// Form fields.
		defineField({
			name: "form",
			title: "Form",
			description: "The configuration for this exercise.",
			type: "object",
			hidden: ({ document }) => document?.type !== "form",

			fields: [
				defineField({
					name: "steps",
					title: "Steps",
					description:
						"Each item in this section represents a step in this exercise.",
					type: "array",
					initialValue: [],
					of: [
						defineArrayMember({
							name: "step",
							title: "Step",
							type: "object",
							icon: () => <RemoveFormatting width={24} height={24} />,

							preview: {
								select: {
									fields: "fields",
								},
								prepare(select) {
									return {
										title: "Step",
										subtitle: pluralize`${select.fields.length} field[|s].`,
									}
								},
							},

							fields: [
								defineField({
									name: "fields",
									title: "Fields",
									description: "Specify the form fields to use for this step.",
									type: "array",
									initialValue: [],
									of: [formFieldMember],
								}),
							],
						}),
					],
				}),
			],
		}),
	],
})
