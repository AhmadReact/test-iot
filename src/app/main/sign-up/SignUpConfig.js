import authRoles from '../../auth/authRoles';

import SignUpPage from './SignUpPage';
import FastSignUpPage from './FastSignUpPage';

const SignUpConfig = {
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
      path: 'signUp',
      element: <SignUpPage />,
    },
    {
      path: 'fastsignup/*',
      element: <FastSignUpPage />,
    },
  ],
};

export default SignUpConfig;
