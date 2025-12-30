// General

export type Endpoint = (
	params: Record<string, any>,
	env: any,
) => Promise<{ body: string; status: number }>;

// DB Rows

export type UsersRow = {
	meta_id: string;
	grab_id: string | null;
	user_name: string;
	is_admin: 0 | 1;
};

export type TokensRow = {
	meta_id: string;
	token: string;
	expiry: number;
};

export type CodesRow = {
	meta_id: string;
	code: string;
	expiry: number;
};

// GRAB API

export type LevelDetails = {
	identifier: string;
	description: string | null;
	title: string | null;
};

export type UserInfo = {
	user_id: string;
};
