import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import { useDispatch, useSelector } from 'react-redux';
import secureLocalStorage from 'react-secure-storage';

import Swal from 'sweetalert2';

import {
  addonNumberchange,
  autoLogin,
  checkkeligibility,
  getcustomerdetail,
  resetpassword,
  signinWithApi,
} from '../services/services';
import { fetchCurrentCustomerInvoice } from '../services/Userthunk';

import Forgotpassword from './Forgotpassword';

import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { setUser } from 'app/store/userSlice';
import _ from '@lodash';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const navigate = useNavigate();
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [loading, setloading] = useState(false);

  const [Errors, setErrors] = useState(false);

  const dispatch = useDispatch();

  function onSubmit({ email, password }) {
    setloading(true);
    secureLocalStorage.setItem('email', email);
    signinWithApi(email, password).then((result) => {
      setloading(false);

      if (result.id) {
        addonNumberchange().then((result3) => {
          if (result3.length > 0) {
            secureLocalStorage.setItem('addon', true);
          } else {
            secureLocalStorage.removeItem('addon');
          }

          checkkeligibility().then((result2) => {
            if (result2.status === 'success') {
              if (result2.data['addons-upgrade']) {
                secureLocalStorage.setItem('addonsupgrade', true);
              } else {
                secureLocalStorage.removeItem('addonsupgrade');
              }
              if (result2.data['plan-upgrade']) {
                secureLocalStorage.setItem('planupgrade', true);
              } else {
                secureLocalStorage.removeItem('planupgrade');
              }
            }

            const user = {
              role: [],
              data: {
                displayName: secureLocalStorage.getItem('name'),
                photoURL: 'assets/images/avatars/brian-hughes.jpg',
                email: secureLocalStorage.getItem('email'),
                shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
              },
            };

            dispatch(setUser(user));

            navigate('/dashboards/subscriptions');
          });
        });
      } else {
        setErrors(true);
      }
    });
  }

  // const [rendered, setrendered] = useState();
  // useEffect(() => {
  //   getLogo().then((result) => {
  //     if (result.status == "success") {
  //       localStorage.setItem("logo", result.data.logo);
  //       setrendered(1);
  //     } else {
  //       localStorage.setItem("logo", "assets/images/logo/logo.svg");
  //       setrendered(1);
  //     }
  //   });
  // }, [rendered]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('hash')) {
      dispatch(showMessage({ message: 'Signing in with auto login' }));

      autoLogin(searchParams.get('hash')).then((result) => {
        if (result.id) {
          dispatch(showMessage({ message: 'Signed in with auto login' }));
          addonNumberchange().then((result2) => {
            if (result2.length > 0) {
              secureLocalStorage.setItem('addon', true);
            } else {
              secureLocalStorage.removeItem('addon');
            }

            checkkeligibility().then((eligibility) => {
              if (eligibility.status === 'success') {
                if (eligibility.data['addons-upgrade']) {
                  secureLocalStorage.setItem('addonsupgrade', true);
                } else {
                  secureLocalStorage.removeItem('addonsupgrade');
                }
                if (eligibility.data['plan-upgrade']) {
                  secureLocalStorage.setItem('planupgrade', true);
                } else {
                  secureLocalStorage.removeItem('planupgrade');
                }
              }

              getcustomerdetail(result.hash).then((detail) => {
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

                dispatch(
                  fetchCurrentCustomerInvoice({
                    hash: detail.hash,
                    id: detail.id,
                  })
                );
                navigate('/dashboards/subscriptions');
              });
            });
          });
        } else {
          dispatch(showMessage({ message: 'Auto signin failed' }));
        }
      });
    }
  }, []);

  const [toggle, settoggle] = useState('visible');
  const [check, setcheck] = useState(true);
  useEffect(() => {
    setErrors(false);
    setTimeout(() => {
      setcheck(toggle === 'visible');
    }, 1000);
  }, [toggle]);

  const [objPassword, setObjPassword] = useState({
    password: '',
    confirmpassword: '',
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setObjPassword({ ...objPassword, [name]: value });
  };

  const onSumitPassword = ({ email, password }) => {
    setloading(true);

    if (objPassword.password !== objPassword.confirmpassword) {
      setErrors(true);
      setloading(false);
    } else {
      resetpassword(searchParams.get('reset-password'), objPassword.password).then((result) => {
        if (result.status == 'success') {
          Swal.fire({
            title: 'Password changed successfully',

            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            allowEscapeKey: false,

            preConfirm: () => {
              navigate('/sign-in');
            },
          });
        }
        setloading(false);
      });
    }
  };

  const { loader } = useSelector((state) => {
    return state;
  });
  return (
    <div className="flex  flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 pt-[8rem] px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          {/* <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" /> */}
          {!loader ? (
            <img
              className="w-160 relative right-10 bottom-10"
              src={localStorage.getItem('logo')}
              alt="logo"
            />
          ) : (
            <div className="relative right-128">
              {' '}
              <FuseLoading />{' '}
            </div>
          )}
          {searchParams.get('reset-password') ? (
            <div>
              <Typography className="mt-12 text-4xl font-extrabold tracking-tight leading-tight">
                Reset Password
              </Typography>
              {/* <div className="flex items-baseline mt-2 font-medium">
      <Typography>Don't have an account?</Typography>
      <Link className="ml-4" to="/sign-up">
        Sign up
      </Link>
    </div> */}

              <div className="flex flex-col justify-center w-full mt-32">
                <TextField
                  className="mb-24"
                  label="Password"
                  autoFocus
                  type="password"
                  error={Errors}
                  helperText={Errors && 'Password & Confirm Password mismatched'}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  value={objPassword.password}
                  onChange={handle}
                />

                <TextField
                  onChange={handle}
                  className="mb-24"
                  name="confirmpassword"
                  label="Confirm Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                  value={objPassword.confirmpassword}
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
                    type="button"
                    size="large"
                    onClick={onSumitPassword}
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
              </div>
            </div>
          ) : (
            <>
              {' '}
              {check ? (
                <div
                  className="mytoggle h-[302px]"
                  style={{
                    visibility: toggle,
                    opacity: toggle === 'visible' ? 1 : 0,
                  }}
                >
                  <Typography className="mt-12 text-4xl font-extrabold tracking-tight leading-tight">
                    Sign in
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
                    onSubmit={handleSubmit(onSubmit)}
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

                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          label="Password"
                          type="password"
                          error={!!errors.password}
                          helperText={errors?.password?.message}
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
                        onClick={() => settoggle(toggle == 'visible' ? 'hidden' : 'visible')}
                      >
                        Forgot password?
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
                        Sign in
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
                </div>
              ) : (
                <div
                  className="mytoggle h-[302px]"
                  style={{
                    visibility: toggle === 'visible' ? 'hidden' : 'visible',
                    opacity: toggle === 'visible' ? 0 : 1,
                  }}
                >
                  <Forgotpassword settoggle={settoggle} toggle={toggle} />
                </div>
              )}
            </>
          )}
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: 'primary.main' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: 'primary.light' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.light' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>IoT Portal</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            Welcome to our bulk update portal! With our easy-to-use interface, you can quickly and
            efficiently make updates to multiple items all at once.
          </div>
          {/* <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              More than 17k people joined us, it's your turn
            </div>
          </div> */}
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
