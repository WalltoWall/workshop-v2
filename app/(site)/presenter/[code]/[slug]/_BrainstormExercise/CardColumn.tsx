"use client"

import React from "react"
import { SwatchesPicker } from "react-color"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import clsx from "clsx"
import debounce from "just-debounce-it"
import { ContextMenu } from "@/components/ContextMenu"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import type { Columns } from "./BrainstormPresenterViewClient"
import type { ColumnsDispatch } from "./helpers"
import { PresentColumnModal } from "./PresentColumnModal"

interface CardColumnProps {
	cards: Array<{ response: string; id: string }>
	id: string
	colorHex: string
	columnTitle: string
	columns: Columns
	exerciseSlug: string
	submitFunction: (data: ColumnsDispatch) => void
}

export const CardColumn = ({
	cards,
	colorHex,
	columnTitle,
	columns,
	id,
	exerciseSlug,
	submitFunction,
}: CardColumnProps) => {
	const [color, setColor] = React.useState<string>(colorHex || "#96fad1")
	const [showPicker, setShowPicker] = React.useState(false)

	const colorGroups = [
		["#ff9488", "#ff7566", "#ff5745", "#e8503f", "#ba4033"],
		["#ff9e77", "#ff8655", "#ff7a45", "#e86f3f", "#d16439"],
		["#ffee8b", "#ffe96a", "#ffe54a", "#e8d144", "#d1bc3d"],
		["#96fad1", "#57f7b6", "#19f49b", "#17de8d", "#13b271"],
		["#a6afff", "#7987ff", "#5c6dff", "#4c5ad1", "#4350ba"],
		["#d7a0fa", "#c371f8", "#b652f7", "#a64be1", "#853cb4"],
		["#ffb7f1", "#fab99e", "#ff93ea", "#ff7be6", "#e870d2", "#e165bd"],
		[
			"#f7f7f7",
			"#E5E5E5",
			"#cdd6d4",
			"#bfbfbf",
			"#7f7f7f",
			"#8ca09c",
			"#5a6c69",
			"#2c3533",
		],
	]

	const debounceTitle = debounce(
		(title: string) =>
			submitFunction({
				type: "Update Title",
				columnId: id,
				columnTitle: title,
			}),
		2000,
	)

	return (
		<div className=" w-[306px] animate-fadeIn rounded-2xl bg-gray-90 px-2 py-3">
			<div className="flex items-center justify-between">
				<div className="relative flex items-center gap-2">
					<SwatchesPicker
						colors={colorGroups}
						onChange={(newColor) => {
							setColor(newColor.hex)
							setShowPicker(false)
							submitFunction({
								type: "Update Color",
								color: newColor.hex,
								columnId: id,
							})
						}}
						className={clsx("absolute", showPicker ? "block" : "hidden")}
					/>
					<button
						className="h-5 w-5 rounded-full border border-black"
						style={{ backgroundColor: color }}
						onClick={() => setShowPicker(!showPicker)}
						type="button"
					></button>
					<input
						onChange={(e) => debounceTitle(e.currentTarget.value)}
						defaultValue={columnTitle}
						name="columnTitle"
						className="bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading"
					/>
				</div>
				<div className="flex items-center gap-3">
					<PresentColumnModal
						cards={cards}
						color={color}
						columnTitle={columnTitle}
					/>
					<button
						onClick={() =>
							submitFunction({ type: "Delete Column", columnId: id })
						}
						type="button"
					>
						<BlackXIcon className="w-7" />
					</button>
				</div>
			</div>

			<Droppable droppableId={id} direction="vertical">
				{(provided, snapshot) => (
					<ul
						className="mt-5 flex h-full min-h-[200px] w-full flex-col gap-2"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{cards.length > 0 &&
							cards.map((card, idx) => (
								<Draggable index={idx} draggableId={card.id} key={card.id}>
									{(cardProvided, cardSnapshot) => (
										<ContextMenu
											columns={columns}
											card={card}
											color={color}
											exerciseSlug={exerciseSlug}
											cardProvided={cardProvided}
											submitForm={submitFunction}
											cardSnapshot={cardSnapshot}
										/>
									)}
								</Draggable>
							))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</div>
	)
}
