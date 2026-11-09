export async function delete_user_token(
	params: { token: string },
	env: Ctx,
): Promise<boolean> {
	const { token } = params;

	const query = env.sql`
		DELETE FROM tokens
		WHERE token = ${token}
	`;

	const { success } = await query.run();
	return success;
}
