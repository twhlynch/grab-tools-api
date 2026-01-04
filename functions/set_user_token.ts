export async function set_user_token(
	params: { meta_id: string; access_token: string },
	env: Ctx,
): Promise<boolean> {
	const { meta_id, access_token } = params;

	const day_expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

	const query = env.sql`
		INSERT INTO tokens (meta_id, token, expiry)
		VALUES (${meta_id}, ${access_token}, ${day_expiry})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			token = excluded.token,
			expiry = excluded.expiry
	`;

	const { success } = await query.run();

	return success;
}
