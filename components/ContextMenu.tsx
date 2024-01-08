"use client"

import * as Context from "@radix-ui/react-context-menu"
import React from "react"
import type {
	Card,
	Columns,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/BrainstormPresenterViewClient"
import {
	Draggable,
	SortableItem,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/SortableItem"
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
	setCols: (value: React.SetStateAction<Columns>) => void
	columns: Columns
	card: Card
	color: string
}

export const ContextMenu = ({
	setCols,
	columns,
	card,
	color,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)

	const handleReturnItem = () => {
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

		const toColumnCards = columns["sorting"].cards
		const activeCard = fromColumnCards.find((c) => c.id === card.id)

		if (!activeCard) return

		toColumnCards.unshift(activeCard)

		setCols({
			...columns,
			["sorting"]: {
				...columns["sorting"],
				cards: toColumnCards,
			},
			[fromColumnId]: {
				...columns[fromColumnId],
				cards: fromColumnCards.filter((c) => c.id !== card.id),
			},
		})

		// formRef.current?.requestSubmit()
	}

	const handleEditItem = () => {
		setReadOnly(false)
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

		setCols({
			...columns,
			[fromColumnId]: {
				...columns[fromColumnId],
				cards: fromColumnCards.filter((c) => c.id === card.id),
			},
		})

		// formRef.current?.requestSubmit()

		// call delete function to find participant that matches that card and delete it from the participants answer list
	}

	const finalizeEdit = (newResponse: string) => {
		card.response = newResponse
		setReadOnly(true)

		// edit participants answer

		// formRef.current?.requestSubmit()
	}

	return (
		<Context.Root>
			<Context.Trigger>
				<SortableItem
					id={card.id}
					color={color}
					className="box-border flex cursor-move list-none items-center rounded-lg px-3 py-2.5"
				>
					<Draggable
						response={card.response}
						readOnly={readOnly}
						onEnterKeyDown={finalizeEdit}
						className="h-[40px] w-full cursor-move resize-none bg-transparent scrollbar-hide focus:outline-none"
					/>
				</SortableItem>
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