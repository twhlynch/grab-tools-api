import { clean_user_booleans } from '../utils';

export async function get_access_token_user(
	params: { access_token: string },
	env: Ctx,
): Promise<UsersRow | null> {
	const { access_token } = params;

	const now = Math.floor(Date.now() / 1000);

	const query = env.sql`
		SELECT users.*
		FROM tokens
		JOIN users
			ON users.meta_id = tokens.meta_id
		WHERE tokens.token = ${access_token}
			AND tokens.expiry > ${now}
		LIMIT 1
	`;

	const row = await query.first<UsersRow | null>();
	if (!row) return null;

	clean_user_booleans(row);

	return row;
}
