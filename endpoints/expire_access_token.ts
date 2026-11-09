import { delete_user_token } from '../functions/delete_user_token';

export const expire_access_token: Endpoint = async (params, env) => {
	const { access_token } = params;
	if (!access_token) return { body: 'Missing access_token', status: 401 };

	const success = await delete_user_token({ token: access_token }, env);
	if (!success) return { body: 'Failed to expire access token', status: 500 };

	return { body: 'Success', status: 200 };
};
