"use client"

import { useParams } from "next/navigation"
import { Drawer } from "vaul"
import { Button } from "@/components/Button"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"
import { clearParticipantAction } from "./clear-participant-action"

interface ParticipantModalProps {
	participantName: string
	heading: string
	message: string
}

export const ParticipantModal = ({
	participantName,
	heading,
	message,
}: ParticipantModalProps) => {
	const params = useParams()

	return (
		<Drawer.Root shouldScaleBackground>
			<Text style="copy" size={16} className="ml-4 mr-auto">
				Hi,{" "}
				<Drawer.Trigger>
					<span className="underline">{participantName}</span>
				</Drawer.Trigger>
			</Text>

			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 w-full rounded-t-[24px] bg-white px-6 pb-10 pt-5 focus:outline-none">
					<div className="flex items-center justify-between">
						<Drawer.Title>
							<Text style="heading" size={24}>
								{heading}
							</Text>
						</Drawer.Title>

						<Drawer.Close>
							<span className="sr-only">Close</span>
							<BlackXIcon className="w-8" />
						</Drawer.Close>
					</div>

					<form
						className="flex flex-col gap-8"
						action={() => {
							if (typeof params.code !== "string") return

							clearParticipantAction(params.code)
						}}
					>
						<Text style="copy" className="mr-8 text-gray-50">
							{message}
						</Text>

						<Button>Confirm</Button>
					</form>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
