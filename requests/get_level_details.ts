import { GRAB_API } from '../config';
import { build_url, safe_fetch_json } from '../utils';

export default async function get_level_details(
	params: { level_id: string },
	_env: Env,
): Promise<LevelDetails | null> {
	const { level_id } = params;

	const url = build_url(
		`${GRAB_API}details/${level_id.replace(':', '/')}`,
		{},
	);

	return await safe_fetch_json<LevelDetails>(url);
}
