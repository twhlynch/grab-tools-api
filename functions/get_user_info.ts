import { clean_user_booleans } from '../utils';

export async function get_user_info(
	params: { meta_id: string },
	env: Ctx,
): Promise<UsersRow | null> {
	const { meta_id } = params;

	const query = env.sql`
		SELECT *
		FROM users
		WHERE meta_id = ${meta_id}
		LIMIT 1
	`;

	const row = await query.first<UsersRow | null>();
	if (!row) return null;

	clean_user_booleans(row);

	return row;
}
