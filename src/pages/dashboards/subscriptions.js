import Head from 'next/head';

/**
 * Main content is rendered by FuseLayout → useRoutes (see routesConfig).
 * This file exists so Next has a route module for /dashboards/subscriptions.
 */
export default function SubscriptionsDashboard() {
  return (
    <>
      <Head>
        <title>Subscriptions</title>
      </Head>
    </>
  );
}
