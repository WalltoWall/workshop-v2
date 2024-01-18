"use client"

import * as Context from "@radix-ui/react-context-menu"
import React, { startTransition, type CSSProperties } from "react"
import { type DraggableProvided } from "@hello-pangea/dnd"
import { deleteParticipantAnswer } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/actions"
import type {
	Card,
	Column,
	Columns,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/BrainstormPresenterViewClient"
import type { ColumnsDispatch } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/helpers"
import { Text } from "./Text"

const ContextMenuItem = ({
	children,
	onClick,
}: Context.ContextMenuItemProps) => {
	return (
		<Context.Item onClick={onClick}>
			<Text
				className="px-3 py-2 text-white hover:cursor-pointer hover:bg-yellow-58 hover:text-black"
				style={"contextMenu"}
				size={14}
				trim
			>
				{children}
			</Text>
		</Context.Item>
	)
}

interface ContextMenuProps extends React.ComponentPropsWithoutRef<"div"> {
	columns: Columns
	card: Card
	color: string
	exerciseSlug: string
	cardProvided: DraggableProvided
	submitForm: (data: ColumnsDispatch) => void
}

export const ContextMenu = ({
	columns,
	card,
	color,
	exerciseSlug,
	cardProvided,
	submitForm,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)

	const handleReturnItem = () => {
		const fromColumn = columns.find((col) =>
			col.cards.find((c) => c.id === card.id),
		)

		if (!fromColumn) return

		const fromIdx = columns.findIndex(
			(col) => col.columnId === fromColumn.columnId,
		)

		const activeCard = fromColumn.cards.find((c) => c.id === card.id)

		const newFromCards = fromColumn.cards.filter((c) => c.id !== card.id)

		if (!activeCard) return

		columns[fromIdx].cards = newFromCards
		columns[0].cards = [activeCard, ...columns[0].cards]

		submitForm({ type: "Update Columns", replaceColumns: columns })
	}

	const handleEditItem = () => {
		setReadOnly(false)
		console.log(readOnly)
	}

	const handleDeleteItem = () => {
		let fromColumnCards
		let fromColumnId

		for (const key in columns) {
			if (columns[key].cards.some((c) => c.id === card.id)) {
				fromColumnId = key
				fromColumnCards = columns[key].cards
				break
			}
		}

		if (!fromColumnId || !fromColumnCards) return

		// startTransition(() => {
		// 	deleteParticipantAnswer({ cardId: card.id, exerciseSlug: exerciseSlug })
		// })
	}

	const finalizeEdit = (newResponse: string) => {
		card.response = newResponse
		setReadOnly(true)

		// edit participants answer
	}

	const style: CSSProperties = {
		backgroundColor: color,
	}

	return (
		<Context.Root>
			<Context.Trigger>
				<li
					id={card.id}
					className={
						"box-border flex list-none items-center rounded-lg px-3 py-2.5"
					}
					ref={cardProvided.innerRef}
					{...cardProvided.draggableProps}
					{...cardProvided.dragHandleProps}
					style={{ ...style, ...cardProvided.draggableProps.style }}
				>
					<textarea
						suppressHydrationWarning
						defaultValue={card.response}
						className="pointer-events-none h-[40px] w-full resize-none bg-transparent scrollbar-hide focus:outline-none"
						readOnly={readOnly}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								finalizeEdit(e.currentTarget.value)
							}
						}}
					/>
				</li>
			</Context.Trigger>

			<Context.Portal>
				<Context.Content className="flex min-w-[120px] flex-col overflow-hidden rounded-lg bg-black py-1.5">
					<ContextMenuItem onClick={() => handleEditItem()}>
						Edit
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleReturnItem()}>
						Return to sorter
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleDeleteItem()}>
						Delete
					</ContextMenuItem>
				</Context.Content>
			</Context.Portal>
		</Context.Root>
	)
}
