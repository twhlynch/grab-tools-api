import { get_allow_level_downloads } from '../functions/get_allow_level_downloads';

export const can_download_level: Endpoint = async (params, env) => {
	const { level_id } = params;

	if (!level_id) return { body: 'level_id is required', status: 400 };

	const allow = await get_allow_level_downloads({ level_id }, env);
	if (!allow) return { body: 'Check failed', status: 500 };

	return { body: JSON.stringify(allow), status: 200 };
};
