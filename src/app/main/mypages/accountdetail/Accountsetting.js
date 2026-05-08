import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

import { UpdateCustomerInformation } from '../../services/services';

import { setUser } from 'app/store/userSlice';

const Accountsetting = ({ customerdetail, setcustomerdetail }) => {
  const dispatch = useDispatch();
  const [editable, seteditable] = useState();
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setcustomerdetail({ ...customerdetail, [name]: value });
  };
  const updateInfo = (keys, value, field) => {
    setloading(true);

    UpdateCustomerInformation({ [keys]: value }).then((result) => {
      setloading(false);
      if (result.message) {
        seteditable('');

        if (keys === 'email' || keys === 'lname' || keys === 'fname') {
          const user = {
            role: [],
            data: {
              displayName: `${customerdetail.fname} ${customerdetail.lname}`,
              photoURL: 'assets/images/avatars/brian-hughes.jpg',
              email: customerdetail.email,
              shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
            },
          };

          dispatch(setUser(user));
        }

        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: `${field} updated successfully`,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: result.details,
        });
      }
    });
  };

  return (
    <div className="md:pl-24">
      <div style={{ rowGap: 15, marginTop: 30 }} className="flex flex-col gap-x-20 justify-center">
        <div>
          {' '}
          <TextField
            value={customerdetail.fname}
            style={{ width: '50%' }}
            onChange={(e) => handleChange(e)}
            maxlengt="3"
            id="outlined-required"
            label="First Name"
            name="fname"
            // disabled={isSelected[1] == 0?true:}
            // error={rederror == 1}
            // helperText={rederror == 1 && "Invalid Zipcode"}
            focused={editable === 'firstname'}
            inputProps={{ autoFocus: editable === 'firstname' }}
            disabled={!(editable === 'firstname')}
          />
          {editable == 'firstname' ? (
            <>
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
                  onClick={() => updateInfo('fname', customerdetail.fname, 'First Name')}
                  // disabled={qty>0&&simid!=''?false:true}
                >
                  Update
                </Button>
              )}

              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => seteditable('')}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable('firstname')}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Edit
            </Button>
          )}
        </div>
        <div>
          <TextField
            value={customerdetail.lname}
            style={{ width: '50%' }}
            onChange={(e) => handleChange(e)}
            id="outlined-required"
            label="Last Name"
            name="lname"
            disabled={!(editable === 'lastname')}
            // error={rederror == 1}
            // helperText={rederror == 1 && "Invalid Zipcode"}
          />

          {editable == 'lastname' ? (
            <>
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
                  onClick={() => updateInfo('lname', customerdetail.lname, 'Last Name')}
                  // disabled={qty>0&&simid!=''?false:true}
                >
                  Update
                </Button>
              )}

              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => seteditable('')}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable('lastname')}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Edit
            </Button>
          )}
        </div>

        <div>
          <TextField
            value={customerdetail.email}
            style={{ width: '50%' }}
            onChange={(e) => handleChange(e)}
            id="outlined-required"
            label="Email"
            name="email"
            disabled={!(editable === 'email')}
            // error={rederror == 1}
            // helperText={rederror == 1 && "Invalid Zipcode"}
          />

          {editable == 'email' ? (
            <>
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
                  onClick={() => updateInfo('email', customerdetail.email, 'Email')}
                  // disabled={qty>0&&simid!=''?false:true}
                >
                  Update
                </Button>
              )}

              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => seteditable('')}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable('email')}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Edit
            </Button>
          )}
        </div>

        <div>
          <TextField
            value={customerdetail.pin}
            style={{ width: '50%' }}
            onChange={(e) => handleChange(e)}
            id="outlined-required"
            label="Pin"
            name="pin"
            disabled={!(editable === 'pin')}
            // error={rederror == 1}
            // helperText={rederror == 1 && "Invalid Zipcode"}
          />

          {editable == 'pin' ? (
            <>
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
                  onClick={() => updateInfo('pin', customerdetail.pin, 'Pin')}
                  // disabled={qty>0&&simid!=''?false:true}
                >
                  Update
                </Button>
              )}
              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => seteditable('')}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable('pin')}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Edit
            </Button>
          )}
        </div>

        <div>
          <TextField
            value={customerdetail.phone}
            style={{ width: '50%' }}
            onChange={(e) => handleChange(e)}
            id="outlined-required"
            label="Primary Phone Number"
            name="phone"
            disabled={!(editable === 'phoneno')}
            // error={rederror == 1}
            // helperText={rederror == 1 && "Invalid Zipcode"}
          />

          {editable == 'phoneno' ? (
            <>
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
                  onClick={() => updateInfo('phone', customerdetail.phone, 'Primary Phone Number')}
                  // disabled={qty>0&&simid!=''?false:true}
                >
                  Update
                </Button>
              )}
              <Button
                className="whitespace-nowrap md:ml-10 md:mt-3"
                variant="contained"
                color="secondary"
                onClick={() => seteditable('')}
                // disabled={qty>0&&simid!=''?false:true}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="whitespace-nowrap md:ml-10 md:mt-3"
              variant="contained"
              color="secondary"
              onClick={() => seteditable('phoneno')}
              // disabled={qty>0&&simid!=''?false:true}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accountsetting;
