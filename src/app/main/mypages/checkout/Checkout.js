import { useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import Shippingbox from '../../pages/Shippingbox';
import PaymentModule from '../../pages/PreviousStatementWidget';
import OrderSummary from '../../pages/OrderSummary';
import { placesimsorder } from '../../services/services';
import checkSignin from '../../customHook.js/checkSignin';

const Checkout = (props) => {
  checkSignin();
  const navigate = useNavigate();
  const [servermsg, setservermsg] = useState('');
  const [style, setstyle] = useState({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  });
  const childRef = useRef();
  const childRef2 = useRef();
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    placesimsorder(props.simid.id, props.qty)
      .then((result) => {
        if (result.status === 'success') {
          setstyle({
            position: 'absolute',
            top: '49%',
            left: '53%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'lightgray',
            border: '2px solid #000',
            color: 'green',
            boxShadow: 24,
            p: 4,
          });
          setservermsg(result.message);
          setOpen(true);
        } else {
          setstyle({
            position: 'absolute',
            top: '49%',
            left: '53%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'lightgray',
            border: '2px solid #000',
            boxShadow: 24,
            color: 'red',
            p: 4,
          });

          setservermsg('Something going wrong');
          setOpen(true);
        }
      })
      .catch((error) => {
        console.warn(error);
      });
    setTimeout(() => {
      setOpen(false);

      location.reload();
    }, 3000);
  };

  const checkout = () => {
    if (childRef2.current.childFunction2()) {
      if (childRef.current.childFunction1()) {
        handleOpen();
      }
    }
  };

  const [amountcharged, setamountcharged] = useState();

  return (
    <>
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto">
            <Typography className="text-3xl font-semibold tracking-tight leading-8">
              Checkout
            </Typography>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12" />
        </div>
      </div>

      <div className="flex gap-x-24 p-24  flex-col md:flex-col lg:flex-row sm:flex-col">
        <div className="basis-2/3 mb-24 lg:mb-0">
          <Shippingbox ref={childRef2} />
          <PaymentModule
            ref={childRef}
            qty={props.qty}
            desc={props.simid}
            submit={handleOpen}
            amountcharged={amountcharged}
          />
        </div>
        <div className="basis-1/3">
          <OrderSummary
            setamountcharged={setamountcharged}
            desc={props.simid}
            plan={props.plan}
            qty={props.qty}
          />
          <div className="flex w-full container">
            <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0  pt-20 pb-0 md:pb-0">
              <div className="flex flex-col flex-auto" />
              <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                <Button
                  className="whitespace-nowrap"
                  variant="contained"
                  color="secondary"
                  onClick={checkout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {servermsg}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
export default Checkout;
