import { build_url, safe_fetch_json } from '../utils';

export async function get_meta_oauth_token(
	params: { org_scoped_id: string; code: string },
	env: Ctx,
): Promise<string | null> {
	const { org_scoped_id, code } = params;
	const { META_APP_ID, META_APP_SECRET, META_API } = env;

	const access_token = `OC|${META_APP_ID}|${META_APP_SECRET}`;

	const url = build_url(`${META_API}sso_authorize_code`, {
		code,
		access_token,
		org_scoped_id,
	});

	const response = await safe_fetch_json<{ oauth_token: string }>(url, {
		method: 'POST',
	});
	if (!response?.oauth_token) return null;

	return response.oauth_token;
}
