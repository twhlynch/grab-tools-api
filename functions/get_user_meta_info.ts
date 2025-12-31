export default async function get_user_meta_info(
	params: { access_token: string },
	_env: Env,
): Promise<{ meta_id: string; user_name: string } | null> {
	const { access_token } = params;

	const user_info_response = await fetch(
		`https://graph.oculus.com/me?access_token=${access_token}&fields=id,alias`,
	);

	if (!user_info_response.ok) {
		console.error(await user_info_response.text());
		return null;
	}

	const user_info: { id: string; alias: string } =
		await user_info_response.json();

	return {
		meta_id: user_info.id,
		user_name: user_info.alias,
	};
}
