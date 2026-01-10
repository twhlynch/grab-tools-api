export async function generate_verification_code(
	params: { meta_id: string },
	env: Ctx,
): Promise<{ code: string } | null> {
	const { meta_id } = params;

	const code = generate_code();
	const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

	const query = env.sql`
		INSERT INTO codes (meta_id, code, expiry)
		VALUES (${meta_id}, ${code}, ${expiry})
		ON CONFLICT(meta_id)
		DO UPDATE SET
			code = excluded.code,
			expiry = excluded.expiry
	`;

	const { success } = await query.run();
	if (!success) return null;

	return { code };
}

function generate_code() {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let code = '';
	for (let i = 0; i < 8; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return code;
}
