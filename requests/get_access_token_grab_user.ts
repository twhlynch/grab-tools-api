import { GRAB_API } from '../config';
import { build_url, safe_fetch_json } from '../utils';

// doesnt work yet, uses placeholder endpoint
export default async function get_access_token_grab_user(
	params: { access_token: string },
	_env: Env,
): Promise<UserInfo | null> {
	const { access_token } = params;

	const url = build_url(`${GRAB_API}get_user_info`, {
		access_token,
	});

	return await safe_fetch_json<UserInfo>(url);
}
