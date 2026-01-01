import { get_access_token_grab_user } from '../requests/get_access_token_grab_user';
import { get_access_token_user } from '../functions/get_access_token_user';
import { get_level_details } from '../requests/get_level_details';
import { get_user_verification_code } from '../functions/get_user_verification_code';
import { set_user_grab_id } from '../functions/set_user_grab_id';

export const verify_account: Endpoint = async (params, env) => {
	const { access_token, token, level_id } = params;
	if (!access_token) return { body: 'Missing access_token', status: 400 };

	const user_info = await get_access_token_user({ access_token }, env);
	if (!user_info) return { body: 'Invalid access_token', status: 400 };

	const { meta_id } = user_info;
	if (!meta_id) return { body: 'Invalid user', status: 400 };

	if (!token && !level_id)
		return { body: 'Either token or level_id is required', status: 400 };

	let grab_id: string | null = null;

	if (token) {
		// token -> user id
		const grab_user = await get_access_token_grab_user(
			{ access_token },
			env,
		);
		if (!grab_user)
			return { body: 'Invalid grab access_token', status: 400 };

		grab_id = grab_user.user_id;
	}

	if (level_id) {
		// get users code
		const code = await get_user_verification_code({ meta_id }, env);
		if (!code) return { body: 'No valid code generated', status: 400 };

		// get level details
		const level_details = await get_level_details({ level_id }, env);
		if (!level_details)
			return { body: 'Failed fetching user', status: 400 };

		// check for code
		const { description, title, identifier } = level_details;
		if (!description?.includes?.(code) && !title?.includes?.(code))
			return { body: 'Code not found in level', status: 400 };

		// success
		grab_id = identifier.split(':')[0];
	}

	if (grab_id) {
		const success = await set_user_grab_id({ meta_id, grab_id }, env);
		if (!success) return { body: 'Failed linking account', status: 500 };

		const json = { grab_id };
		return { body: JSON.stringify(json), status: 200 };
	}

	return { body: 'Either token or level_id is required', status: 400 };
};
