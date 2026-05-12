const path = require('path');
const aliases = require('./aliases');

const resolveAliases = () =>
  Object.fromEntries(
    Object.entries(aliases('./src')).map(([key, value]) => [key, path.resolve(__dirname, value)])
  );

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboards/billing-history',
        destination: '/dashboards/billinghistory',
        permanent: true,
      },
      {
        source: '/dashboards/order-history',
        destination: '/dashboards/orderhistory',
        permanent: true,
      },
      {
        source: '/dashboards/activate-sims',
        destination: '/dashboards/activatesims',
        permanent: true,
      },
      {
        source: '/dashboards/activate_sims',
        destination: '/dashboards/activatesims',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/signUp',
        permanent: false,
      },
    ];
  },
  webpack(config) {
    const map = resolveAliases();
    for (const [key, value] of Object.entries(map)) {
      config.resolve.alias[key] = value;
    }
    return config;
  },
  turbopack: {
    resolveAlias: resolveAliases(),
  },
};

module.exports = nextConfig;
