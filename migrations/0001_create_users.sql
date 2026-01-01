CREATE TABLE IF NOT EXISTS users (
	meta_id TEXT PRIMARY KEY,
	grab_id TEXT,
	user_name TEXT NOT NULL,
	is_admin INTEGER NOT NULL DEFAULT 0,
	is_list_moderator INTEGER NOT NULL DEFAULT 0
);
