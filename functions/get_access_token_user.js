export default async function get_access_token_user(params, env) {
	const { access_token } = params;

	const token_query = env.DB.prepare(`
		SELECT *
		FROM tokens
		WHERE token = ?
	`);

	const token_row = await token_query.bind(access_token).first();
	if (!token_row) return null;

	const { meta_id, expiry } = token_row;

	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

	const query = env.DB.prepare(`
		SELECT *
		FROM users
		WHERE meta_id = ?
		LIMIT 1
	`);

	const row = await query.bind(meta_id).first();

	return row;
}
