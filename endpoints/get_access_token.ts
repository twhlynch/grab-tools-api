import get_user_info from '../functions/get_user_info';
import get_user_meta_info from '../functions/get_user_meta_info';
import set_user_info from '../functions/set_user_info';
import set_user_token from '../functions/set_user_token';
import { Endpoint } from '../types';

const get_access_token: Endpoint = async (params, env) => {
	const { service_token } = params;
	const { META_APP_ID, META_APP_SECRET } = env;
	const app_token = `OC|${META_APP_ID}|${META_APP_SECRET}`;

	if (!service_token) {
		return { body: 'Missing service_token', status: 400 };
	}

	const [org_scoped_id, code] = service_token.split(':');

	const token_response = await fetch(
		`https://graph.oculus.com/sso_authorize_code?code=${code}&access_token=${app_token}&org_scoped_id=${org_scoped_id}`,
		{
			method: 'POST',
		},
	);
	if (!token_response.ok) {
		console.error(await token_response.text());
		return { body: 'SSO auth failed', status: 500 };
	}
	const token_json: { oauth_token: string } = await token_response.json();
	const access_token = token_json.oauth_token;

	// get meta info
	const meta_info = await get_user_meta_info({ access_token }, env);
	if (!meta_info) return { body: 'Failed to get user info', status: 500 };

	const { meta_id, user_name } = meta_info;
	if (!meta_id) return { body: 'Failed to get meta_id', status: 500 };
	if (!user_name) return { body: 'Failed to get user_name', status: 500 };

	// update username
	const info_success = await set_user_info({ meta_id, user_name }, env);
	if (!info_success) return { body: 'Failed to link user', status: 500 };

	// get user info
	const user_info = await get_user_info({ meta_id }, env);
	if (!user_info) return { body: 'Failed to link user', status: 500 };

	// save access token
	const tok_success = await set_user_token({ meta_id, access_token }, env);
	if (!tok_success)
		return { body: 'Failed to setup access token', status: 500 };

	const { grab_id, is_admin } = user_info;

	const json = {
		user_name,
		grab_id,
		is_admin,
		access_token,

		// deprecated
		alias: user_name,
		id: meta_id,
	};
	return { body: JSON.stringify(json), status: 200 };
};
export default get_access_token;
