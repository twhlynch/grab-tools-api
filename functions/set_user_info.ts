export async function set_user_info(
	params: { meta_id: string; user_name: string },
	env: Ctx,
): Promise<{ success: boolean } | null> {
	const { meta_id, user_name } = params;

	const query = env.sql`
		INSERT INTO users (meta_id, grab_id, user_name)
		VALUES (${meta_id}, ${null}, ${user_name})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			user_name = excluded.user_name
	`;

	const { success } = await query.run();
	if (!success) return null;

	return { success };
}
