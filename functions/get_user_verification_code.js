export default async function get_user_verification_code(params, env) {
	const { meta_id } = params;

	const query = env.DB.prepare(`
		SELECT *
		FROM codes
		WHERE meta_id = ?
	`);

	const row = await query.bind(meta_id).first();
	if (!row) return null;

	const { code, expiry } = row;

	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

	return `GT-${code}`;
}
