import { build_url, safe_fetch_json } from '../utils';

// doesnt work yet, uses placeholder endpoint
export async function get_access_token_grab_user(
	params: { access_token: string },
	env: Ctx,
): Promise<UserInfo | null> {
	const { access_token } = params;
	const { GRAB_API } = env;

	const url = build_url(`${GRAB_API}get_user_info`, {
		access_token,
	});

	const response = await safe_fetch_json<UserInfo>(url);

	return response;
}
