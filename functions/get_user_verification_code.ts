import { CodesRow } from '../types';

export default async function get_user_verification_code(
	params: { meta_id: string },
	env: Env,
): Promise<string | null> {
	const { meta_id } = params;

	const query = env.DB.prepare(`
		SELECT *
		FROM codes
		WHERE meta_id = ?
	`);

	const row: CodesRow | null = await query.bind(meta_id).first();
	if (!row) return null;

	const { code, expiry } = row;

	const now = Math.floor(Date.now() / 1000);
	if (now > expiry) return null;

	return `GT-${code}`;
}
