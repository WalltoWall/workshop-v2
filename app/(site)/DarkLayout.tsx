import Link from "next/link"
import { Logo } from "@/components/Logo"

export const DarkLayout = (props: { children: React.ReactNode }) => {
	return (
		<main
			id="main"
			className="grid min-h-svh overflow-hidden bg-black text-white"
		>
			<div className="mx-auto flex max-w-md flex-col justify-between">
				<Link href="/">
					<Logo className="relative -right-20 -top-10 ml-auto w-[20.3125rem]" />
				</Link>

				{props.children}
			</div>
		</main>
	)
}
