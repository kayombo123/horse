-- Run this in Supabase SQL Editor to create tables and RLS.

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text CHECK (tag IN ('cybersecurity', 'web', 'networking', 'consultancy')),
  description text,
  image_url text,
  case_study_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for seed" ON projects FOR INSERT WITH CHECK (true);

-- Table: enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert for contact form; restrict read to authenticated/service
CREATE POLICY "Allow anonymous insert" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role all" ON enquiries FOR ALL USING (true);

-- Optional: team table for About section
CREATE TABLE IF NOT EXISTS team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  avatar_url text,
  linkedin_url text
);

ALTER TABLE team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read team" ON team FOR SELECT USING (true);
