import get_access_token from './endpoints/get_access_token';
import sentry_proxy from './endpoints/sentry_proxy';

async function handleRequest(request, env, ctx) {
	const headers = build_headers(request, env, ctx);
	const error = validate_request(request, env, ctx);
	if (error) {
		return new Response(error.body || null, {
			headers,
			status: error.status,
		});
	}

	try {
		const url = new URL(request.url);
		const route = url.pathname;
		let params = {
			...Object.fromEntries(url.searchParams.entries()),
		};
		let body = await request.text();
		try {
			const request_json = JSON.parse(body);
			params = {
				...request_json,
				...params,
			};
		} catch {}

		if (route === '/get_access_token') {
			const { body, status } = await get_access_token(params, env);
			return new Response(body, {
				status,
				headers,
			});
		} else if (route === '/sentry_proxy') {
			return await sentry_proxy(request, body, env);
		}

		return new Response('Not found', {
			headers,
			status: 404,
		});
	} catch (e) {
		console.error(e);
		return new Response('Internal Server Error', {
			headers,
			status: 500,
		});
	}
}

function build_headers(request, env, ctx) {
	const DOMAINS = ['grabvr.tools', 'twhlynch.me', '127.0.0.1', 'localhost'];

	const headers = new Headers({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	});

	const origin = request.headers.get('Origin');
	if (origin) {
		const hostname = new URL(origin).hostname;
		const domain = hostname.split('.').slice(-2).join('.');
		if (DOMAINS.includes(domain) || DOMAINS.includes(hostname)) {
			headers.set('Access-Control-Allow-Origin', origin);
		}
	}

	return headers;
}

function validate_request(request, env, ctx) {
	if (request.method === 'OPTIONS') {
		return {};
	}

	if (!['POST', 'GET'].includes(request.method)) {
		return { body: 'Method Not Allowed', status: 405 };
	}

	const contentType = request.headers.get('Content-Type') || '';
	if (
		request.method === 'POST' &&
		contentType &&
		!contentType.includes('application/json') &&
		!contentType.includes('text/plain')
	) {
		return { body: 'Unsupported Media Type', status: 415 };
	}

	return null; // valid
}

export default {
	fetch: handleRequest,
};
