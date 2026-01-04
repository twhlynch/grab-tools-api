export async function generate_verification_code(
	params: { meta_id: string },
	env: Ctx,
): Promise<string | null> {
	const { meta_id } = params;

	const code = gen_code();
	const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

	const query = env.sql`
		INSERT INTO codes (meta_id, code, expiry)
		VALUES (${meta_id}, ${code}, ${expiry})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			code = excluded.code,
			expiry = excluded.expiry
	`;

	const { success } = await query.bind(meta_id, code, expiry).run();
	if (!success) return null;

	return code;
}

function gen_code() {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let code = '';
	for (let i = 0; i < 8; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return code;
}
