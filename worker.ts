import { get_access_token } from './endpoints/get_access_token';
import { get_verification_code } from './endpoints/get_verification_code';
import { verify_account } from './endpoints/verify_account';
import { sentry_proxy } from './endpoints/sentry_proxy';
import { get_hardest_levels } from './endpoints/get_hardest_levels';
import { add_hardest_level } from './endpoints/add_hardest_level';
import { remove_hardest_level } from './endpoints/remove_hardest_level';
import { set_allow_downloads } from './endpoints/set_allow_downloads';
import { can_download_level } from './endpoints/can_download_level';
import { get_allow_downloads } from './endpoints/get_allow_downloads';

async function handleRequest(request: Request, _env: Env) {
	const headers = build_headers(request);
	const error = validate_request(request);
	if (error) {
		return new Response(error.body || null, {
			headers,
			status: error.status,
		});
	}

	const env = inject_globals(_env);

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
			add_hardest_level,
			remove_hardest_level,
			get_hardest_levels,
			set_allow_downloads,
			can_download_level,
			get_allow_downloads,
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
	const DOMAINS = [
		'grabvr.tools',
		'grabvr.quest',
		'twhlynch.me',
		'127.0.0.1',
		'localhost',
	];

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

function inject_globals(env: Env): Ctx {
	return {
		...env,
		sql: (
			strings: TemplateStringsArray,
			...values: any[]
		): D1PreparedStatement => {
			const query = strings.join('?');
			return env.DB.prepare(query).bind(...values);
		},
	};
}

export default {
	fetch: handleRequest,
};
