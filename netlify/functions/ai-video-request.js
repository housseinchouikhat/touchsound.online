// Receives a "Sound for AI Video" brief (JSON), emails it to Touch Sound so an engineer
// can quote it, and sends the creator a confirmation email.

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

const PACKAGES = { choose: 'Choose for me', essential: 'Essential', pro: 'Pro', cinematic: 'Cinematic' };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body || '{}');
    const { name, email, videoUrl, length, platform, voice, reference, notes, rights } = body;
    const mood = Array.isArray(body.mood) ? body.mood.slice(0, 10) : [];
    const pack = PACKAGES[body.package] || PACKAGES.choose;

    if (!name || !email || !videoUrl || !length || rights !== 'yes') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing name, email, video link, length or rights confirmation' }) };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
    }
    if (!isHttpUrl(videoUrl) || (reference && !isHttpUrl(reference))) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid link' }) };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'Touch Sound <notifications@touchsound.online>';

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
    }

    const rows = [
      ['Name', escapeHtml(name)],
      ['Email', escapeHtml(email)],
      ['Video', `<a href="${escapeHtml(videoUrl)}">${escapeHtml(videoUrl)}</a>`],
      ['Length', escapeHtml(length)],
      ['Package', escapeHtml(pack)],
      ['Platform', escapeHtml(platform || 'Choose for me')],
      ['Mood', escapeHtml(mood.length ? mood.join(', ') : 'Choose for me')],
      ['Voice to keep', escapeHtml(voice || 'Not sure')],
      ['Reference', reference ? `<a href="${escapeHtml(reference)}">${escapeHtml(reference)}</a>` : '—'],
      ['Notes', escapeHtml(notes || '—').replace(/\n/g, '<br>')],
    ];

    // 1. Send the brief to Touch Sound so an engineer can quote it
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: 'contact@touchsound.online',
        reply_to: email,
        subject: `New AI video sound design brief from ${String(name).slice(0, 80)}`,
        html: `<p>New Sound for AI Video brief on touchsound.online. Reply to this email to send the quote.</p>
               <table cellpadding="4">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join('')}</table>
               <p>The creator confirmed they own the video or have the rights to use it.</p>`,
      }),
    });

    if (!notifyRes.ok) {
      const errText = await notifyRes.text();
      console.error('Resend error (notify):', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not send your brief' }) };
    }

    // 2. Confirm to the creator
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: email,
        subject: 'We got your video brief — Touch Sound',
        html: `<p>Hi ${escapeHtml(name)},</p>
               <p>Thanks for your Sound for AI Video brief! One of our sound designers will watch your video and email you a quote with the delivery date and a payment link.</p>
               <p>Nothing is charged until you accept the quote.</p>
               <p>— Touch Sound</p>`,
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('ai-video-request error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
