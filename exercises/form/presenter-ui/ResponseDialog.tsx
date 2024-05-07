import * as Dialog from "@radix-ui/react-dialog"
import snarkdown from "snarkdown"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"
import type { FormField } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"

type Props = {
	name: string
	questionNumber?: number
	field: FormField
	trigger: React.ReactNode
	children: React.ReactNode
}

export const ResponseDialog = ({
	name,
	trigger,
	children,
	field,
	questionNumber,
}: Props) => {
	return (
		<Dialog.Root>
			<Dialog.Trigger className="ease flex w-full max-w-[25rem] shrink-0 flex-col gap-5 rounded-2xl bg-gray-90 p-5 text-left transition duration-300 hover:bg-gray-82">
				<Text asChild style="heading" size={24}>
					<h4>{name}</h4>
				</Text>

				{trigger}
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid min-h-[46.25rem] w-[min(67rem,100%-2.5rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto,1fr,auto] gap-12 rounded-[23px] bg-white p-9">
					<div className="flex justify-between gap-12">
						<div className="flex items-end gap-20">
							<Text size={40} style="heading">
								Question {questionNumber}
							</Text>

							<Text
								size={16}
								dangerouslySetInnerHTML={{
									__html: snarkdown(field.prompt),
								}}
							/>
						</div>

						<Dialog.Close className="ease h-8 w-8 text-black transition duration-200 hover:text-red-63">
							<span className="sr-only">Close</span>
							<BlackXIcon className="h-8 w-8" />
						</Dialog.Close>
					</div>

					<div>{children}</div>

					<Dialog.Title className="justfify-self-center text-center">
						<Text style="heading" size={32}>
							{name}
						</Text>
					</Dialog.Title>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
