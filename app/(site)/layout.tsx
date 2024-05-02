import "./globals.css"
import type { Metadata } from "next"
import Local from "next/font/local"
import { cx } from "class-variance-authority"
import { Toaster } from "sonner"
import { env } from "@/env"

const FontSans = Local({
	src: "../../assets/fonts/regular.woff2",
	display: "swap",
	variable: "--sans",
	weight: "400",
	style: "normal",
})

const FontHeading = Local({
	src: "../../assets/fonts/compressed.woff2",
	display: "swap",
	variable: "--heading",
	weight: "800",
	style: "normal",
})

const FontSerif = Local({
	src: "../../assets/fonts/serif.woff2",
	display: "swap",
	variable: "--serif",
	style: "normal",
})

type RootLayoutProps = {
	children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html lang="en" className="h-full">
			<head />

			<body
				className={cx(
					"h-full font-normal antialiased leading-copy font-sans",
					FontSans.variable,
					FontHeading.variable,
					FontSerif.variable,
				)}
			>
				<div
					vaul-drawer-wrapper=""
					className="flex min-h-svh flex-col bg-white"
				>
					{children}
				</div>

				<Toaster richColors />
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "UnWorkshop",
	description: "Look in. Stand out.",
	openGraph: { url: new URL(env.NEXT_PUBLIC_ROOT_URL) },
}

export default RootLayout
