export async function get_user_verification_code(
	params: { meta_id: string },
	env: Ctx,
): Promise<string | null> {
	const { meta_id } = params;

	const query = env.sql`
		SELECT *
		FROM codes
		WHERE meta_id = ${meta_id}
	`;

	const row = await query.first<CodesRow | null>();
	if (!row) return null;
	const { code, expiry } = row;

	// check expiry
	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

	return `GT-${code}`;
}
