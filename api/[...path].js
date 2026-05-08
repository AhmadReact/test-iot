const DEFAULT_TARGET = 'https://britex.pw';
const DEFAULT_PATH_PREFIX = '/api';

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

module.exports = async (req, res) => {
  try {
    const target = process.env.API_PROXY_TARGET || DEFAULT_TARGET;
    const pathPrefix = process.env.API_PROXY_PATH_PREFIX || DEFAULT_PATH_PREFIX;
    const authHeader = process.env.API_PROXY_AUTH;

    const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
    const requestPath = pathParts.join('/');
    const queryStringIndex = req.url.indexOf('?');
    const queryString = queryStringIndex >= 0 ? req.url.slice(queryStringIndex) : '';
    const normalizedPrefix = pathPrefix.replace(/\/+$/, '');
    const targetUrl = `${target}${normalizedPrefix}/${requestPath}${queryString}`;

    const bodyAllowed = req.method !== 'GET' && req.method !== 'HEAD';
    const rawBody = bodyAllowed ? await readRawBody(req) : undefined;

    const incomingHeaders = { ...req.headers };
    delete incomingHeaders.host;
    delete incomingHeaders['content-length'];

    if (authHeader) {
      incomingHeaders.authorization = authHeader;
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers: incomingHeaders,
      body: rawBody && rawBody.length > 0 ? rawBody : undefined,
      redirect: 'follow',
    });

    res.status(upstreamResponse.status);

    upstreamResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, value);
      }
    });

    const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
    res.send(responseBuffer);
  } catch (error) {
    res.status(502).json({
      status: 'error',
      message: 'API proxy request failed',
      details: error?.message || 'Unknown proxy error',
    });
  }
};
