import * as Yup from 'yup';

const passwordValidation = Yup.string()
  .min(8, 'Password must be at least 8 characters long.')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .matches(/\d/, 'Password must contain at least one number.')
  .matches(
    /[!@#$%^&*()_+{}[\]:;<>,.?~/-]/,
    'Password must contain at least one special character.'
  );

const portingValidation = Yup.object({
  porting_authorized_name: Yup.string().required('Authorized Name is required'),
  porting_address_line1: Yup.string().required('Address is required'),
  porting_city: Yup.string().required('City is required'),
  porting_number: Yup.string().required('Number to port is required'),
  porting_account_number: Yup.string().required('Porting number is required'),
  porting_company: Yup.string().required('Phone company is required'),
  porting_account_pin: Yup.string().required('Account pin is required'),
  porting_zip: Yup.string().required('Zip is required'),
  porting_state: Yup.string().required('State is required'),
});

export default portingValidation;
