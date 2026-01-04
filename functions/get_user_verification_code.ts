export async function get_user_verification_code(
	params: { meta_id: string },
	env: Ctx,
): Promise<string | null> {
	const { meta_id } = params;

	const now = Math.floor(Date.now() / 1000);

	const query = env.sql`
		SELECT code
		FROM codes
		WHERE meta_id = ${meta_id}
			AND expiry > ${now}
	`;

	const row = await query.first<CodesRow | null>();
	if (!row) return null;
	const { code } = row;

	return `GT-${code}`;
}
