export async function set_user_token(
	params: { meta_id: string; access_token: string },
	env: Ctx,
): Promise<{ expiry: number } | null> {
	const { meta_id, access_token } = params;

	const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

	const query = env.sql`
		INSERT INTO tokens (meta_id, token, expiry)
		VALUES (${meta_id}, ${access_token}, ${expiry})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			token = excluded.token,
			expiry = excluded.expiry
	`;

	const { success } = await query.run();
	if (!success) return null;

	return { expiry };
}
