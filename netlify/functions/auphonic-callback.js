exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const data = payload.data || payload;
    const status = data.status_string || data.status;
    const title = data.title || '';

    if (!title.startsWith('TSFREE::')) {
      // Not one of our free-sample productions — ignore quietly
      return { statusCode: 200, body: 'Not a Touch Sound free sample' };
    }

    let info;
    try {
      const encoded = title.slice('TSFREE::'.length);
      info = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    } catch (decodeErr) {
      console.error('Could not decode title payload:', decodeErr);
      return { statusCode: 200, body: 'Could not decode submission info' };
    }

    // Only proceed once Auphonic reports the production is actually done
    if (status && !/done|completed/i.test(status)) {
      return { statusCode: 200, body: 'Not finished yet, waiting for next callback' };
    }

    const outputFiles = data.output_files || [];
    const audioFile = outputFiles.find((f) => f.format === 'mp3') || outputFiles[0];
    const downloadUrl = audioFile ? audioFile.download_url : null;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'Touch Sound <notifications@touchsound.online>';

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return { statusCode: 500, body: 'Server not configured' };
    }

    if (!downloadUrl) {
      console.error('No download URL found in Auphonic payload:', JSON.stringify(data));
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: info.email,
        cc: 'contact@touchsound.online',
        subject: 'Your free Touch Sound sample is ready 🎧',
        html: `
          <p>Hi ${info.name},</p>
          <p>Your free before/after sample has just been processed by Touch Sound.</p>
          ${downloadUrl
            ? `<p><a href="${downloadUrl}">Click here to download your cleaned audio</a></p>`
            : `<p>We ran into a small hiccup preparing your download link — reply to this email and we'll send it manually.</p>`}
          <p>Like what you hear? Head back to <a href="https://touchsound.online">touchsound.online</a> to book your full project.</p>
          <p>— Touch Sound</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend error:', errText);
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('auphonic-callback error:', err);
    return { statusCode: 500, body: 'Error' };
  }
};
