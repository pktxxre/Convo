-- ============================================================
-- Major Spin Wheel — additional tables
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================

-- Freestanding tables assumed to already exist:
--   users    (id uuid, campus_id uuid, major_id uuid, created_at timestamptz)
--   campuses (id uuid, name text)
--   majors   (id uuid, campus_id uuid, name text, slug text, is_active boolean)

-- ── Spin events ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS major_spin_events (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campus_id          UUID        NOT NULL REFERENCES campuses(id),
  winner_major_id    UUID        NOT NULL REFERENCES majors(id),
  eligible_major_ids UUID[]      NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS major_spin_events_user_id_created_at
  ON major_spin_events (user_id, created_at DESC);

-- ── Conversations (wheel-initiated posts) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id        UUID        NOT NULL REFERENCES campuses(id),
  author_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_major_id  UUID        NOT NULL REFERENCES majors(id),
  spin_id          UUID        REFERENCES major_spin_events(id) ON DELETE SET NULL,
  title            TEXT        CHECK (char_length(title) <= 200),
  body             TEXT        NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 10000),
  post_type        TEXT        NOT NULL DEFAULT 'prompt'
                               CHECK (post_type IN ('short', 'long', 'prompt')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS conversations_author_id_created_at
  ON conversations (author_id, created_at DESC);

CREATE INDEX IF NOT EXISTS conversations_campus_id_target_major_id
  ON conversations (campus_id, target_major_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE major_spin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;

-- Users can read their own spin events
CREATE POLICY "Users read own spins"
  ON major_spin_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own spin events
CREATE POLICY "Users insert own spins"
  ON major_spin_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read conversations on their campus
CREATE POLICY "Campus members read conversations"
  ON conversations FOR SELECT
  USING (
    campus_id IN (
      SELECT campus_id FROM users WHERE id = auth.uid()
    )
  );

-- Users can insert conversations as themselves
CREATE POLICY "Users insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (author_id = auth.uid());
