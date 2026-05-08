import './api/auth-api';
import './api/notifications-api';
import mock from './mock';

import history from '@history';

mock.onAny().passThrough();

if (module?.hot?.status() === 'apply') {
  const { pathname } = history.location;
  history.push('/loading');
  history.push({ pathname });
}
