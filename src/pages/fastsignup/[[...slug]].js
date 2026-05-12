import Head from 'next/head';

/**
 * Catch-all so `/fastsignup`, `/fastsignup/anything`, and `/fastsignup/a/b/c`
 * all resolve. FastSignUpPage reads the trailing segment via react-router's
 * `useParams({ '*': plan })`, rendered through FuseLayout + useRoutes.
 */
export default function FastSignupRoute() {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
    </>
  );
}
