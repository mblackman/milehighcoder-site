CREATE TABLE dreams (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  text        TEXT    NOT NULL CHECK (length(text) <= 500),
  author      TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','approved','rejected')),
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  reviewed_at INTEGER,
  ip_hash     TEXT
);
CREATE INDEX idx_dreams_status ON dreams(status);

CREATE TABLE tags (
  name        TEXT PRIMARY KEY,
  weight      REAL NOT NULL DEFAULT 1.0,
  style_class TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE dream_tags (
  dream_id INTEGER NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  tag_name TEXT    NOT NULL REFERENCES tags(name) ON DELETE CASCADE,
  PRIMARY KEY (dream_id, tag_name)
);
CREATE INDEX idx_dream_tags_tag ON dream_tags(tag_name);
