CREATE TABLE tokens_new (
	meta_id TEXT NOT NULL,
	token TEXT NOT NULL,
	expiry INTEGER NOT NULL
);

INSERT INTO tokens_new (meta_id, token, expiry)
SELECT meta_id, token, expiry FROM tokens;

DROP TABLE tokens;

ALTER TABLE tokens_new RENAME TO tokens;

CREATE UNIQUE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_tokens_meta_id ON tokens(meta_id, expiry);
