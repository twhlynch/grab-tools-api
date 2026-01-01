export async function sentry_proxy(
	request: Request,
	body: string,
	env: Env,
): Promise<Response> {
	const { SENTRY_PUBLIC_KEY, SENTRY_INGEST_HOST, SENTRY_PROJECT_ID } = env;

	const URL = `https://${SENTRY_INGEST_HOST}.ingest.us.sentry.io/api/${SENTRY_PROJECT_ID}/envelope/?sentry_key=${SENTRY_PUBLIC_KEY}`;

	// this is so dumb but it works
	body = body
		.replaceAll('SENTRY_INGEST_HOST', SENTRY_INGEST_HOST)
		.replaceAll('SENTRY_PUBLIC_KEY', SENTRY_PUBLIC_KEY)
		.replaceAll('0123456789', SENTRY_PROJECT_ID);

	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value
			.replaceAll('SENTRY_INGEST_HOST', SENTRY_INGEST_HOST)
			.replaceAll('SENTRY_PUBLIC_KEY', SENTRY_PUBLIC_KEY)
			.replaceAll('0123456789', SENTRY_PROJECT_ID);
	});

	const proxied = await fetch(URL, {
		method: request.method,
		headers,
		body,
	});

	return proxied;
}
