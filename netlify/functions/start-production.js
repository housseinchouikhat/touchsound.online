// Receives the uploaded test clip, emails it to Touch Sound (as an attachment)
// for manual review, and sends the tester a confirmation email.

function parseMultipart(event) {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  if (!boundaryMatch) throw new Error('No boundary found in Content-Type header');
  const boundary = '--' + boundaryMatch[1];

  const bodyBuffer = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body, 'binary');

  const bodyStr = bodyBuffer.toString('binary');
  const parts = bodyStr.split(boundary).slice(1, -1);

  const fields = {};
  let file = null;

  for (const part of parts) {
    const headerEndIndex = part.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) continue;
    const rawHeaders = part.slice(0, headerEndIndex);
    let content = part.slice(headerEndIndex + 4);
    if (content.endsWith('\r\n')) content = content.slice(0, -2);

    const nameMatch = rawHeaders.match(/name="([^"]+)"/);
    const filenameMatch = rawHeaders.match(/filename="([^"]*)"/);
    const name = nameMatch ? nameMatch[1] : null;

    if (filenameMatch && filenameMatch[1]) {
      const ctMatch = rawHeaders.match(/Content-Type:\s*(.+)/i);
      file = {
        filename: filenameMatch[1],
        contentType: ctMatch ? ctMatch[1].trim() : 'application/octet-stream',
        buffer: Buffer.from(content, 'binary'),
      };
    } else if (name) {
      fields[name] = content;
    }
  }
  return { fields, file };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { fields, file } = parseMultipart(event);
    const { name, email } = fields;

    if (!name || !email || !file || !file.buffer || !file.buffer.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing name, email, or file' }) };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'Touch Sound <notifications@touchsound.online>';

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
    }

    const fileBase64 = file.buffer.toString('base64');

    // 1. Email the clip to Touch Sound for manual review
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: 'contact@touchsound.online',
        subject: `New free sample test from ${name}`,
        html: `<p>New free sample submitted on touchsound.online.</p>
               <p><b>Name:</b> ${name}<br><b>Email:</b> ${email}</p>
               <p>The clip is attached.</p>`,
        attachments: [
          {
            filename: file.filename,
            content: fileBase64,
          },
        ],
      }),
    });

    if (!notifyRes.ok) {
      const errText = await notifyRes.text();
      console.error('Resend error (notify):', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not send your clip' }) };
    }

    // 2. Confirm to the tester
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: email,
        subject: 'We got your clip — Touch Sound',
        html: `<p>Hi ${name},</p>
               <p>Thanks for trying Touch Sound! We've received your clip and one of our engineers will clean it up personally.</p>
               <p>You'll receive your free before/after comparison by email within 24 hours.</p>
               <p>— Touch Sound</p>`,
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('start-production error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
