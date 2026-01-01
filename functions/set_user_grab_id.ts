export async function set_user_grab_id(
	params: { meta_id: string; grab_id: string },
	env: Env,
): Promise<boolean> {
	const { meta_id, grab_id } = params;
	const { DB } = env;

	const query = DB.prepare(`
		UPDATE users
		SET grab_id = ?
		WHERE meta_id = ?
	`);

	const { success } = await query.bind(grab_id, meta_id).run();

	return success;
}
