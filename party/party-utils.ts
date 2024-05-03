export function json(data: Record<string | number | symbol, unknown>) {
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	})
}
