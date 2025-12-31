export default async function get_level_details(
	params: { level_id: string },
	_env: Env,
): Promise<LevelDetails | null> {
	const { level_id } = params;

	try {
		const response = await fetch(
			`https://api.slin.dev/grab/v1/details/${level_id.replace(':', '/')}`,
		);

		return await response.json();
	} catch {
		return null;
	}
}
