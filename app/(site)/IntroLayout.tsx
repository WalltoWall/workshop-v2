import Link from "next/link"
import { cx } from "class-variance-authority"
import { Logo } from "@/components/Logo"

interface Props {
	children: React.ReactNode
	href?: string
	className?: string
}

const Layout = ({ children, href = "/", className }: Props) => {
	return (
		<main id="main" className={cx(className, "grid min-h-svh overflow-hidden")}>
			<div className="mx-auto flex max-w-md flex-col justify-between">
				<Link href={href}>
					<Logo className="relative -right-20 -top-10 ml-auto w-[20.3125rem]" />
				</Link>

				{children}
			</div>
		</main>
	)
}

export const IntroLayout = {
	Dark: (props: Omit<Props, "className">) => (
		<Layout className="bg-black text-white" {...props} />
	),
	Light: (props: Omit<Props, "className">) => (
		<Layout className="bg-white text-black" {...props} />
	),
}
