import Head from 'next/head';

/**
 * Fuse routes register `path: 'signUp'` (camelCase). The real form is rendered
 * by FuseLayout + useRoutes (see SignUpConfig.js).
 */
export default function SignUpRoute() {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
    </>
  );
}
