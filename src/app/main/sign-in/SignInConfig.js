import authRoles from '../../auth/authRoles';
import Terms from '../mypages/Terms/Terms';

import SignInPage from './SignInPage';

const SignInConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'sign-in',
      element: <SignInPage />,
    },
    {
      path: 'terms',
      element: <Terms />,
    },
  ],
};

export default SignInConfig;
