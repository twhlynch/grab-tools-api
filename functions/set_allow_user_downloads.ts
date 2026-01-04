export async function set_allow_user_downloads(
	params: { user_id: string; allow: boolean },
	env: Ctx,
): Promise<boolean> {
	const { user_id, allow } = params;
	const { DB } = env;

	const query = DB.prepare(`
		INSERT INTO user_downloads (grab_id, allow)
		VALUES (?, ?)
		ON CONFLICT(grab_id)
		DO UPDATE SET
			allow = excluded.allow
	`);

	const { success } = await query.bind(user_id, allow ? 1 : 0).run();

	return success;
}
