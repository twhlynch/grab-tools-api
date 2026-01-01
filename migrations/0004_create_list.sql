CREATE TABLE IF NOT EXISTS list (
	level_id TEXT PRIMARY KEY,
	position INTEGER NOT NULL,
	title TEXT NOT NULL,
	creators TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_list_position ON list(position);

