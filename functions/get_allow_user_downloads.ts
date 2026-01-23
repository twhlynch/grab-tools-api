export async function get_allow_user_downloads(
	params: { user_id: string },
	env: Ctx,
): Promise<{ allow: boolean } | null> {
	const { user_id } = params;

	const query = env.sql`
		SELECT allow
		FROM user_downloads
		WHERE grab_id = ${user_id};
	`;

	const result = await query.first<{ allow: 0 | 1 } | null>();
	if (!result) return { allow: false };

	return { allow: !!result.allow };
}
