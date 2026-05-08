import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

import {
  getcustomeraccounts,
  MakePrimaryAccountService,
  RemoveCustomerAccountService,
} from '../../services/services';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordionsBanks({
  customeraccounts,
  setcustomeraccounts,
  setRefreshCard,
  AutopayHandler,
}) {
  const [expanded, setExpanded] = React.useState();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const removeAccount = (obj) => {
    if (obj.is_primary) {
      if (customeraccounts.length > 1) {
        const lastcard = customeraccounts.filter((x) => x.id != obj.id).slice(-1)[0];
        Swal.fire({
          title: 'Are you sure you want to proceed?',
          text: `This is your primary account, Deleting it will switch your primary account to ${lastcard.account_number} .`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: 'No',
          customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            removeAccountWrapper(obj);
            makePrimary(lastcard.id, 'noSwal');
          } else if (result.isDenied) {
            Swal.fire("Don't Worry Your Card is safe!", '', 'info');
          }
        });
      } else {
        Swal.fire({
          title: 'Are you sure you want to proceed?',
          text: `This is your only account, Removing this will un-enroll you from Auto-Pay.`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: 'No',
          customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            removeAccountWrapper(obj);
            AutopayHandler('off', 'noSwal');
          } else if (result.isDenied) {
            Swal.fire("Don't Worry Your Card is safe!", '', 'info');
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Are you sure you want to proceed?',
        text: 'Do you Really want to delete this account',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          removeAccountWrapper(obj);
          // Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire("Don't Worry Your Card is safe!", '', 'info');
        }
      });
    }
  };

  const removeAccountWrapper = (obj) => {
    setloading([0, 1]);
    RemoveCustomerAccountService(obj.vendor_id).then((result) => {
      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Account Successfully Deleted',
        });
      }
      getcustomeraccounts().then((result2) => {
        if (result2.status === 'success') {
          setcustomeraccounts(result2.data);
          setloading([0, 0]);
        }
      });
    });
  };

  const makePrimary = (id, noSwal) => {
    setloading([1, 0]);
    MakePrimaryAccountService(id).then((result) => {
      setloading([0, 0]);
      if (result.status === 'success') {
        setRefreshCard((prev) => prev + 1);
        getcustomeraccounts().then((result2) => {
          if (result2.status === 'success') {
            setcustomeraccounts(result2.data);
            setloading([0, 0]);
          }
          if (!noSwal) {
            Swal.fire({
              icon: 'success',
              title: 'Successfully make this as your primary account',
            });
          }
        });
      }
    });
  };

  const [loading, setloading] = useState([0, 0]);

  return (
    <>
      {' '}
      {customeraccounts.length > 0 ? (
        <div className="md:mt-8">
          {' '}
          <>
            {customeraccounts.map((obj) => {
              return (
                <Accordion expanded={expanded === obj.id} onChange={handleChange(obj.id)}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <div className="flex justify-between w-[98%]">
                      <Typography>
                        {obj.name_on_account}
                        {obj.is_primary && ' (Primary)'}
                      </Typography>

                      <Typography>{obj.account_number}</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex justify-between">
                      <div>
                        <Typography variant="button">Routing number :</Typography>
                        <Typography>{obj.routing_number}</Typography>
                      </div>
                      <div>
                        <Typography variant="button">Nick name</Typography>
                        <Typography>
                          <div>{obj.nick_name}</div>
                        </Typography>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="mt-10">
                        {loading[0] === 0 ? (
                          <>
                            {!obj.is_primary && (
                              <Button
                                variant="outlined"
                                className="md:mr-5"
                                onClick={() => makePrimary(obj.id)}
                              >
                                Make Primary
                              </Button>
                            )}
                          </>
                        ) : (
                          <LoadingButton
                            loading
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="outlined"
                            className="md:mr-5"
                          >
                            Updating..
                          </LoadingButton>
                        )}

                        {loading[1] === 1 ? (
                          <LoadingButton
                            loading
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="outlined"
                            className="md:ml-10"
                          >
                            Deleting..
                          </LoadingButton>
                        ) : (
                          <Button variant="outlined" onClick={() => removeAccount(obj)}>
                            Remove Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </>{' '}
        </div>
      ) : (
        <div className="flex justify-center items-center text-gray h-[100%] font-[500]">
          <h2>No bank account to show</h2>
        </div>
      )}
    </>
  );
}
