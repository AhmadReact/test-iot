import secureLocalStorage from 'react-secure-storage';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const links = [
  { href: '/dashboards/subscriptions', label: 'Subscriptions' },
  { href: '/dashboards/billinghistory', label: 'Billing History' },
  { href: '/dashboards/orderhistory', label: 'Order History' },
];

const SESSION_KEYS = ['user_token', 'user_info', 'name', 'email', 'mode', 'addon', 'addonsupgrade', 'planupgrade'];

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
  } catch {
    /* ignore */
  }
}

export default function DashboardTopNav() {
  const router = useRouter();
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch({ type: 'user/userLoggedOut' });
    clearClientSession();
    if (typeof window !== 'undefined') {
      window.location.assign('/sign-in');
    } else {
      router.replace('/sign-in');
    }
  };

  return (
    <nav
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {links.map((link) => {
          const active = router.pathname === link.href;
          return (
            <button
              key={link.href}
              type="button"
              onClick={() => router.push(link.href)}
              style={{
                border: active ? '1px solid #1d4ed8' : '1px solid #d1d5db',
                background: active ? '#2563eb' : '#fff',
                color: active ? '#fff' : '#111827',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={signOut}
        style={{
          border: '1px solid #d1d5db',
          background: '#fff',
          color: '#111827',
          borderRadius: 8,
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </nav>
  );
}
