import { clean_user_booleans } from '../utils';

export async function get_access_token_user(
	params: { access_token: string },
	env: Env,
): Promise<UsersRow | null> {
	const { access_token } = params;
	const { DB } = env;

	const token_query = DB.prepare(`
		SELECT *
		FROM tokens
		WHERE token = ?
	`);

	const token_row = await token_query
		.bind(access_token)
		.first<TokensRow | null>();
	if (!token_row) return null;

	const { meta_id, expiry } = token_row;

	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

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
