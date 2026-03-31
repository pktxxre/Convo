-- ================================================================
-- Convo — Full Schema Migration
-- All statements are idempotent (IF NOT EXISTS / DO blocks).
-- Safe to run against a fresh or partially-migrated database.
-- ================================================================

-- Enable uuid generation (already available in Supabase, just in case)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ================================================================
-- CAMPUSES & DOMAINS
-- ================================================================

CREATE TABLE IF NOT EXISTS campuses (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  short_name TEXT        NOT NULL,
  location   TEXT,
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campus_domains (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id  UUID        NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  domain     TEXT        NOT NULL,                          -- e.g. "mit.edu"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (domain)
);

CREATE INDEX IF NOT EXISTS campus_domains_campus_id ON campus_domains(campus_id);


-- ================================================================
-- MAJORS
-- ================================================================

CREATE TABLE IF NOT EXISTS majors (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id  UUID        NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  slug       TEXT        NOT NULL,
  is_active  BOOLEAN     NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campus_id, slug)
);

CREATE INDEX IF NOT EXISTS majors_campus_id ON majors(campus_id);


-- ================================================================
-- USERS  (mirrors auth.users — created automatically by Supabase trigger)
-- ================================================================

CREATE TABLE IF NOT EXISTS users (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_id  UUID        REFERENCES campuses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_campus_id ON users(campus_id);

-- Auto-create a users row whenever someone signs up
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();


-- ================================================================
-- USER PROFILES
-- ================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id             UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name        TEXT        NOT NULL DEFAULT '',
  bio                 TEXT        CHECK (char_length(bio) <= 300),
  year                TEXT        CHECK (year IN ('Freshman','Sophomore','Junior','Senior','Graduate')),
  avatar_url          TEXT,
  onboarding_complete BOOLEAN     NOT NULL DEFAULT false,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ================================================================
-- USER MAJORS  (a student can list multiple, one marked primary)
-- ================================================================

CREATE TABLE IF NOT EXISTS user_majors (
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  major_id   UUID        NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  is_primary BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, major_id)
);

CREATE INDEX IF NOT EXISTS user_majors_major_id ON user_majors(major_id);

-- Only one primary major per user
CREATE UNIQUE INDEX IF NOT EXISTS user_majors_one_primary
  ON user_majors (user_id)
  WHERE is_primary = true;


-- ================================================================
-- TOPICS
-- ================================================================

CREATE TABLE IF NOT EXISTS topics (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id   UUID        NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL,
  description TEXT        CHECK (char_length(description) <= 500),
  icon        TEXT        NOT NULL DEFAULT '💬',
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  post_count  INT         NOT NULL DEFAULT 0,             -- denormalized, updated via trigger
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campus_id, slug)
);

CREATE INDEX IF NOT EXISTS topics_campus_id ON topics(campus_id);


-- ================================================================
-- TOPIC MEMBERSHIPS
-- ================================================================

CREATE TABLE IF NOT EXISTS topic_memberships (
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id   UUID        NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS topic_memberships_topic_id ON topic_memberships(topic_id);


-- ================================================================
-- POSTS
-- ================================================================

CREATE TABLE IF NOT EXISTS posts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id       UUID        NOT NULL REFERENCES campuses(id),
  topic_id        UUID        NOT NULL REFERENCES topics(id),
  author_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_type       TEXT        NOT NULL DEFAULT 'short'
                              CHECK (post_type IN ('short','long','prompt')),
  title           TEXT        CHECK (char_length(title) <= 200),
  body            TEXT        NOT NULL
                              CHECK (char_length(body) >= 1 AND char_length(body) <= 10000),
  reply_count     INT         NOT NULL DEFAULT 0,         -- denormalized
  is_removed      BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_campus_id_created_at ON posts(campus_id, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_topic_id_created_at  ON posts(topic_id,  created_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_id            ON posts(author_id);

-- Increment/decrement topic.post_count when posts are inserted or soft-deleted
CREATE OR REPLACE FUNCTION update_topic_post_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE topics SET post_count = post_count + 1 WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_removed = false AND NEW.is_removed = true THEN
    UPDATE topics SET post_count = GREATEST(post_count - 1, 0) WHERE id = NEW.topic_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_topic_post_count ON posts;
CREATE TRIGGER trg_topic_post_count
  AFTER INSERT OR UPDATE OF is_removed ON posts
  FOR EACH ROW EXECUTE FUNCTION update_topic_post_count();


-- ================================================================
-- POST REPLIES
-- ================================================================

CREATE TABLE IF NOT EXISTS post_replies (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL
                         CHECK (char_length(body) >= 1 AND char_length(body) <= 2000),
  is_removed BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS post_replies_post_id    ON post_replies(post_id, created_at);
CREATE INDEX IF NOT EXISTS post_replies_author_id  ON post_replies(author_id);

-- Keep posts.reply_count in sync
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET reply_count = reply_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_removed = false AND NEW.is_removed = true THEN
    UPDATE posts SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = NEW.post_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_post_reply_count ON post_replies;
CREATE TRIGGER trg_post_reply_count
  AFTER INSERT OR UPDATE OF is_removed ON post_replies
  FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();


-- ================================================================
-- POST ANALYTICS  (1:1 with posts, updated server-side)
-- ================================================================

CREATE TABLE IF NOT EXISTS post_analytics (
  post_id              UUID        PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  view_count           INT         NOT NULL DEFAULT 0,
  unique_viewer_count  INT         NOT NULL DEFAULT 0,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create analytics row with each post
CREATE OR REPLACE FUNCTION create_post_analytics()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO post_analytics (post_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_post_analytics ON posts;
CREATE TRIGGER trg_create_post_analytics
  AFTER INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION create_post_analytics();


-- ================================================================
-- MAJOR SPINS
-- ================================================================

CREATE TABLE IF NOT EXISTS major_spins (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campus_id          UUID        NOT NULL REFERENCES campuses(id),
  winner_major_id    UUID        NOT NULL REFERENCES majors(id),
  eligible_major_ids UUID[]      NOT NULL DEFAULT '{}',
  post_id            UUID        REFERENCES posts(id) ON DELETE SET NULL, -- post created from this spin
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS major_spins_user_id_created_at
  ON major_spins(user_id, created_at DESC);


-- ================================================================
-- CONTENT REPORTS
-- ================================================================

CREATE TABLE IF NOT EXISTS content_reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT        NOT NULL CHECK (target_type IN ('post','reply','user')),
  target_id   UUID        NOT NULL,
  reason      TEXT        NOT NULL CHECK (reason IN (
                'spam','harassment','misinformation','inappropriate','other'
              )),
  detail      TEXT        CHECK (char_length(detail) <= 500),
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','reviewed','dismissed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_reports_status     ON content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS content_reports_target     ON content_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS content_reports_reporter   ON content_reports(reporter_id);


-- ================================================================
-- MODERATION ACTIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS moderation_actions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id  UUID        REFERENCES users(id) ON DELETE SET NULL, -- null = system
  report_id     UUID        REFERENCES content_reports(id) ON DELETE SET NULL,
  target_type   TEXT        NOT NULL CHECK (target_type IN ('post','reply','user')),
  target_id     UUID        NOT NULL,
  action_type   TEXT        NOT NULL CHECK (action_type IN (
                  'remove_content','warn_user','suspend_user','ban_user','dismiss_report'
                )),
  reason        TEXT        CHECK (char_length(reason) <= 500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moderation_actions_target ON moderation_actions(target_type, target_id);


-- ================================================================
-- BLOCKED USERS
-- ================================================================

CREATE TABLE IF NOT EXISTS blocked_users (
  blocker_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS blocked_users_blocked_id ON blocked_users(blocked_id);


-- ================================================================
-- NOTIFICATIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT        NOT NULL CHECK (type IN (
               'new_reply','mention','spin_match','campus_announcement','moderation'
             )),
  title      TEXT        NOT NULL CHECK (char_length(title) <= 100),
  body       TEXT        CHECK (char_length(body) <= 300),
  data       JSONB       NOT NULL DEFAULT '{}',           -- arbitrary payload (post_id, etc.)
  is_read    BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_unread
  ON notifications(user_id, created_at DESC)
  WHERE is_read = false;


-- ================================================================
-- DEVICE TOKENS  (push notifications — iOS / Android / Web)
-- ================================================================

CREATE TABLE IF NOT EXISTS device_tokens (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token        TEXT        NOT NULL,
  platform     TEXT        NOT NULL CHECK (platform IN ('ios','android','web')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (token)                                          -- one row per physical device
);

CREATE INDEX IF NOT EXISTS device_tokens_user_id ON device_tokens(user_id);


-- ================================================================
-- ROW LEVEL SECURITY
-- All tables default to deny-all; policies open exactly what's needed.
-- ================================================================

ALTER TABLE campuses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_domains     ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_majors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics             ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_memberships  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_replies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE major_spins        ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens      ENABLE ROW LEVEL SECURITY;

-- Helper: returns the campus_id for the calling user
CREATE OR REPLACE FUNCTION my_campus_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT campus_id FROM users WHERE id = auth.uid()
$$;

-- ── Campuses & domains: public read ──────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Public read campuses" ON campuses FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Public read campus_domains" ON campus_domains FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Majors: public read ───────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Public read majors" ON majors FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Users: read own row; campus-mates can see id + campus_id ─────
DO $$ BEGIN
  CREATE POLICY "Users read own row" ON users FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own row" ON users FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── User profiles: read own; campus-mates can read ───────────────
DO $$ BEGIN
  CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Campus members read profiles"
    ON user_profiles FOR SELECT
    USING (
      user_id IN (SELECT id FROM users WHERE campus_id = my_campus_id())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users upsert own profile"
    ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own profile"
    ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── User majors ───────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own majors" ON user_majors FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users manage own majors"
    ON user_majors FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own majors"
    ON user_majors FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Topics: campus-scoped read ────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Campus members read topics"
    ON topics FOR SELECT
    USING (campus_id = my_campus_id());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Topic memberships ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own memberships"
    ON topic_memberships FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users manage own memberships"
    ON topic_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own memberships"
    ON topic_memberships FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Posts: campus-scoped; not removed ────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Campus members read posts"
    ON posts FOR SELECT
    USING (campus_id = my_campus_id() AND is_removed = false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert own posts"
    ON posts FOR INSERT WITH CHECK (auth.uid() = author_id AND campus_id = my_campus_id());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users soft-delete own posts"
    ON posts FOR UPDATE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Post replies ──────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Campus members read replies"
    ON post_replies FOR SELECT
    USING (
      post_id IN (SELECT id FROM posts WHERE campus_id = my_campus_id())
      AND is_removed = false
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert own replies"
    ON post_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users soft-delete own replies"
    ON post_replies FOR UPDATE USING (auth.uid() = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Post analytics: campus-scoped read ───────────────────────────
DO $$ BEGIN
  CREATE POLICY "Campus members read analytics"
    ON post_analytics FOR SELECT
    USING (
      post_id IN (SELECT id FROM posts WHERE campus_id = my_campus_id())
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Major spins: own rows only ────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own spins"
    ON major_spins FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert own spins"
    ON major_spins FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Content reports: own only ─────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own reports"
    ON content_reports FOR SELECT USING (auth.uid() = reporter_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert reports"
    ON content_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Moderation actions: no direct user access (service role only) ─
-- (No policies = deny all for regular users; mods use service role key)

-- ── Blocked users ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own blocks"
    ON blocked_users FOR SELECT USING (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users manage own blocks"
    ON blocked_users FOR INSERT WITH CHECK (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users remove own blocks"
    ON blocked_users FOR DELETE USING (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Notifications: own only ───────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own notifications"
    ON notifications FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users mark own notifications read"
    ON notifications FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Device tokens: own only ───────────────────────────────────────
DO $$ BEGIN
  CREATE POLICY "Users read own tokens"
    ON device_tokens FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users manage own tokens"
    ON device_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own tokens"
    ON device_tokens FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
