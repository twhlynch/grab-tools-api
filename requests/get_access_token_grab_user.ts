import { GRAB_API } from '../config';
import { build_url, safe_fetch_json } from '../utils';

export async function get_access_token_grab_user(
	params: { access_token: string },
	_env: Ctx,
): Promise<UserInfo | null> {
	const { access_token } = params;

	const url = build_url(`${GRAB_API}get_user_info_auth`, {
		access_token,
	});

	const response = await safe_fetch_json<UserInfo>(url);

	return response;
}
