export default async function get_user_info(
	params: { meta_id: string },
	env: Env,
): Promise<UsersRow | null> {
	const { meta_id } = params;
	const { DB } = env;

	const query = DB.prepare(`
		SELECT *
		FROM users
		WHERE meta_id = ?
		LIMIT 1
	`);

	const row = await query.bind(meta_id).first<UsersRow | null>();

	return row;
}
