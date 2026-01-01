import { get_level_details } from '../requests/get_level_details';

export async function set_hardest_level(
	params: { level_id: string; position: number },
	env: Env,
): Promise<boolean> {
	const { level_id, position } = params;
	const { DB } = env;

	const level_details = await get_level_details({ level_id }, env);
	if (!level_details) return false;

	const title = level_details.title ?? '';
	const creators = level_details.creators?.join(', ') ?? '';

	const position_query = DB.prepare(`
		SELECT position
		FROM list
		WHERE level_id = ?
	`);

	const row = await position_query
		.bind(level_id)
		.first<{ position: number }>();

	const statements: D1PreparedStatement[] = [];

	if (!row) {
		const shift_query = DB.prepare(`
			UPDATE list
			SET position = position + 1
			WHERE position >= ?
		`);

		const insert_query = DB.prepare(`
			INSERT INTO list (level_id, position, title, creators)
			VALUES (?, ?, ?, ?)
		`);

		// shift down then insert
		statements.push(
			shift_query.bind(position),
			insert_query.bind(level_id, position, title, creators),
		);
	} else {
		const old_position = row.position;

		if (old_position !== position) {
			if (position < old_position) {
				// moving up, shift down
				const shift_query = DB.prepare(`
					UPDATE list
					SET position = position + 1
					WHERE position >= ?
						AND position < ?
						AND level_id != ?
				`);

				statements.push(
					shift_query.bind(position, old_position, level_id),
				);
			} else {
				// moving down, shift up
				const shift_query = DB.prepare(`
					UPDATE list
					SET position = position - 1
					WHERE position > ?
						AND position <= ?
						AND level_id != ?
				`);

				statements.push(
					shift_query.bind(old_position, position, level_id),
				);
			}
		}

		// update target
		const update_query = DB.prepare(`
			UPDATE list
			SET position = ?,
				title = ?,
				creators = ?
			WHERE level_id = ?
		`);

		statements.push(update_query.bind(position, title, creators, level_id));
	}

	const results = await DB.batch(statements);

	return results.every((r) => r.success);
}
