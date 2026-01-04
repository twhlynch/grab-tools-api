export async function get_hardest_levels_list(
	_params: {},
	env: Ctx,
): Promise<Array<ListRow> | null> {
	const query = env.sql`
		SELECT *
		FROM list
		LIMIT 100
	`;

	const { success, results } = await query.all<ListRow>();
	if (!success) return null;

	return results;
}
