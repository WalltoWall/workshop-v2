import { FormInput } from "lucide-react"
import { defineArrayMember, defineField } from "@sanity-typed/types"

export const formFieldMember = defineArrayMember({
	type: "object",
	icon: () => <FormInput width={24} height={24} />,
	preview: {
		select: { title: "type" },
	},
	description: "The configuration for this form field.",
	fields: [
		defineField({
			name: "type",
			title: "Type",
			description: "The type of field input to use.",
			type: "string",
			initialValue: "List",
			options: {
				list: ["List", "Narrow", "Text", "Big Text"],
			},
			validation: (Rule) => Rule.required(),
		}),

		// Shared fields.
		defineField({
			name: "placeholder",
			title: "Placeholder",
			description:
				"The placeholder text shown in inputs before a participant enters a value.",
			type: "string",
			hidden: ({ parent }) => parent?.type === "Narrow",
		}),

		// List fields.
		defineField({
			name: "rows",
			title: "Rows",
			description:
				"Specify the number of response rows to show by default. Default 5.",
			type: "number",
			initialValue: 5,
			hidden: ({ parent }) => parent?.type !== "List",
		}),
		defineField({
			name: "showAddButton",
			title: "Show add button?",
			description:
				"If checked, show the add button at the bottom of the input to allow participants to add more responses.",
			type: "boolean",
			initialValue: false,
			options: { layout: "checkbox" },
			hidden: ({ parent }) => parent?.type !== "List",
		}),

		// Narrow fields.
		defineField({
			name: "step",
			title: "Step",
			description: "Specify the step to seed narrowing choices from.",
			type: "number",
			hidden: ({ parent }) => parent?.type !== "Narrow",
		}),
		defineField({
			name: "min",
			title: "Minimum",
			description: "Specify the minimum number of choices to narrow to.",
			type: "number",
			hidden: ({ parent }) => parent?.type !== "Narrow",
		}),
		defineField({
			name: "max",
			title: "Maximum",
			description: "Specify the maximum number of choices to narrow to.",
			type: "number",
			hidden: ({ parent }) => parent?.type !== "Narrow",
		}),
	],
})
