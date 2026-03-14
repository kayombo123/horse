# Horse Tech

**Technology is awesome.** — B2B tech company site (Cybersecurity, Web & App Development, Networking, Consultancy).

## Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Vercel serverless (Node.js), Supabase
- **Email:** SendGrid (optional)

## Setup

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In SQL Editor, run the statements in `supabase-schema.sql`.
   - Copy Project URL and anon key.

3. **Environment**
   - Copy `.env.example` to `.env.local`.
   - Set `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - Optional: set `SENDGRID_API_KEY`, `SENDGRID_FROM`, `CONTACT_EMAIL` for contact form email.

4. **Seed portfolio (optional)**
   ```bash
   npm run seed
   ```

5. **Run locally**
   ```bash
   npx vercel dev
   ```
   Then open the URL shown (e.g. http://localhost:3000).

## Deploy on Vercel

- Push to GitHub and connect the repo in Vercel.
- Add the same env vars in Vercel: **Project → Settings → Environment Variables**.

## Replace images

- **Hero:** Replace the hero image URL in `index.html` (currently a placeholder) or put your file at `assets/images/hero-placeholder.jpg` and point the `src` to it.
- **Portfolio:** Update `image_url` (and optionally `case_study_url`) in the Supabase `projects` table, or replace placeholder URLs in the seed data and re-seed.

## Blog

`/blog` shows a simple “not available yet” page (404-style). Replace `blog/index.html` when you add a real blog.
