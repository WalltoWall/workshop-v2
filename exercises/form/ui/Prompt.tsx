import clsx from "clsx"
import snarkdown from "snarkdown"
import { ArrowRight } from "@/components/icons/ArrowRight"
import { Text } from "@/components/Text"

interface Props {
	num?: number
	children: string
	additionalText?: string
	className?: string
}

export const Prompt = (props: Props) => {
	return (
		<div className={clsx("flex items-start gap-2", props.className)}>
			{props.num !== undefined && (
				<div className="flex -translate-y-px items-center gap-0.5 text-gray-50">
					<Text asChild style="heading" size={16}>
						<p>{props.num}</p>
					</Text>

					<ArrowRight className="w-[13px]" />
				</div>
			)}

			<div className="space-y-3">
				<Text asChild size={16} style="copy" className="whitespace-pre-line">
					<h2 dangerouslySetInnerHTML={{ __html: snarkdown(props.children) }} />
				</Text>

				{props.additionalText && (
					<Text size={12} className="whitespace-pre-line text-gray-50">
						{props.additionalText}
					</Text>
				)}
			</div>
		</div>
	)
}
