export async function set_allow_level_downloads(
	params: { level_id: string; allow: boolean | null },
	env: Ctx,
): Promise<{ success: boolean } | null> {
	const { level_id, allow } = params;

	const query =
		allow === null
			? env.sql`
		DELETE FROM downloads
		WHERE level_id = ${level_id}
	`
			: env.sql`
		INSERT INTO downloads (level_id, allow)
		VALUES (${level_id}, ${+allow})
		ON CONFLICT(level_id)
		DO UPDATE SET
			allow = excluded.allow
	`;

	const { success } = await query.run();
	if (!success) return null;

	return { success };
}
