import { get_allow_user_downloads } from '../functions/get_allow_user_downloads';
import { get_allow_user_levels_downloads } from '../functions/get_allow_user_levels_downloads';

export const get_allow_downloads: Endpoint = async (params, env) => {
	const { user_id } = params;

	if (!user_id) return { body: 'user_id is required', status: 400 };

	const user_allow = await get_allow_user_downloads({ user_id }, env);
	if (!user_allow) return { body: 'Check failed', status: 500 };

	const levels_allow = await get_allow_user_levels_downloads(
		{ user_id },
		env,
	);
	if (!levels_allow) return { body: 'Check failed', status: 500 };

	const allow = {
		user: user_allow.allow,
		levels: levels_allow,
	};

	return { body: JSON.stringify(allow), status: 200 };
};
