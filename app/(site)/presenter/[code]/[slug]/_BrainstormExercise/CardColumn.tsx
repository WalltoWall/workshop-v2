"use client"

import React from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import { CirclePicker } from "@/components/CirclePicker"
import { ContextMenu } from "@/components/ContextMenu"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import type { MultiplayerData } from "@/components/Multiplayer/use-multiplayer"
import { Popover } from "@/components/Popover"
import type { BrainstormColumn } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import type { BrainstormActions } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/use-multiplayer-brainstorm"
import { PresentColumnModal } from "./PresentColumnModal"

interface CardColumnProps {
	actions: BrainstormActions
	column: BrainstormColumn
	columns: BrainstormColumn[]
	index: number
	multiplayer: MultiplayerData
}

export const CardColumn = ({
	column,
	columns,
	index,
	actions,
	multiplayer,
}: CardColumnProps) => {
	const colorGroups = [
		"#FE9487",
		"#FE9E77",
		"#FFEE8A",
		"#96F7D0",
		"#A5AFFF",
		"#D59FF8",
		"#FFB7EF",
	]

	return (
		<div className="w-[19.125rem] animate-fadeIn rounded-2xl bg-gray-90 px-2 py-3">
			<div className="flex items-center gap-2">
				<Popover
					trigger={
						<button
							className="h-5 w-5 rounded-full border border-black"
							style={{ backgroundColor: column.color }}
							type="button"
						/>
					}
					className="grid rounded-lg bg-black py-3 pl-3 pr-2"
					align="start"
					alignOffset={10}
					side="right"
				>
					<CirclePicker
						color={column.color}
						colors={colorGroups}
						className="w-[6.5rem]"
						onChange={(color) =>
							actions.editColumnColor({ color: color, columnId: column.id })
						}
					/>
				</Popover>

				<input
					onChange={(e) =>
						actions.editColumnTitle({
							title: e.target.value,
							columnId: column.id,
						})
					}
					value={column.title}
					placeholder="New Column"
					name="columnTitle"
					className="grow bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading placeholder:text-gray-58"
				/>

				<div className="flex items-center gap-3">
					<PresentColumnModal columns={columns} index={index} />

					<button
						onClick={() => actions.deleteColumn({ columnId: column.id })}
						type="button"
					>
						<BlackXIcon className="w-7" />
					</button>
				</div>
			</div>

			<Droppable droppableId={column.id} direction="vertical">
				{(provided) => (
					<div
						className="mt-3 h-full min-h-[200px] w-full"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{column.cards.map((card, idx) => (
							<Draggable index={idx} draggableId={card.id} key={card.id}>
								{(cardProvided, cardSnapshot) => (
									<ContextMenu
										card={card}
										color={column.color}
										cardProvided={cardProvided}
										cardSnapshot={cardSnapshot}
										idx={idx}
										columnId={column.id}
										actions={actions}
										multiplayer={multiplayer}
									/>
								)}
							</Draggable>
						))}

						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	)
}
