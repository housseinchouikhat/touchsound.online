const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');

// Minimal multipart/form-data parser (no external dependency needed)
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

    const AUPHONIC_USER = process.env.AUPHONIC_USER;
    const AUPHONIC_PASS = process.env.AUPHONIC_PASS;
    if (!AUPHONIC_USER || !AUPHONIC_PASS) {
      console.error('Missing Auphonic credentials in environment variables');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
    }

    const SITE_URL = process.env.SITE_URL || `https://${event.headers.host}`;
    const auth = Buffer.from(`${AUPHONIC_USER}:${AUPHONIC_PASS}`).toString('base64');

    // Build a multipart body for the Auphonic API request
    const boundary = '----TouchSoundBoundary' + crypto.randomBytes(12).toString('hex');
    const textField = (fieldName, value) =>
      `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"\r\n\r\n${value}\r\n`;

    const preamble =
      textField('title', `Touch Sound Free Sample - ${name}`) +
      textField('action', 'start') +
      textField('webhook', `${SITE_URL}/.netlify/functions/auphonic-callback`) +
      textField('output_files', JSON.stringify([{ format: 'mp3' }])) +
      textField('algorithms', JSON.stringify({ denoise: true, leveler: true, normloudness: true })) +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="input_file"; filename="${file.filename}"\r\n` +
      `Content-Type: ${file.contentType}\r\n\r\n`;

    const closing = `\r\n--${boundary}--\r\n`;

    const auphonicBody = Buffer.concat([
      Buffer.from(preamble, 'binary'),
      file.buffer,
      Buffer.from(closing, 'binary'),
    ]);

    const auphonicRes = await fetch('https://auphonic.com/api/simple/productions.json', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: auphonicBody,
    });

    const auphonicData = await auphonicRes.json();

    if (!auphonicRes.ok || !auphonicData.data || !auphonicData.data.uuid) {
      console.error('Auphonic error:', JSON.stringify(auphonicData));
      return { statusCode: 502, body: JSON.stringify({ error: 'Audio engine error' }) };
    }

    const uuid = auphonicData.data.uuid;

    const store = getStore('pending-productions');
    await store.setJSON(uuid, { name, email, createdAt: Date.now() });

    return { statusCode: 200, body: JSON.stringify({ success: true, uuid }) };
  } catch (err) {
    console.error('start-production error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
