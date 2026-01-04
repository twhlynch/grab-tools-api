export async function set_user_info(
	params: { meta_id: string; user_name: string },
	env: Ctx,
): Promise<boolean> {
	const { meta_id, user_name } = params;

	const query = env.sql`
		INSERT INTO users (meta_id, grab_id, user_name, is_admin)
		VALUES (${meta_id}, ${null}, ${user_name}, ${0})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			user_name = excluded.user_name
	`;

	const { success } = await query.run();

	return success;
}
