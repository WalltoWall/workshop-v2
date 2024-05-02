"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { DarkLayout } from "./DarkLayout"

const NotFound = () => {
	const router = useRouter()

	return (
		<DarkLayout>
			<div className="my-auto space-y-4 px-7 pb-20">
				<Text style="heading" size={40}>
					Not Found
				</Text>

				<Button color="gray" outline size="sm" onClick={() => router.back()}>
					Go back
				</Button>
			</div>
		</DarkLayout>
	)
}

export default NotFound
