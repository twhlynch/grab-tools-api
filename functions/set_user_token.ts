const MAX_ACCESS_TOKENS = 3;

export async function set_user_token(
	params: { meta_id: string; access_token: string },
	env: Ctx,
): Promise<{ expiry: number } | null> {
	const { meta_id, access_token } = params;
	const { DB } = env;

	const now = Math.floor(Date.now() / 1000);
	const expiry = now + 24 * 60 * 60 * 7;

	// remove all but up to two newest active tokens
	const cleanup_query = env.sql`
		DELETE FROM tokens
		WHERE meta_id = ${meta_id}
			AND (
				expiry <= ${now}
				OR rowid NOT IN (
					SELECT rowid
					FROM tokens
					WHERE meta_id = ${meta_id}
						AND expiry > ${now}
					ORDER BY rowid DESC
					LIMIT ${MAX_ACCESS_TOKENS - 1}
				)
			)
	`;

	const insert_query = env.sql`
		INSERT INTO tokens (meta_id, token, expiry)
		VALUES (${meta_id}, ${access_token}, ${expiry})
	`;

	const results = await DB.batch([cleanup_query, insert_query]);

	const success = results.every((r) => r.success);
	if (!success) return null;

	return { expiry };
}
