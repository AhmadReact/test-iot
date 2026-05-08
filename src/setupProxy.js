const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.API_PROXY_TARGET || 'https://britex.pw';
const pathPrefix = process.env.API_PROXY_PATH_PREFIX || '/api';
const envAuthHeader = process.env.API_PROXY_AUTH;
const fallbackAuthHeader = process.env.REACT_APP_API_AUTH;
const isPlaceholderAuth =
  typeof envAuthHeader === 'string' &&
  envAuthHeader.trim().toLowerCase() === 'replace_with_rotated_real_secret';
const authHeader = !envAuthHeader || isPlaceholderAuth ? fallbackAuthHeader : envAuthHeader;

module.exports = function setupProxy(app) {
  const attachAuthHeader = (proxyReq) => {
    if (authHeader) {
      proxyReq.setHeader('Authorization', authHeader);
    }
  };

  app.use(
    pathPrefix,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        [`^${pathPrefix}`]: '/api',
      },
      onProxyReq: attachAuthHeader,
      on: {
        proxyReq: attachAuthHeader,
      },
    })
  );
};
