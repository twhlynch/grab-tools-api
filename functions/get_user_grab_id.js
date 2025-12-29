export default async function get_user_grab_id(params, env) {
	const { meta_id } = params;
	const { GRAB_ACCESS_TOKEN } = env;

	const user_info_response = await fetch(
		`https://api.slin.dev/grab/v1/get_user_info?meta_id=${meta_id}&access_token=${GRAB_ACCESS_TOKEN}`,
	);

	try {
		const user_info = await user_info_response.json();
		return user_info.user_id;
	} catch {
		return null;
	}
}
