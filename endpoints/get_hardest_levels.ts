import get_hardest_levels_list from '../functions/get_hardest_levels_list';

const get_hardest_levels: Endpoint = async (_params, env) => {
	const list = await get_hardest_levels_list({}, env);
	if (!list) return { body: 'Failed fetching list', status: 500 };

	return { body: JSON.stringify(list), status: 200 };
};

export default get_hardest_levels;
