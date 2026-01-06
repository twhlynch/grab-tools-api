export async function get_allow_level_downloads(
	params: { level_id: string },
	env: Ctx,
): Promise<{ allow: boolean | null } | null> {
	const { level_id } = params;

	const user_id = level_id.split(':')[0];

	const query = env.sql`
		SELECT
			COALESCE(level.allow, user.allow, -1) AS allow
		FROM downloads level
		LEFT JOIN user_downloads user
			ON user.grab_id = ${user_id}
		WHERE level.level_id = ${level_id};
	`;

	const result = await query.first<{ allow: 0 | 1 | -1 } | null>();
	if (!result) return { allow: null };

	return {
		allow: {
			0: false,
			1: true,
			[-1]: null,
		}[result.allow],
	};
}
