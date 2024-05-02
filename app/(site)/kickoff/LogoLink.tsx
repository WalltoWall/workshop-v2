"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Logo } from "@/components/Logo"

export const LogoLink = () => {
	const params = useParams()

	const code = Array.isArray(params.code) ? undefined : params.code

	return (
		<Link href={params.code ? `/kickoff/${code}/exercises` : "/"}>
			<Logo className="w-[46px]" />
		</Link>
	)
}
