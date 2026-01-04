export async function set_allow_user_downloads(
	params: { user_id: string; allow: boolean },
	env: Ctx,
): Promise<boolean> {
	const { user_id, allow } = params;

	const query = env.sql`
		INSERT INTO user_downloads (grab_id, allow)
		VALUES (${user_id}, ${+allow})
		ON CONFLICT(grab_id)
		DO UPDATE SET
			allow = excluded.allow
	`;

	const { success } = await query.run();

	return success;
}
