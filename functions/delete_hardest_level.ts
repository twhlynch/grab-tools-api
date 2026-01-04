export async function delete_hardest_level(
	params: { level_id: string },
	env: Ctx,
): Promise<boolean> {
	const { level_id } = params;
	const { DB } = env;

	const position_query = DB.prepare(`
		SELECT position
		FROM list
		WHERE level_id = ?
	`);

	const row = await position_query
		.bind(level_id)
		.first<{ position: number }>();

	if (!row) return true; // doesnt exist

	const { position } = row;

	const delete_query = DB.prepare(`
		DELETE FROM list
		WHERE level_id = ?
	`);

	const shift_query = DB.prepare(`
		UPDATE list
		SET position = position - 1
		WHERE position > ?
	`);

	const results = await DB.batch([
		delete_query.bind(level_id),
		shift_query.bind(position),
	]);

	return results.every((r) => r.success);
}
