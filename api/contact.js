const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

function sanitize(s) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, 10000);
}

function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch (_) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  // Honeypot
  if (body.hp) {
    res.status(200).json({ success: true });
    return;
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const service = sanitize(body.service);
  const message = sanitize(body.message);

  if (!name || name.length < 2) {
    res.status(400).json({ error: 'Please enter your name.' });
    return;
  }
  if (!email) {
    res.status(400).json({ error: 'Please enter your email.' });
    return;
  }
  if (!validEmail(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  if (!message || message.length < 10) {
    res.status(400).json({ error: 'Please enter a message (at least 10 characters).' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error: insertError } = await supabase.from('enquiries').insert({
    name,
    email,
    service: service || null,
    message,
    status: 'new'
  });

  if (insertError) {
    res.status(500).json({ error: 'Could not save your message. Please try again.' });
    return;
  }

  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) {
    sgMail.setApiKey(sendgridKey);
    const to = process.env.CONTACT_EMAIL || 'hello@horse.tech';
    try {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM || to,
        subject: `Horse contact: ${name} — ${service || 'General'}`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service || '-'}\n\nMessage:\n${message}`,
        replyTo: email
      });
    } catch (emailErr) {
      console.warn('SendGrid error:', emailErr.message);
      // Still return success — enquiry was stored
    }
  }

  res.status(200).json({ success: true });
};
