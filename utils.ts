export function build_url(base: string, params: Record<string, string>) {
	const url = new URL(base);

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	return url.toString();
}

export function parse_boolean(raw: string): boolean | null {
	if (raw === 'true') return true;
	if (raw === 'false') return false;
	return null;
}

export function clean_user_booleans(user: UsersRow): void {
	user.is_admin = !!user.is_admin;
	user.is_list_moderator = !!user.is_list_moderator;
}

// safe functions

export async function safe_fetch(
	input: string | URL | Request,
	init?: RequestInit,
): Promise<string | null> {
	try {
		const res = await fetch(input, init);
		if (!res.ok) return null;

		return await res.text();
	} catch {
		return null;
	}
}

export async function safe_fetch_json<T>(
	input: string | URL | Request,
	init?: RequestInit,
): Promise<T | null> {
	try {
		const res = await fetch(input, init);
		if (!res.ok) return null;

		return (await res.json()) as T;
	} catch {
		return null;
	}
}

export function safe_json<T>(data: string): T | null {
	try {
		return JSON.parse(data) as T;
	} catch {
		return null;
	}
}
