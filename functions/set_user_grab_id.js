export default async function set_user_grab_id(params, env) {
	const { meta_id, grab_id } = params;

	const query = env.DB.prepare(`
		UPDATE users
		SET grab_id = ?
		WHERE meta_id = ?
	`);

	const { success } = await query.bind(grab_id, meta_id).run();

	return success;
}
