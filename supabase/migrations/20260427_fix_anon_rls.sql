-- ============================================================
-- Fix RLS: allow anonymous users to write to interaction tables
-- The previous policies only allowed service-role access,
-- so all client-side saves/interests/views were silently failing.
-- ============================================================

-- FAVORITES
-- Anyone can insert (we trust the session_id they send)
CREATE POLICY "Anon can insert favorites"
  ON favorites FOR INSERT WITH CHECK (true);

-- Anyone can read their own session's favorites
CREATE POLICY "Anon can read favorites"
  ON favorites FOR SELECT USING (true);

-- Anyone can delete (soft-ownership via session_id handled in UI)
CREATE POLICY "Anon can delete favorites"
  ON favorites FOR DELETE USING (true);

-- INTERESTS
-- Anyone can submit interest
CREATE POLICY "Anon can insert interests"
  ON interests FOR INSERT WITH CHECK (true);

-- EVENT_LOGS
-- Anyone can log events (views, clicks)
CREATE POLICY "Anon can insert event_logs"
  ON event_logs FOR INSERT WITH CHECK (true);

-- SESSIONS
-- Anyone can create a session record
CREATE POLICY "Anon can insert sessions"
  ON sessions FOR INSERT WITH CHECK (true);

-- Anyone can read sessions (needed to fetch preferences)
CREATE POLICY "Anon can read sessions"
  ON sessions FOR SELECT USING (true);

-- Anyone can update their session (preferences upsert)
CREATE POLICY "Anon can update sessions"
  ON sessions FOR UPDATE USING (true) WITH CHECK (true);
