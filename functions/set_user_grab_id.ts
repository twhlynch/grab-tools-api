export async function set_user_grab_id(
	params: { meta_id: string; grab_id: string },
	env: Ctx,
): Promise<boolean> {
	const { meta_id, grab_id } = params;

	const query = env.sql`
		UPDATE users
		SET grab_id = ${grab_id}
		WHERE meta_id = ${meta_id}
	`;

	const { success } = await query.run();

	return success;
}
