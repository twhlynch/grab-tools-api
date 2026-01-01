export async function set_user_token(
	params: { meta_id: string; access_token: string },
	env: Env,
): Promise<Boolean> {
	const { meta_id, access_token } = params;
	const { DB } = env;

	const query = DB.prepare(`
		INSERT INTO tokens (meta_id, token, expiry)
		VALUES (?, ?, ?)
		ON CONFLICT(meta_id)
		DO UPDATE SET
			token = excluded.token,
			expiry = excluded.expiry
	`);

	const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

	const { success } = await query.bind(meta_id, access_token, expiry).run();

	return success;
}
