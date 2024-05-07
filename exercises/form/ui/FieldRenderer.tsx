import { unreachable } from "@/lib/unreachable"
import { useFieldContext } from "./FieldContext"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
import { TaglineField } from "./TaglineField"
import { TextField } from "./TextField"

export const FieldRenderer = () => {
	const { field } = useFieldContext()

	switch (field.type) {
		case "List": {
			return <ListField key={field.prompt} />
		}

		case "Narrow":
			return <NarrowField key={field.prompt} />

		case "Text":
		case "Big Text":
			return <TextField key={field.prompt} />

		case "Tagline":
			return <TaglineField key={field.prompt} />

		default:
			return unreachable(field.type)
	}
}
