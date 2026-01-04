export async function set_allow_level_downloads(
	params: { level_id: string; allow: boolean },
	env: Ctx,
): Promise<boolean> {
	const { level_id, allow } = params;

	const query = env.sql`
		INSERT INTO downloads (level_id, allow)
		VALUES (${level_id}, ${+allow})
		ON CONFLICT(level_id)
		DO UPDATE SET
			allow = excluded.allow
	`;

	const { success } = await query.run();

	return success;
}
