import "./globals.css"
import type { Metadata, Viewport } from "next"
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
		<html
			lang="en"
			className={cx(
				FontSans.variable,
				FontHeading.variable,
				FontSerif.variable,
			)}
		>
			<head />
			<body className="font-normal antialiased leading-copy font-sans">
				<div vaul-drawer-wrapper="">{children}</div>

				<Toaster richColors />
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "UnWorkshop",
	description: "Look in. Stand out.",
	metadataBase:
		env.NODE_ENV === "production"
			? new URL("https://unworkshop.walltowall.com")
			: new URL("http://localhost:3000"),
}

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#fff",
}

export default RootLayout
