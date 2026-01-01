export {};

declare global {
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
		is_list_moderator: 0 | 1;
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

	export type ListRow = {
		position: number;
		level_id: string;
		title: string;
		creators: string;
	};

	// GRAB API

	export type LevelDetails = {
		identifier: string;
		iteration: number;
		data_key: string;
		complexity: number;
		title?: string;
		description?: string;
		creators?: Array<string>;
		tags?: Array<string | 'ok'>;
		verification_time?: number;
	};

	export type UserInfo = {
		user_id: string;
		user_name?: string;
		is_admin: Boolean;
		is_supermoderator: Boolean;
		is_moderator: Boolean;
		is_verifier: Boolean;
		is_creator: Boolean;
	};
}
