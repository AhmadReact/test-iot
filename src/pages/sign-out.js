import { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import secureLocalStorage from 'react-secure-storage';

const SESSION_KEYS = [
  'user_token',
  'user_info',
  'name',
  'email',
  'mode',
  'addon',
  'addonsupgrade',
  'planupgrade',
];

function clearClientSession() {
  SESSION_KEYS.forEach((key) => {
    try {
      secureLocalStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  });
  try {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('jwt_access_token');
    localStorage.removeItem('persist:iot-root');
    localStorage.removeItem('addon');
  } catch {
    /* ignore */
  }
}

export default function SignOutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'user/userLoggedOut' });
    clearClientSession();
    if (typeof window !== 'undefined') {
      window.location.assign('/sign-in');
    }
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Signing out…</title>
      </Head>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#475569',
        }}
      >
        Signing out…
      </div>
    </>
  );
}
