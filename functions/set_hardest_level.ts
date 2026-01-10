import { get_level_details } from '../requests/get_level_details';
import { send_discord_message } from '../requests/send_discord_message';
import { HARDEST_PEOPLE_CHANNEL } from '../config';

export async function set_hardest_level(
	params: { level_id: string; position: number },
	env: Ctx,
): Promise<boolean> {
	const { level_id, position } = params;
	const { DB } = env;

	const level_details = await get_level_details({ level_id }, env);
	if (!level_details) return false;

	const title = level_details.title ?? '';
	const creators = level_details.creators?.join(', ') ?? '';

	const position_query = env.sql`
		SELECT position
		FROM list
		WHERE level_id = ${level_id}
	`;

	const row = await position_query.first<{ position: number }>();

	const statements: D1PreparedStatement[] = [];

	if (!row) {
		const shift_query = env.sql`
			UPDATE list
			SET position = position + 1
			WHERE position >= ${position}
		`;

		const insert_query = env.sql`
			INSERT INTO list (level_id, position, title, creators)
			VALUES (${level_id}, ${position}, ${title}, ${creators})
		`;

		// shift down then insert
		statements.push(shift_query, insert_query);
	} else {
		const old_position = row.position;

		if (old_position !== position) {
			if (position < old_position) {
				// moving up, shift down
				const shift_query = env.sql`
					UPDATE list
					SET position = position + 1
					WHERE position >= ${position}
						AND position < ${old_position}
						AND level_id != ${level_id}
				`;

				statements.push(shift_query);
			} else {
				// moving down, shift up
				const shift_query = env.sql`
					UPDATE list
					SET position = position - 1
					WHERE position > ${old_position}
						AND position <= ${position}
						AND level_id != ${level_id}
				`;

				statements.push(shift_query);
			}
		}

		// update target
		const update_query = env.sql`
			UPDATE list
			SET position = ${position},
				title = ${title},
				creators = ${creators}
			WHERE level_id = ${level_id}
		`;

		statements.push(update_query);
	}

	const results = await DB.batch(statements);

	const success = results.every((r) => r.success);

	const content = `Set **${title}** by *${creators}* to position **${position}**`;
	await send_discord_message(
		{ channel_id: HARDEST_PEOPLE_CHANNEL, content },
		env,
	);

	return success;
}
