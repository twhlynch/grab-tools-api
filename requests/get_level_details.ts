import { build_url, safe_fetch_json } from '../utils';

export async function get_level_details(
	params: { level_id: string },
	env: Ctx,
): Promise<LevelDetails | null> {
	const { level_id } = params;
	const { GRAB_API } = env;

	const [user_id, level_timestamp] = level_id.split(':');

	const url = build_url(`${GRAB_API}details/${user_id}/${level_timestamp}`);

	const response = await safe_fetch_json<LevelDetails>(url);

	return response;
}
