export async function get_allow_level_downloads(
	params: { level_id: string },
	env: Ctx,
): Promise<{ allow: boolean | null } | null> {
	const { level_id } = params;
	const { DB } = env;

	const user_id = level_id.split(':')[0];

	// 2 = null
	const query = DB.prepare(`
		SELECT
			COALESCE(level.allow, user.allow, 2) AS allow
		FROM downloads level
		LEFT JOIN user_downloads user
			ON user.grab_id = ?
		WHERE level.level_id = ?;
	`);

	const result = await query
		.bind(user_id, level_id)
		.first<{ allow: 0 | 1 | 2 } | null>();

	if (!result) return null;

	return {
		allow: {
			0: false,
			1: true,
			2: null,
		}[result.allow],
	};
}
