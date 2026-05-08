import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { MenuItem, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';

import Swal from 'sweetalert2';

import states from '../../../data/states.json';
import { submitPortInformation } from '../../services/services';

import portingValidation from '@fuse/utils/ValidationSchema';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PortingModal({ data, Id, setPortingInformation, setrefresh }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loader, setLoader] = React.useState(false);

  const {
    porting_account_number,
    porting_account_pin,
    porting_address_line1,
    porting_address_line2,
    porting_authorized_name,
    porting_city,
    porting_company,
    porting_notes,
    porting_number,
    porting_ssn_taxid,
    porting_state,
    porting_zip,
  } = data;

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    submitForm: formikSubmitForm,
  } = useFormik({
    initialValues: {
      porting_authorized_name: porting_authorized_name || '',
      porting_address_line1: porting_address_line1 || '',
      porting_address_line2: porting_address_line2 || '',
      porting_zip: porting_zip || '',
      porting_state: porting_state || '',
      porting_city: porting_city || '',
      porting_number: porting_number || '',
      porting_company: porting_company || '',
      porting_account_number: porting_account_number || '',
      porting_ssn_taxid: porting_ssn_taxid || '',
      porting_account_pin: porting_account_pin || '',
      id: Id,
      porting_notes: porting_notes || '',
    },
    validationSchema: portingValidation,
    onSubmit: (values) => {
      setLoader(true);
      submitPortInformation(values)
        .then((result) => {
          setLoader(false);
          if (result.status == 'success') {
            handleClose();
            setrefresh((prev) => prev + 1);
            Swal.fire({
              icon: 'success',
              title: 'Porting Information Added Successfully',
              customClass: {
                popup: 'swal-front',
              },
            });
          } else if (result.status == 'error') {
            const formattedErrors = Object.entries(result.message)
              .map(([field, messages]) => `<strong>${field}</strong>: ${messages.join(', ')}`)
              .join('<br>');
            Swal.fire({
              icon: 'info',
              title: 'Validation Errors',
              html: formattedErrors,
              customClass: {
                popup: 'swal-front',
              },
            });
          }
        })
        .catch(() => {});
    },
  });

  return (
    <div>
      <Tooltip title="Add porting information">
        <Button
          style={{
            maxWidth: '20px',
            maxHeight: '20px',
            minWidth: '20px',
            minHeight: '20px',
            fontSize: 10,
            fontWeight: 'bold',
          }}
          className="bg-[#f6f9fb]"
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          +
        </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={style} className="w-[90vw] md:w-[1200px] p-10 md:p-36">
            <h2 className="text-center font-semibold">Transfer Details</h2>
            <p className="text-center">
              Please enter your account information from your current carrier below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[20px] gap-y-[10px] mt-[20px]">
              <TextField
                id="outlined-required"
                label="Authorized Name*"
                name="porting_authorized_name"
                value={values.porting_authorized_name}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_authorized_name}
              />

              <TextField
                id="outlined-required"
                label="Address Line 1*"
                name="porting_address_line1"
                value={values.porting_address_line1}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_address_line1}
              />
              <TextField
                id="outlined-required"
                label="Address Line 2"
                name="porting_address_line2"
                value={values.porting_address_line2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <TextField
                id="outlined-required"
                label="City*"
                name="porting_city"
                value={values.porting_city}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_city}
              />

              <TextField
                id="outlined-required"
                label="State*"
                name="porting_state"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.porting_state}
                helperText={errors.porting_state}
                select
              >
                {states.map((option, i) => (
                  <MenuItem key={i} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-required"
                label="Zip*"
                name="porting_zip"
                value={values.porting_zip}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_zip}
              />

              <TextField
                id="outlined-required"
                label="SSN/Tax ID(Optional)"
                name="porting_ssn_taxid"
                value={values.porting_ssn_taxid}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <TextField
                id="outlined-required"
                label="SIM Card Number"
                name="sim"
                value={data.sim_num}
                disabled
              />
              <TextField
                id="outlined-required"
                label="Number to Port*"
                name="porting_number"
                value={values.porting_number}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_number}
              />
              <TextField
                id="outlined-required"
                label="Phone Company you are porting from*"
                name="porting_company"
                value={values.porting_company}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_company}
              />
              <TextField
                id="outlined-required"
                label="Account Number of former carrier*"
                name="porting_account_number"
                value={values.porting_account_number}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_account_number}
              />
              <TextField
                id="outlined-required"
                label="Account Pin you are porting from*"
                name="porting_account_pin"
                value={values.porting_account_pin}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.porting_account_pin}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <TextField
                className="mt-20 w-full"
                id="outlined-multiline-static"
                label="Notes"
                name="porting_notes"
                multiline
                rows={5}
                value={values.porting_notes}
                onChange={handleChange}
              />
            </div>
            <div className="mt-[30px] flex justify-end">
              <LoadingButton
                className="whitespace-nowrap pos"
                variant="contained"
                color="secondary"
                style={{
                  width: '100px',
                  height: '40px',
                }}
                type="submit"
                loading={loader}
              >
                Submit
              </LoadingButton>
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
