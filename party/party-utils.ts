export function json(data: string) {
	return new Response(data, {
		headers: { "Content-Type": "application/json" },
	})
}
