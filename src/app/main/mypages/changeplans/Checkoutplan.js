import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { motion } from 'framer-motion';

import { Tooltip } from '@mui/material';

import { orderupgradeplan } from '../../services/services';
import OrderSummary from '../../pages/OrderSummary';
import PaymentModule from '../../pages/PreviousStatementWidget';
import Billingbox from '../../pages/Billingbox';
import Shippingbox from '../../pages/Shippingbox';
import checkSignin from '../../customHook.js/checkSignin';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Checkoutplan = (props) => {
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

  const [formobj, setformobj] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    streetaddress2: '',
    city: '',
    zipcode: '',
    state: '',
  });

  const [formobj2, setformobj2] = useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    streetaddress2: '',
    city: '',
    zipcode: '',
    state: '',
  });

  const checkout = () => {
    if (childRef2.current.childFunction2()) {
      if (childRef.current.childFunction1()) {
        handleOpen();
      }
    }
  };

  const [amountcharged, setamountcharged] = useState(0);
  const [billupdate, setbillupdate] = useState(0);
  const [agreement, setagreement] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const summaryRef = useRef(null);
  useEffect(() => {
    const summary = summaryRef.current;

    if (summary) {
      const initialOffsetTop = summary.offsetTop;

      const specificHeight = 100; // Adjust this value to your specific height.

      const handleScroll = () => {
        const scrollY = window.scrollY + 100;

        if (scrollY >= initialOffsetTop + specificHeight) {
          summary.classList.add('sticky-summary');
        } else {
          summary.classList.remove('sticky-summary');
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const createOrder = () => {
    return new Promise((resolve, reject) => {
      orderupgradeplan(props.newplan, props.oldplan, props.selectedno).then((result) => {
        if (result.status === 'success') {
          result.planactivation = null;
          result.amountcharged =
            tabValue == 0
              ? amountcharged.credit_card.totalPrice
              : amountcharged.bank_account.totalPrice;
          resolve(result);
        }
      });
    });
  };

  return (
    <>
      <div className="flex w-full container">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                className="flex items-center"
                onClick={() => props.setformstep(0)}
                role="button"
                to="/apps/e-commerce/products"
                color="inherit"
              >
                <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-left</FuseSvgIcon>
                <span className="flex mx-4 font-medium">Back</span>
              </Typography>
            </motion.div>
            <motion.div
              className="hidden sm:flex"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-3xl font-semibold tracking-tight leading-8">
                Checkout
              </Typography>
            </motion.div>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12" />
        </div>
      </div>

      <div className="flex gap-x-24 p-24  flex-col md:flex-col lg:flex-row sm:flex-col">
        <div className="basis-2/3 mb-24 lg:mb-0">
          <Shippingbox
            formobj={formobj}
            setformobj={setformobj}
            ref={childRef2}
            setloading={props.setloading}
          />
          <Billingbox
            formobj={formobj2}
            setformobj={setformobj2}
            copy={formobj}
            billupdate={billupdate}
            setbillupdate={setbillupdate}
            setloading={props.setloading}
          />
          <PaymentModule
            ref={childRef}
            qty={props.qty}
            desc={props.simid}
            submit={createOrder}
            amountcharged={amountcharged}
            setloading={props.setloading}
            billupdate={billupdate}
            setagreement={setagreement}
            agreement={agreement}
            billing={formobj2}
            onetimeinvoice="changeplan"
            tabValue={tabValue}
            setTabValue={setTabValue}
          />
        </div>
        <div className="basis-1/3">
          <div ref={summaryRef}>
            <OrderSummary
              tooltip
              tabValue={tabValue}
              setamountcharged={setamountcharged}
              newplan={props.newplan}
              oldplan={props.oldplan}
              selectedno={props.selectedno}
            />
            <div className="flex w-full container">
              <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0  pt-20 pb-0 md:pb-0">
                <div className="flex flex-col flex-auto" />
                <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                  {props.loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                    >
                      Processing..
                    </LoadingButton>
                  ) : (
                    <Tooltip title={agreement ? '' : 'Please agree to our terms of service.'}>
                      <span>
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          onClick={checkout}
                          disabled={!agreement}
                        >
                          Checkout
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                </div>
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
export default Checkoutplan;
