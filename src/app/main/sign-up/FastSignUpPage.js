import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import { useEffect, useState } from 'react';
import { MenuItem } from '@mui/material';
import Swal from 'sweetalert2';

import states from '../../data/states.json';
import { addCustomerProduct, createCustomerUpdated, verifyDynamicUrl } from '../services/services';

import _ from '@lodash';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  pin: yup
    .string()
    .required('Please enter your PIN.')
    .matches(/^\d{4}$/, 'PIN must be 4 digits.'),
  fname: yup.string().required('Please enter first name'),
  lname: yup.string().required('Please enter last name'),
  phone: yup.string().required('Please enter phone no'),

  shipping_fname: yup.string().required('Please enter first name'),
  shipping_lname: yup.string().required('Please enter last name'),
  shipping_address1: yup.string().required('Please enter shipping address 1'),
  shipping_state_id: yup.string().required('Please select shipping state'),
  shipping_city: yup.string().required('Please enter shipping city'),
  shipping_zip: yup.string().required('Please enter shipping zip code'),
  company_name: yup.string().required('Please enter company name'),
  billing_fname: yup.string().required('Please enter first name'),
  billing_lname: yup.string().required('Please enter last name'),
  billing_address1: yup.string().required('Please enter billing address 1'),
  billing_state_id: yup.string().required('Please select billing state'),
  billing_city: yup.string().required('Please enter billing city'),
  billing_zip: yup.string().required('Please enter billing zip code'),

  acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.'),
});

const defaultValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  fname: '',
  lname: '',
  phone: '',
  shipping_fname: '',
  shipping_lname: '',
  shipping_address1: '',
  shipping_address2: '',
  shipping_zip: '',
  shipping_state_id: '',
  shipping_city: '',
  acceptTermsConditions: false,
  pin: '',
  company_name: '',
  auto_pay: true,
  surcharge: '3',
  billing_fname: '',
  billing_lname: '',
  billing_state_id: '',
  billing_address1: '',
  billing_address2: '',
  billing_city: '',
  billing_zip: '',
  csv_invoice_enabled: true,
};

function FastSignUpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dynamicObj, setDynamicObj] = useState({ planid: null, simid: null });
  const { '*': plan } = useParams();
  useEffect(() => {
    if (plan) {
      verifyDynamicUrl(plan)
        .then((result) => {
          if (result.status == 'success') {
            setDynamicObj({ planid: result.plan_id, simid: result.sim_id });
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `Plan and Sim has been loaded successfully. Please signup.`,
              confirmButtonText: 'Ok',
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Not found',
              text: `${result.message}`,
              confirmButtonText: 'Ok',
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: `${error}`,
          });
        });
    }
  }, []);
  const { control, formState, handleSubmit, reset, setValue, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, setError } = formState;
  const [sameasprimary, setsameasprimary] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  function onSubmit({ displayName, password, email }) {
    setLoader(true);

    createCustomerUpdated(getValues(), searchParams.get('referral_code'))
      .then((res) => {
        reset();
        setSameShipBill(false);
        setLoader(false);
        addCustomerProduct({
          customer_id: res.data.id,
          sim_id: dynamicObj.simid ?? 47,
          plan_id: dynamicObj.planid ?? 410,
        }).then(() => {});
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `User created successfully. Please notify admin to load your product onto your new account.`,
          confirmButtonText: 'Ok',
          preConfirm: () => {
            navigate('/sign-in');
          },
        });
      })
      .catch((error) => {
        console.warn('error ', error);
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: `${error}`,
        });
      });

    // jwtService
    //   .createUser({
    //     displayName,
    //     password,
    //     email,
    //   })
    //   .then((user) => {
    //     // No need to do anything, registered user data will be set at app/auth/AuthContext
    //   })
    //   .catch((_errors) => {
    //     _errors.forEach((error) => {
    //       setError(error.type, {
    //         type: "manual",
    //         message: error.message,
    //       });
    //     });
    //   });
  }

  const [sameShipBill, setSameShipBill] = useState(false);

  const handleShipBill = () => {
    const shippingValues = getValues();
    setValue('billing_address1', shippingValues.shipping_address1);
    setValue('billing_address2', shippingValues.shipping_address2);
    setValue('billing_city', shippingValues.shipping_city);
    setValue('billing_state_id', shippingValues.shipping_state_id);
    setValue('billing_zip', shippingValues.shipping_zip);
    setValue('billing_fname', shippingValues.shipping_fname);
    setValue('billing_lname', shippingValues.shipping_lname);
    setSameShipBill(!sameShipBill);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-start w-full sm:w-auto md:h-full md:w-[100%] py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full   mx-auto sm:mx-0">
          <img
            className="w-160 relative right-10 bottom-10"
            src={localStorage.getItem('logo')}
            alt="logo"
          />
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign up
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-4" to="/sign-in">
              Sign in
            </Link>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-x-[16px]">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Email"
                    autoFocus
                    type="text"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                    autoComplete="off" // Disable browser autofill
                    inputProps={{
                      autoComplete: 'off', // Disable at input level as well
                      id: 'email_id', // Unique or random id to prevent autofill
                    }}
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

              <Controller
                name="passwordConfirm"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Confirm Password"
                    type="password"
                    error={!!errors.passwordConfirm}
                    helperText={errors?.passwordConfirm?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="pin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Pin"
                    type="text"
                    variant="outlined"
                    error={!!errors.pin}
                    helperText={errors?.pin?.message}
                    fullWidth
                    required
                    autoComplete="new-password" // Stronger attribute to prevent autofill
                    inputProps={{
                      autoComplete: 'new-password', // Disable autofill at input level as well
                      form: {
                        autoComplete: 'off', // Disable form-level autofill
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex gap-x-[16px]">
              <Controller
                name="company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Company"
                    type="text"
                    variant="outlined"
                    fullWidth
                    error={!!errors.company_name}
                    helperText={errors?.company_name?.message}
                    required
                  />
                )}
              />
              <Controller
                name="fname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Fist Name"
                    type="text"
                    error={!!errors.fname}
                    helperText={errors?.fname?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="lname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Last Name"
                    type="text"
                    error={!!errors.lname}
                    helperText={errors?.lname?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Phone Number"
                    type="text"
                    error={!!errors.phone}
                    helperText={errors?.phone?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />
            </div>

            {/* <div className="flex gap-x-[16px]">
              <Controller
                name="surcharge"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24 basis-1/2"
                    label="Surcharge"
                    type="text"
                    error={!!errors.surcharge}
                    helperText={errors?.surcharge?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="csv_invoice_enabled"
                control={control}
                render={({ field }) => (
                  <FormControl
                    className="items-start basis-1/2"
                    error={!!errors.csv_invoice_enabled}
                  >
                    <FormControlLabel
                      label="CSV Invoice"
                      control={<Checkbox size="small" {...field} checked={field.value}/>}
                    />
                    <FormHelperText>
                      {errors?.csv_invoice_enabled?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div> */}

            <div>
              <Typography className="mt-32 text-2xl font-bold tracking-tight leading-tight">
                Shipping Details
              </Typography>

              <div className="mt-32">
                <div className="flex gap-x-[16px]">
                  <Controller
                    name="shipping_fname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="First Name"
                        type="text"
                        error={!!errors.shipping_fname}
                        helperText={errors?.shipping_fname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="shipping_lname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Last Name"
                        type="text"
                        error={!!errors.shipping_lname}
                        helperText={errors?.shipping_lname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                  {/* 
                  <FormControlLabel
                    className="w-full"
                    label="Same as Primary First and Last Name"
                    control={
                      <Checkbox
                        size="small"
                        value={sameasprimary}
                        onChange={() => setsameasprimary(!sameasprimary)}
                      />
                    }
                  /> */}
                </div>

                <div className="flex gap-x-[16px]">
                  <Controller
                    name="shipping_address1"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address1"
                        type="text"
                        error={!!errors.shipping_address1}
                        helperText={errors?.shipping_address1?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="shipping_address2"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address2"
                        type="text"
                        error={!!errors.shipping_address2}
                        helperText={errors?.shipping_address2?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="shipping_city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="City"
                        type="text"
                        error={!!errors.shipping_city}
                        helperText={errors?.shipping_city?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex gap-x-[16px]">
                  <Controller
                    name="shipping_state_id"
                    control={control}
                    render={({ field }) => (
                      //   <TextField
                      //   className="md:w-[100%]"
                      //   value={accountDetail.billing_state_id}
                      //   onChange={(e) => {
                      //     handleChange(e);
                      //   }}
                      //   error={rederror[7] === 1}
                      //   id="outlined-required"
                      //   label="State"
                      //   name="billing_state_id"
                      //   select
                      //   helperText={rederror[7] === 1 && "Invalid state"}
                      // >
                      //   {states.map((option, i) => (
                      //     <MenuItem key={i} value={option.code}>
                      //       {option.name}
                      //     </MenuItem>
                      //   ))}
                      // </TextField>

                      <TextField
                        {...field}
                        className="mb-24"
                        label="State Id"
                        type="text"
                        error={!!errors.shipping_state_id}
                        helperText={errors?.shipping_state_id?.message}
                        variant="outlined"
                        required
                        fullWidth
                        select
                      >
                        {states.map((option, i) => (
                          <MenuItem key={i} value={option.code}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="shipping_zip"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Zipcode"
                        type="text"
                        error={!!errors.shipping_zip}
                        helperText={errors?.shipping_zip?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-32">
              <div className="flex gap-x-[16px] items-center">
                <Typography className=" text-2xl font-bold tracking-tight leading-tight">
                  Billing Details
                </Typography>

                <FormControlLabel
                  label="Same as Shipping Address"
                  control={
                    <Checkbox
                      size="small"
                      checked={sameShipBill}
                      onChange={() => handleShipBill()}
                    />
                  }
                />
              </div>
              <div className="mt-[16px]">
                <div className="flex gap-x-[16px]">
                  <Controller
                    name="billing_fname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="First Name"
                        type="text"
                        error={!!errors.billing_fname}
                        helperText={errors?.billing_fname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="billing_lname"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Last Name"
                        type="text"
                        error={!!errors.billing_lname}
                        helperText={errors?.billing_lname?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  {/* <FormControlLabel
                    className="w-full"
                    label="Same as Primary First and Last Name"
                    control={<Checkbox size="small" />}
                  /> */}
                </div>

                <div className="flex gap-x-[16px]">
                  <Controller
                    name="billing_address1"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address1"
                        type="text"
                        error={!!errors.billing_address1}
                        helperText={errors?.billing_address1?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="billing_address2"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Address2"
                        type="text"
                        error={!!errors.billing_address2}
                        helperText={errors?.billing_address2?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="billing_city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="City"
                        type="text"
                        error={!!errors.billing_city}
                        helperText={errors?.billing_city?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                </div>

                <div className="flex gap-x-[16px]">
                  <Controller
                    name="billing_state_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="State Id"
                        type="text"
                        error={!!errors.billing_state_id}
                        helperText={errors?.billing_state_id?.message}
                        variant="outlined"
                        required
                        fullWidth
                        select
                      >
                        {states.map((option, i) => (
                          <MenuItem key={i} value={option.code}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="billing_zip"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label="Zipcode"
                        type="text"
                        error={!!errors.billing_zip}
                        helperText={errors?.billing_zip?.message}
                        variant="outlined"
                        required
                        fullWidth
                        autoComplete="new-password" // Stronger attribute to prevent autofill
                        inputProps={{
                          autoComplete: 'new-password', // Disable autofill at input level as well
                          form: {
                            autoComplete: 'off', // Disable form-level autofill
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <Typography className="text-center">
              Click{' '}
              <a className="cursor-pointer" onClick={() => window.open('/terms')}>
                here
              </a>{' '}
              to read the terms of service.
            </Typography>
            <Controller
              name="acceptTermsConditions"
              control={control}
              render={({ field }) => (
                <FormControl className="items-center" error={!!errors.acceptTermsConditions}>
                  <FormControlLabel
                    label="I agree to the Terms of Service and Privacy Policy"
                    control={<Checkbox size="small" {...field} checked={field.value} />}
                  />
                  <FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-24"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid || loader}
              type="submit"
              size="large"
            >
              {loader ? 'Creating...' : 'Create your free account'}
            </Button>
          </form>
        </div>
      </Paper>

      {/* <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
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
            sx={{ color: "primary.light" }}
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
          sx={{ color: "primary.light" }}
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
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>our community</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            Fuse helps developers to build organized and well coded dashboards
            full of beautiful and rich modules. Join us and start building your
            application today.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  borderColor: "primary.main",
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
          </div>
        </div>
      </Box> */}
    </div>
  );
}

export default FastSignUpPage;
