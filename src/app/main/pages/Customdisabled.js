import { Tooltip } from '@mui/material';
import secureLocalStorage from 'react-secure-storage';

const Customdisabled = ({ children }) => {
  return (
    <Tooltip
      title={
        secureLocalStorage.getItem('user_info') && secureLocalStorage.getItem('mode') === 'off'
          ? 'Account is suspended, pay past due or contact us.'
          : ''
      }
      arrow
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default Customdisabled;
