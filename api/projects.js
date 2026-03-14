const { createClient } = require('@supabase/supabase-js');

const PAGE_SIZE = 6;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || PAGE_SIZE, 20);
  const offset = parseInt(req.query.offset, 10) || 0;

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, tag, description, image_url, case_study_url, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json(data || []);
};
