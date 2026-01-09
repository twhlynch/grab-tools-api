export {};

declare global {
	// General

	export type Endpoint = (
		params: Record<string, string | undefined>,
		env: Ctx,
	) => Promise<{ body: string; status: number }>;

	export type Ctx = Env & {
		GRAB_API: string;
		META_API: string;
		HARDEST_PEOPLE_CHANNEL: string;
		sql: (
			strings: TemplateStringsArray,
			...values: any[]
		) => D1PreparedStatement;
	};

	// DB Rows

	export type UsersRow = {
		meta_id: string;
		grab_id: string | null;
		user_name: string;
		is_admin: boolean;
		is_list_moderator: boolean;
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
		is_admin: boolean;
		is_supermoderator: boolean;
		is_moderator: boolean;
		is_verifier: boolean;
		is_creator: boolean;
	};
}
