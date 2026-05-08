import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { useDispatch } from 'react-redux';

import { getcustomerdetail } from '../services/services';

import { setUser } from 'app/store/userSlice';

const checkSignin = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (secureLocalStorage.getItem('user_token') == null) {
      navigate('/sign-in');
    } else {
      // checkout mode / on,off on suspension
      getcustomerdetail().then((detail) => {
        const user = {
          role: [],
          data: {
            detail,
            displayName: secureLocalStorage.getItem('name'),
            photoURL: 'assets/images/avatars/brian-hughes.jpg',
            email: secureLocalStorage.getItem('email'),
            shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
          },
        };

        dispatch(setUser(user));

        if (JSON.parse(secureLocalStorage.getItem('user_info')).account_suspended == 1) {
          secureLocalStorage.setItem('mode', 'off');
        } else {
          secureLocalStorage.setItem('mode', 'on');
        }
      });
    }
  }, []);
};

export default checkSignin;
