import * as React from 'react';
import Button from '@mui/material/Button';

import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import Swal from 'sweetalert2';

const Actionbtn = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deactivate = () => {
    Swal.fire({
      icon: 'info',
      title: 'Do you want to close this subscription?',
      html: `${props.num}`,
      showCloseButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setloader(true);
        props
          .click([
            {
              id: props.subscription.id,
              sim_card_num: props.subscription.sim_card_num,
            },
          ])
          .then(() => {
            setloader(false);
          });
      }
    });

    setAnchorEl(null);
  };
  const [loader, setloader] = useState(false);
  return (
    <>
      <div>
        {loader ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            style={{
              maxWidth: '69px',
              maxHeight: '20px',
              minWidth: '69px',
              minHeight: '20px',
              fontSize: 10,
            }}
          >
            ...
          </LoadingButton>
        ) : (
          <>
            <Button
              className="bg-[#f6f9fb]"
              style={{
                maxWidth: '69px',
                maxHeight: '20px',
                minWidth: '40px',
                minHeight: '20px',
                fontSize: 10,
              }}
              variant="contained"
              id="fade-button"
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={deactivate}
              size="small"
            >
              Close
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Actionbtn;
