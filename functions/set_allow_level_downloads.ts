export async function set_allow_level_downloads(
	params: { level_id: string; allow: boolean },
	env: Env,
): Promise<boolean> {
	const { level_id, allow } = params;
	const { DB } = env;

	const query = DB.prepare(`
		INSERT INTO downloads (level_id, allow)
		VALUES (?, ?)
		ON CONFLICT(level_id)
		DO UPDATE SET
			allow = excluded.allow
	`);

	const { success } = await query.bind(level_id, allow ? 1 : 0).run();

	return success;
}
