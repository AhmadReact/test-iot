import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

const Actionbtn = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div>
        <Button
          className="bg-[#f6f9fb]"
          style={{
            maxWidth: '40px',
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
          onClick={(e) => {
            handleClick(e);
          }}
          size="small"
        >
          Action
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={handleClose}>Replace SIM Card</MenuItem>
          <MenuItem onClick={handleClose}>Deactivate</MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default Actionbtn;
