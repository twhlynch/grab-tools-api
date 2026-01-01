CREATE TABLE IF NOT EXISTS tokens (
	meta_id TEXT PRIMARY KEY,
	token TEXT NOT NULL,
	expiry INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_tokens_token ON tokens(token);

