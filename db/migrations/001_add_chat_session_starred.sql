ALTER TABLE chat_session
ADD COLUMN IF NOT EXISTS is_starred BOOLEAN NOT NULL DEFAULT false;

UPDATE chat_session
SET is_starred = false
WHERE is_starred IS NULL;