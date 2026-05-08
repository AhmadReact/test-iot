import React, { useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import { UpdateCustomerInformation } from '../../services/services';

const Security = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [password, setpassword] = useState({
    old_password: '',
    password: '',
    password_confirmation: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setpassword({ ...password, [name]: value });
  };

  const updateInfo = () => {
    setloading(true);
    UpdateCustomerInformation(password).then((result) => {
      setloading(false);
      if (result.details) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.details,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: 'Password updated successfully',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        });
      }
    });
  };

  const [loading, setloading] = useState(false);
  return (
    <>
      <div className="md:pl-24">
        <div
          style={{ rowGap: 15, marginTop: 30, width: '50%' }}
          className="flex flex-col gap-x-20 justify-center"
        >
          <div>
            <FormControl sx={{ width: '100%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                style={{ width: '100%' }}
                // disabled={!(editable === "password")}
                value={password.old_password}
                onChange={(e) => handleChange(e)}
                name="old_password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Current Password"
              />
            </FormControl>
          </div>
          <div>
            <FormControl sx={{ width: '100%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                style={{ width: '100%' }}
                // disabled={!(editable === "password")}
                onChange={(e) => handleChange(e)}
                value={password.password}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
              />
            </FormControl>
          </div>

          <div>
            <FormControl sx={{ width: '100%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                style={{ width: '100%' }}
                // disabled={!(editable === "password")}
                value={password.password_confirmation}
                onChange={(e) => handleChange(e)}
                name="password_confirmation"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
          </div>
        </div>
      </div>
      <div
        className="flex items-center justify-end mt-24 sm:mr-20 sm:mx-8 space-x-12 relative"
        style={{ bottom: 42, marginTop: 50 }}
      >
        {loading ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            className="md:ml-10"
          >
            Updating..
          </LoadingButton>
        ) : (
          <Button
            className="whitespace-nowrap md:ml-10 md:mt-3"
            variant="contained"
            color="secondary"
            onClick={() => updateInfo()}
            // disabled={qty>0&&simid!=''?false:true}
          >
            Update
          </Button>
        )}
      </div>
    </>
  );
};

export default Security;
