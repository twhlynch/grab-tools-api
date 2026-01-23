import { get_access_token_user } from '../functions/get_access_token_user';
import { set_allow_level_downloads } from '../functions/set_allow_level_downloads';
import { set_allow_user_downloads } from '../functions/set_allow_user_downloads';
import { parse_boolean_or_null } from '../utils';

export const set_allow_downloads: Endpoint = async (params, env) => {
	const { level_id, user_id, allow: allow_raw, access_token } = params;

	if (!allow_raw) return { body: 'allow is required', status: 400 };
	if (!access_token) return { body: 'Missing access_token', status: 401 };

	if (!level_id && !user_id)
		return { body: 'One of level_id or user_id is required', status: 400 };

	const allow = parse_boolean_or_null(allow_raw);
	const valid = allow !== undefined;
	if (!valid) return { body: 'Allow must be a boolean or null', status: 400 };

	const user_info = await get_access_token_user({ access_token }, env);
	if (!user_info) return { body: 'Invalid access_token', status: 401 };

	const { grab_id } = user_info;
	if (!grab_id) return { body: 'Account must be verified', status: 401 };

	if (level_id) {
		const owns_level = grab_id === level_id.split(':')[0];
		if (!owns_level) return { body: 'Must be owner of level', status: 401 };

		const success = await set_allow_level_downloads(
			{ level_id, allow },
			env,
		);
		if (!success) return { body: 'Failed', status: 500 };
	} else if (user_id) {
		if (user_id !== grab_id) return { body: 'Must be user', status: 401 };

		const success = await set_allow_user_downloads({ user_id, allow }, env);
		if (!success) return { body: 'Failed', status: 500 };
	}

	return { body: 'Success', status: 200 };
};
