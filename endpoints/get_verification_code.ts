import { generate_verification_code } from '../functions/generate_verification_code';
import { get_access_token_user } from '../functions/get_access_token_user';

export const get_verification_code: Endpoint = async (params, env) => {
	const { access_token } = params;
	if (!access_token) return { body: 'Missing access_token', status: 400 };

	const user_info = await get_access_token_user({ access_token }, env);
	if (!user_info) return { body: 'Invalid access_token', status: 400 };

	const { meta_id } = user_info;
	if (!meta_id) return { body: 'Invalid user', status: 400 };

	const code = await generate_verification_code({ meta_id }, env);
	if (!code) return { body: 'Failed generating code', status: 500 };

	const json = { code };
	return { body: JSON.stringify(json), status: 200 };
};
