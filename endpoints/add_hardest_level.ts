import { get_access_token_user } from '../functions/get_access_token_user';
import { set_hardest_level } from '../functions/set_hardest_level';

	const { level_id, position, access_token } = params;
export const add_hardest_level: Endpoint = async (params, env) => {

	if (!level_id) return { body: 'level_id is required', status: 400 };
	if (!position) return { body: 'position is required', status: 400 };
	if (!access_token) return { body: 'Missing access_token', status: 401 };

	const user_info = await get_access_token_user({ access_token }, env);
	if (!user_info) return { body: 'Invalid access_token', status: 401 };

	const { is_list_moderator } = user_info;
	if (!is_list_moderator) return { body: 'Not allowed', status: 401 };

	const success = await set_hardest_level({ level_id, position }, env);
	if (!success) return { body: 'Failed to update list', status: 500 };

	return { body: 'Success', status: 200 };
};
