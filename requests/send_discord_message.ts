import { safe_fetch } from '../utils';

export async function send_discord_message(
	params: { channel_id: string; content: string },
	env: Ctx,
): Promise<boolean | null> {
	const { channel_id, content } = params;
	const { DISCORD_BOT_TOKEN } = env;

	const url = `https://discord.com/api/v10/channels/${channel_id}/messages`;

	const response = await safe_fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content,
		}),
	});

	if (response === null) return null;

	return true;
}
