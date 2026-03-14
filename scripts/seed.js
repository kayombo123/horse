/**
 * Seed Supabase projects table with sample data.
 * Run: node scripts/seed.js (requires .env.local with SUPABASE_URL and SUPABASE_ANON_KEY)
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

const PLACEHOLDER = 'https://placehold.co/800x500/0D0D0D/0A84E8?text=Project';

const projects = [
  { title: 'Enterprise Security Audit', tag: 'cybersecurity', description: 'Full infrastructure and policy audit for a financial services client.', image_url: PLACEHOLDER, case_study_url: '#' },
  { title: 'SaaS Dashboard Platform', tag: 'web', description: 'Custom analytics and reporting dashboard built with modern stack.', image_url: PLACEHOLDER, case_study_url: '#' },
  { title: 'Multi-Region Network Design', tag: 'networking', description: 'Cloud networking and VPN design for a global retailer.', image_url: PLACEHOLDER, case_study_url: '#' },
  { title: 'Startup Tech Strategy', tag: 'consultancy', description: 'Advisory on security, stack, and scaling for a Series A startup.', image_url: PLACEHOLDER, case_study_url: '#' },
  { title: 'Penetration Testing Programme', tag: 'cybersecurity', description: 'Ongoing pen-testing and remediation for a healthcare provider.', image_url: PLACEHOLDER, case_study_url: '#' },
  { title: 'Mobile App & Backend', tag: 'web', description: 'Cross-platform app and API for a logistics company.', image_url: PLACEHOLDER, case_study_url: '#' }
];

async function seed() {
  const { data, error } = await supabase.from('projects').insert(projects).select();
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
  console.log('Seeded', data.length, 'projects.');
}

seed();
