export default async function get_access_token(params, env) {
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
	const token_json = await token_response.json();
	const user_access_token = token_json.oauth_token;

	const user_info_response = await fetch(
		`https://graph.oculus.com/me?access_token=${user_access_token}&fields=id,alias`,
	);
	if (!user_info_response.ok) {
		console.error(await user_info_response.text());
		return {
			body: 'Fetching user info failed',
			status: user_info_response.status,
		};
	}
	const user_info = await user_info_response.json();
	// TODO: determine that id matches the grab id

	const json = {
		...user_info,
	};
	return { body: JSON.stringify(json), status: 200 };
}
