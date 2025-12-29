export default async function get_user_info(params, env) {
	const { meta_id } = params;

	const query = env.DB.prepare(`
		SELECT meta_id, grab_id, user_name, is_admin
		FROM users
		WHERE meta_id = ?
		LIMIT 1
	`);

	const row = await query.bind(meta_id).first();

	return row;
}
