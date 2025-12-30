import { UserInfo } from '../types';

// doesnt work yet, uses placeholder endpoint
export default async function get_access_token_grab_user(
	params: { access_token: string },
	env: Env,
): Promise<UserInfo | null> {
	const { access_token } = params;

	try {
		const response = await fetch(
			`https://api.slin.dev/grab/v1/get_user_info?access_token=${access_token}`,
		);

		return await response.json();
	} catch {
		return null;
	}
}
