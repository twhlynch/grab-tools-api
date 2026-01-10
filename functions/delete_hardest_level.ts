export async function delete_hardest_level(
	params: { level_id: string },
	env: Ctx,
): Promise<ListRow | null> {
	const { level_id } = params;
	const { DB } = env;

	const position_query = env.sql`
		SELECT *
		FROM list
		WHERE level_id = ${level_id}
	`;

	const row = await position_query.first<ListRow>();
	if (!row) return null; // doesnt exist

	const { position } = row;

	const delete_query = env.sql`
		DELETE FROM list
		WHERE level_id = ${level_id}
	`;

	const shift_query = env.sql`
		UPDATE list
		SET position = position - 1
		WHERE position > ${position}
	`;

	const results = await DB.batch([delete_query, shift_query]);

	const success = results.every((r) => r.success);
	if (!success) return null;

	return row;
}
