export default async function get_hardest_levels_list(
	_params: {},
	env: Env,
): Promise<Array<ListRow> | null> {
	const { DB } = env;

	const query = DB.prepare(`
		SELECT *
		FROM list
		LIMIT 100
	`);

	const { success, results } = await query.all<ListRow>();
	if (!success) return null;

	return results;
}
