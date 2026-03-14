/**
 * Supabase client for Horse — use anon key only in browser.
 * Set SUPABASE_URL and SUPABASE_ANON_KEY in env (Vercel) or .env.local for seed.
 */
(function () {
  const url = typeof window !== 'undefined' && window.__SUPABASE_URL__ ? window.__SUPABASE_URL__ : '';
  const key = typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__ ? window.__SUPABASE_ANON_KEY__ : '';
  window.supabase = null;
  if (url && key && typeof window !== 'undefined') {
    try {
      window.supabase = window.supabaseClient || (typeof createClient !== 'undefined' ? createClient(url, key) : null);
    } catch (e) {
      console.warn('Supabase client not loaded:', e.message);
    }
  }
})();
