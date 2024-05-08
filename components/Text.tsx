"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

export const text = cva("", {
	variants: {
		size: {
			64: "text-64",
			56: "text-56",
			48: "text-48",
			40: "text-40",
			32: "text-32",
			24: "text-24",
			20: "text-20",
			18: "text-18",
			16: "text-16",
			14: "text-14",
			12: "text-12",
		},
		style: {
			heading: "font-heading uppercase font-extrabold leading-none",
			copy: "font-sans leading-[1.25]",
			contextMenu: "font-sans leading-[1.07]",
			serif: "font-serif font-semibold leading-none",
		},
		trim: {
			true: "capsize",
			false: "no-capsize",
		},
	},
	compoundVariants: [
		{
			size: 64,
			style: "heading",
			className: "tracking-[0.23px]",
		},
		{
			size: 40,
			style: "heading",
			className: "tracking-[0.13px]",
		},
		{
			size: 32,
			style: "heading",
			className: "tracking-[0.1px]",
		},

		{
			size: 24,
			style: "copy",
			className: "leading-copyMega",
		},
		{
			size: 16,
			style: "copy",
			className: "leading-copy",
		},
		{
			size: 12,
			style: "copy",
			className: "leading-copyMicro",
		},
	],
	defaultVariants: {
		trim: true,
		size: 16,
		style: "copy",
	},
})

export type TextVariants = VariantProps<typeof text>
type TextProps = Omit<React.ComponentPropsWithoutRef<"div">, "style"> &
	TextVariants & { asChild?: boolean }

/**
 * A polymorphic component for rendering text with pre-determined styling. Use
 * the `asChild` prop for type-safe access to HTML tags other than the `<p>`
 * tag.
 *
 * @see https://www.radix-ui.com/docs/primitives/utilities/slot
 *
 * @example
 * Basic usage:
 * ```
 * <Text style="heading" size={24}>Hello World!</Text>
 * ```
 *
 * @example
 * Using a custom HTML tag:
 * ```
 * <Text style="heading" size={24} asChild>
 *   <h2>Hello World!</h2>
 * </Text>
 * ```
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	({ className, size, style, trim, asChild, ...props }, ref) => {
		const Element = asChild ? Slot : "p"

		return (
			<Element
				ref={ref}
				className={text({ className, size, style, trim })}
				{...props}
			/>
		)
	},
)

Text.displayName = "Text"
