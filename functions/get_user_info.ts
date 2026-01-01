import { clean_user_booleans } from '../utils';

export async function get_user_info(
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

	if (!row) return null;

	clean_user_booleans(row);

	return row;
}
