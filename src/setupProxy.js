const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.API_PROXY_TARGET || 'https://britex.pw';
const pathPrefix = process.env.API_PROXY_PATH_PREFIX || '/api';
const authHeader = process.env.API_PROXY_AUTH;

module.exports = function setupProxy(app) {
  app.use(
    pathPrefix,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        [`^${pathPrefix}`]: '/api',
      },
      onProxyReq: (proxyReq) => {
        if (authHeader) {
          proxyReq.setHeader('Authorization', authHeader);
        }
      },
    })
  );
};
