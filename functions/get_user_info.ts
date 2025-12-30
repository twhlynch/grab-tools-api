import { UsersRow } from '../types';

export default async function get_user_info(
	params: { meta_id: string },
	env: Env,
): Promise<UsersRow | null> {
	const { meta_id } = params;

	const query = env.DB.prepare(`
		SELECT *
		FROM users
		WHERE meta_id = ?
		LIMIT 1
	`);

	const row: UsersRow | null = await query.bind(meta_id).first();

	return row;
}
