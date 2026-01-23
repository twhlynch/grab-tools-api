export async function get_allow_user_levels_downloads(
	params: { user_id: string },
	env: Ctx,
): Promise<{ level_id: string; allow: boolean }[] | null> {
	const { user_id } = params;

	const query = env.sql`
		SELECT level_id, allow
		FROM downloads
		WHERE level_id LIKE ${user_id + ':%'};
	`;

	const result = await query.all<{ level_id: string; allow: 0 | 1 }>();
	if (!result) return [];

	return result.results.map((result) => ({
		level_id: result.level_id,
		allow: !!result.allow,
	}));
}
