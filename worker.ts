import get_access_token from './endpoints/get_access_token';
import get_verification_code from './endpoints/get_verification_code';
import verify_account from './endpoints/verify_account';
import sentry_proxy from './endpoints/sentry_proxy';
import { Endpoint } from './types';

async function handleRequest(request: Request, env: Env) {
	const headers = build_headers(request);
	const error = validate_request(request);
	if (error) {
		return new Response(error.body || null, {
			headers,
			status: error.status,
		});
	}

	try {
		const url = new URL(request.url);
		const route = url.pathname.slice(1);
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

		// returns a response
		if (route === 'sentry_proxy') {
			return await sentry_proxy(request, body, env);
		}

		const endpoints: Record<string, Endpoint> = {
			get_access_token,
			get_verification_code,
			verify_account,
		};
		if (endpoints[route]) {
			const { body, status } = await endpoints[route](params, env);
			return new Response(body, { status, headers });
		}

		return new Response('Not found', { headers, status: 404 });
	} catch (e) {
		console.error(e);
		return new Response('Internal Server Error', { headers, status: 500 });
	}
}

function build_headers(request: Request) {
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

function validate_request(request: Request) {
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
