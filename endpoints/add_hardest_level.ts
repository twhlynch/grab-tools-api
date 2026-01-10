import { HARDEST_PEOPLE_CHANNEL, VIEWER_URL } from '../config';
import { get_access_token_user } from '../functions/get_access_token_user';
import { set_hardest_level } from '../functions/set_hardest_level';
import { send_discord_message } from '../requests/send_discord_message';

export const add_hardest_level: Endpoint = async (params, env) => {
	const { level_id, position: position_raw, access_token } = params;

	if (!level_id) return { body: 'level_id is required', status: 400 };
	if (!position_raw) return { body: 'position is required', status: 400 };
	if (!access_token) return { body: 'Missing access_token', status: 401 };

	const position = parseInt(position_raw);
	const valid = !isNaN(position);
	if (!valid) return { body: 'position must be a number', status: 400 };

	const user_info = await get_access_token_user({ access_token }, env);
	if (!user_info) return { body: 'Invalid access_token', status: 401 };

	const { is_list_moderator } = user_info;
	if (!is_list_moderator) return { body: 'Not allowed', status: 401 };

	const level_details = await set_hardest_level({ level_id, position }, env);
	if (!level_details) return { body: 'Failed to update list', status: 500 };

	const title = level_details.title ?? '';
	const creators = level_details.creators?.join(', ') ?? '';

	const content = `Set **[${title}](${VIEWER_URL}${level_id})** by *${creators}* to position **${position}**`;
	await send_discord_message(
		{ channel_id: HARDEST_PEOPLE_CHANNEL, content },
		env,
	);

	return { body: 'Success', status: 200 };
};
