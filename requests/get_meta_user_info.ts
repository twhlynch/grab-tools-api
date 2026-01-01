import { META_API } from '../config';
import { build_url, safe_fetch_json } from '../utils';

export async function get_meta_user_info(
	params: { access_token: string },
	_env: Env,
): Promise<{ meta_id: string; user_name: string } | null> {
	const { access_token } = params;

	const fields = [`id`, `alias`].join(',');

	const url = build_url(`${META_API}me`, {
		access_token,
		fields,
	});

	const response = await safe_fetch_json<{ id: string; alias: string }>(url);
	if (!response?.id) return null;

	return {
		meta_id: response.id,
		user_name: response.alias ?? '',
	};
}
