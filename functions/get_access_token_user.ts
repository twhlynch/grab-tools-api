import { clean_user_booleans } from '../utils';

export async function get_access_token_user(
	params: { access_token: string },
	env: Ctx,
): Promise<UsersRow | null> {
	const { access_token } = params;

	const token_query = env.sql`
		SELECT *
		FROM tokens
		WHERE token = ${access_token}
	`;

	const token_row = await token_query.first<TokensRow | null>();
	if (!token_row) return null;
	const { meta_id, expiry } = token_row;

	// check expiry
	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

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
