export async function get_hardest_levels_list(
	params: { limit?: number },
	env: Ctx,
): Promise<Array<ListRow> | null> {
	const LIMIT = 200;

	const limit = Math.min(params.limit ?? LIMIT, LIMIT);

	const query = env.sql`
		SELECT *
		FROM list
		LIMIT ${limit}
	`;

	const { success, results } = await query.all<ListRow>();
	if (!success) return null;

	return results;
}
