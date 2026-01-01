export async function get_allow_level_downloads(
	params: { level_id: string },
	env: Env,
): Promise<boolean> {
	const { level_id } = params;
	const { DB } = env;

	const user_id = level_id.split(':')[0];

	const query = DB.prepare(`
		SELECT
			COALESCE(level.allow, user.allow, 0) AS allow
		FROM downloads level
		LEFT JOIN user_downloads user
			ON user.grab_id = ?
		WHERE level.level_id = ?;
	`);

	const result = await query
		.bind(user_id, level_id)
		.first<{ allow: number } | null>();

	return !!result?.allow;
}
