import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';

import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';

import { forgotpassword } from '../services/services';

import _ from '@lodash';

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
});
const Forgotpassword = (props) => {
  const onSubmitForgot = ({ email }) => {
    forgotpassword(email).then((result) => {
      if (result.details) {
        Swal.fire({
          title: 'Error',
          html: result.details,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'success',
          html: `Email has been sent to your account`,
          icon: 'success',
        });
      }
    });
  };

  const [Errors, setErrors] = useState(false);
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [loading, setloading] = useState(false);
  const { isValid, dirtyFields, errors } = formState;
  return (
    <>
      {' '}
      <Typography className="mt-12 text-4xl font-extrabold tracking-tight leading-tight">
        Forgot Password
      </Typography>
      {/* <div className="flex items-baseline mt-2 font-medium">
      <Typography>Don't have an account?</Typography>
      <Link className="ml-4" to="/sign-up">
        Sign up
      </Link>
    </div> */}
      <form
        name="loginForm"
        noValidate
        className="flex flex-col justify-center w-full mt-32"
        onSubmit={handleSubmit(onSubmitForgot)}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-24"
              label="Email"
              autoFocus
              type="email"
              error={Errors}
              helperText={Errors && 'Email & Password is not correct'}
              variant="outlined"
              required
              fullWidth
            />
          )}
        />

        <div className="flex flex-col sm:flex-row items-end justify-end sm:justify-end">
          {/* <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControlLabel
                label="Remember me"
                control={<Checkbox size="small" {...field} />}
              />
            </FormControl>
          )}
        /> */}

          <a
            className="text-md font-medium cursor-pointer"
            onClick={() => props.settoggle(props.toggle == 'visible' ? 'hidden' : 'visible')}
          >
            Sign in?
          </a>
        </div>
        {loading ? (
          <LoadingButton
            loading
            loadingPosition="start"
            className=" w-full mt-16"
            startIcon={<SaveIcon />}
            variant="outlined"
          >
            Processing..
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            className=" w-full mt-16"
            aria-label="Sign in"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
            size="large"
          >
            Submit
          </Button>
        )}

        {/* <div className="flex items-center mt-32">
        <div className="flex-auto mt-px border-t" />
        <Typography className="mx-8" color="text.secondary">
          Or continue with
        </Typography>
        <div className="flex-auto mt-px border-t" />
      </div>
   
      <div className="flex items-center mt-32 space-x-16">
        <Button variant="outlined" className="flex-auto">
          <FuseSvgIcon size={20} color="action">
            feather:facebook
          </FuseSvgIcon>
        </Button>
        <Button variant="outlined" className="flex-auto">
          <FuseSvgIcon size={20} color="action">
            feather:twitter
          </FuseSvgIcon>
        </Button>
        <Button variant="outlined" className="flex-auto">
          <FuseSvgIcon size={20} color="action">
            feather:github
          </FuseSvgIcon>
        </Button>
      </div> */}
      </form>
    </>
  );
};

export default Forgotpassword;
