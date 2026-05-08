import { LoadingButton } from '@mui/lab';
import { Button, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

const StandardPlan = ({ standardplans, processCartOrder }) => {
  const [loading, setloading] = useState(false);

  const [desc, setdesc] = useState('');

  const addItem = (type) => {
    const newObj = {
      sim_name: null,
      sim_id: null,
      plan_name: desc.name,
      plan_id: desc.id,
      qty,
      text: null,
      type,
      lines: [null],
    };

    processCartOrder(newObj);
  };

  const handleChange = (event) => {
    setdesc(event.target.value);
  };

  const handleinput = (e) => {
    if (e.target.value > 0 || e.target.value == '') {
      setqty(e.target.value);
    }
  };

  const [pageState, setPageState] = useState(0);
  const [qty, setqty] = useState('');
  return (
    <>
      <div className=" flex-auto mt-[30px]">
        <div
          style={{
            backgroundColor: '#fff',
            padding: 15,
            margin: '0px',
            borderRadius: 10,
          }}
          className="h-fit p-24 rounded-2xl shadow basis-2/3 mb-24 lg:mb-0 flex flex-col gap-x-20 justify-start"
        >
          <TextField
            className="mt-8 mb-16 w-full sm:w-1/2 md:w-full"
            required
            onChange={(e) => handleinput(e)}
            label="Quantity"
            autoFocus
            id="name"
            variant="outlined"
            value={qty}
          />

          <TextField
            id="outlined-select-currency"
            select
            label="Select"
            // value={props.desc}
            onChange={(e) => handleChange(e)}
            helperText="Please select your plan"
            className="w-full sm:w-1/2 md:w-full"
            required
          >
            {standardplans &&
              standardplans.map((obj, i) => {
                return (
                  <MenuItem key={i} value={obj}>
                    {obj.name}
                  </MenuItem>
                );
              })}
          </TextField>

          <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 p-20 md:pt-20 pb-0 md:pb-0">
            <div className="flex flex-col flex-auto" />
            <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
              {loading ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  className=" whitespace-nowrap"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                >
                  Processing..
                </LoadingButton>
              ) : (
                <Button
                  className="whitespace-nowrap"
                  variant="contained"
                  color="secondary"
                  onClick={() => addItem('standard_recurring_plan')}
                  // onClick={placeorder}
                  disabled={!(qty > 0 && desc)}
                >
                  Add items
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {itemsArray.length > 0 && (
            <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 p-20 md:pt-20 pb-0 md:pb-0">
              <div className="flex flex-col flex-auto"></div>
              <div className="flex items-center mb-28 mt-24 sm:mt-0 sm:mx-8 space-x-12">
                {loading ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    className=" whitespace-nowrap"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                  >
                    Processing..
                  </LoadingButton>
                ) : (
                  <Customdisabled>
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setloading(true);
                        setformstep(4)
                      }}
                      disabled={
                        secureLocalStorage.getItem("user_info") &&
                        secureLocalStorage.getItem("mode") === "off"
                          ? true
                          : itemsArray.length > 0
                          ? false
                          : true
                      }
                    >
                      Place Order
                    </Button>
                  </Customdisabled>
                )}
              </div>
            </div>
          )} */}
    </>
  );
};

export default StandardPlan;
