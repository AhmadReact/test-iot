import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';
import secureLocalStorage from 'react-secure-storage';
import { Tooltip } from '@mui/material';

import {
  addonchangeordersummary,
  ordersummary,
  planchangeordersummary,
  removeOrderItem,
} from '../services/services';

export function formatNumber(numberString) {
  // Convert the string to a number
  const number = parseFloat(numberString);

  // Format the number with commas and two decimal places
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formattedNumber;
}

export function formatNumberWithoutFraction(numberString) {
  // Convert the string to a number
  const number = parseFloat(numberString);

  // Format the number with commas and two decimal places
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedNumber;
}

function OrderSummary(props) {
  const [orderSummary, setorderSummary] = useState('');
  const [tmpDisable, setTmpDisable] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  }, [props.tabValue]);
  useLayoutEffect(() => {
    if (props.addon) {
      ordersummary(
        0,
        props.qty,
        0,
        props.shipping,
        props.addon,
        props.selectedno,
        props.textarea2 ? props.textarea2 : props.csvdata,
        0,
        props.tabValue
      )
        .then((result) => {
          if (result.status == 'success') {
            setorderSummary(result.data);
            props.setamountcharged(result.data);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Server error',
              allowOutsideClick: false,
              allowEscapeKey: false,
              html: Object.keys(result.details)
                .map((obj) => result.details[obj])
                .join('<br>'),
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        })
        .catch((result) => {
          Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: 'Error',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        });
    } else if (props.addoninfo) {
      addonchangeordersummary(props.addoninfo, props.mode, props.selectedno, props.tabValue).then(
        (result) => {
          if (result.status == 'success') {
            setorderSummary(result.data);
            props.setamountcharged(result.data);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Server error',
              text: 'The selected orders subscription_ids is invalid',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        }
      );
    } else if (props.oldplan) {
      planchangeordersummary(props.newplan, props.oldplan, props.selectedno, props.tabValue).then(
        (result) => {
          if (result.status == 'success') {
            setorderSummary(result.data);
            props.setamountcharged(result.data);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Server error',
              text: 'The selected orders subscription_ids is invalid',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        }
      );
    } else if (props.itemsArray) {
      ordersummary(
        0,
        0,
        0,
        props.shipping,
        props.addon,
        0,
        0,
        props.itemsArray,
        props.tabValue
      ).then((result) => {
        if (result.status == 'success') {
          setorderSummary(result.data);
          props.setamountcharged && props.setamountcharged(result.data.totalPrice);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: 'The selected orders subscription_ids is invalid',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        }
      });
    } else {
      ordersummary(props.desc.id, props.qty, props.plan, props.shipping, props.addon).then(
        (result) => {
          if (result.status == 'success') {
            setorderSummary(result.data);
            props.setamountcharged(result.data.totalPrice);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Server error',
              text: 'The selected orders subscription_ids is invalid',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        }
      );
    }
  }, [props.itemsArray]);

  const [surcharge, setsurcharge] = useState(0);
  const [removeLoader, setRemoveLoader] = useState();

  useLayoutEffect(() => {
    const user = JSON.parse(secureLocalStorage.getItem('user_info'));
    setsurcharge(user.surcharge);
  }, []);

  const removeThisItem = (obj) => {
    setTmpDisable(true);
    if (tmpDisable) return true;

    if (props.orderhash) {
      if (!(removeLoader === obj.sim_id)) {
        setRemoveLoader(obj.sim_id);
        removeOrderItem(
          props.orderhash,
          props.itemsArray.find((x) => x.sim_id == obj.sim_id && x.type == obj.type).order_group_ids
        ).then((response) => {
          if (response.status === 'success') {
            props.setitemsArray(props.itemsArray.filter((x) => x != obj));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Cart is currently locked',
              text: 'Error',
            });
          }
          setRemoveLoader('');
          setTmpDisable(false);
        });
      }
    } else {
      props.setitemsArray(props.itemsArray.filter((x) => x != obj));
      setRemoveLoader('');
      setTmpDisable(false);
    }
  };

  function getAddonPriceWithQuantity(addons) {
    if (!addons) return;
    const firstAddonKey = Object.keys(addons)?.[0];
    if (!firstAddonKey) return 0; // Return 0 if there are no addons
    const { prices, quantity } = addons[firstAddonKey];
    return (prices?.[0] || 0) * (quantity || 0);
  }

  return (
    <>
      {props.csv && (
        <Paper className="relative flex flex-col flex-auto p-24 mb-24  rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                Order Detail
              </Typography>
            </div>
            <div className="-mt-8" />
          </div>

          <div className="flex flex-wrap gap-x-[10px] mt-16">
            <textarea disabled className="w-full h-[200px]">
              {props.csv}
            </textarea>
          </div>

          <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />
        </Paper>
      )}

      {props.textarea2 && (
        <Paper className="relative flex flex-col flex-auto p-24 mb-24  rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                Order Detail
              </Typography>
            </div>
            <div className="-mt-8" />
          </div>

          <div className="flex flex-wrap gap-x-[10px] mt-16">
            {props.textarea2.map((obj) => {
              return <div>{obj.sim}</div>;
            })}
          </div>

          <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />
        </Paper>
      )}

      {props.textarea && (
        <Paper className="relative flex flex-col flex-auto p-24 mb-24  rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                Order Detail
              </Typography>
            </div>
            <div className="-mt-8" />
          </div>

          <div className="flex flex-wrap gap-x-[10px] mt-16">{props.textarea}</div>

          <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />
        </Paper>
      )}

      {props.selectedno && (
        <Paper className="relative flex flex-col flex-auto p-24 mb-24  rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
                Order Detail
              </Typography>
            </div>
            <div className="-mt-8" />
          </div>

          <div className="flex flex-wrap gap-x-[10px] mt-16">
            {props.selectedno.map((obj) => {
              return <h5>{obj.sim_num ? obj.sim_num : obj.sim_card_num}</h5>;
            })}
          </div>

          <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />
        </Paper>
      )}

      <Paper className="relative flex flex-col flex-auto p-24  rounded-2xl shadow overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Order Summary
            </Typography>

            <Typography className="text-green-600 font-medium text-sm">Payment Pending </Typography>
          </div>
          <div className="-mt-8" />
        </div>

        <div className="grid grid-cols-12 gap-x-4 mt-16">
          <Typography className="col-span-6 font-medium text-md" color="text.secondary">
            Order
          </Typography>
          <Typography className="font-medium text-md text-right col-span-2" color="text.secondary">
            QTY
          </Typography>
          <Typography className="col-span-4 font-medium text-md text-right" color="text.secondary">
            TOTAL
          </Typography>
          <div className="col-span-12 my-16 border-b" />
          {props.addoninfo ? (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">{props.addoninfo.name}</Typography>
              </div>

              <Typography className="self-center text-right col-span-2">
                {orderSummary?.summary?.quantity
                  ? orderSummary?.summary?.quantity
                  : props.selectedno.length}
              </Typography>
              <Typography className="col-span-4 self-center text-right">
                ${formatNumber(orderSummary?.summary?.quantity * orderSummary?.summary?.amount)}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          ) : props.addon ? (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">{props.addon.name}</Typography>
              </div>

              <Typography className="self-center text-right col-span-2">
                {props.qty ? props.qty : props.selectedno.length}
              </Typography>
              <Typography className="col-span-4 self-center text-right">
                ${formatNumber(getAddonPriceWithQuantity(orderSummary?.summary?.addons))}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          ) : props.plan ? (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">{props.plan.name}</Typography>
              </div>

              <Typography className="self-center text-right col-span-2">
                {props.qty ? props.qty : props.selectedno.length}
              </Typography>
              <Typography className="col-span-4 self-center text-right">
                $
                {orderSummary.subtotalPrice
                  ? formatNumber(orderSummary.subtotalPrice)
                  : formatNumber(orderSummary.totalPrice)}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          ) : props.oldplan ? (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">
                  {orderSummary?.summary?.description}
                </Typography>
              </div>

              <Typography className="self-center text-right col-span-2">
                {orderSummary?.summary?.quantity
                  ? orderSummary?.summary?.quantity
                  : props.selectedno.length}
              </Typography>
              <Typography className="col-span-4 self-center text-right">
                $
                {orderSummary?.summary
                  ? formatNumber(orderSummary?.summary?.amount * orderSummary?.summary?.quantity)
                  : parseFloat(orderSummary.totalPrice)}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          ) : props.itemsArray.length > 0 ? (
            props.itemsArray.map((obj) => {
              return (
                <>
                  <Tooltip
                    title={
                      props.hasOwnProperty('isLock') && props.isLock
                        ? 'The cart is locked by admin'
                        : ''
                    }
                  >
                    <div className="col-span-12 grid grid-cols-12 gap-x-4 cart-items">
                      <div className="col-span-6 ">
                        <Typography className="text-lg font-medium ">{obj.sim_name}</Typography>
                      </div>

                      <Typography className="self-center text-right col-span-2">
                        {obj.qty ? obj.qty : 0}
                      </Typography>
                      <Typography className="col-span-4 self-center text-right">
                        $
                        {obj.type == 'sims' && (
                          <>{obj.price != null ? formatNumber(obj.price * obj.qty) : '0.00'}</>
                        )}
                        {obj.type == 'standard_recurring_plan' && (
                          <>
                            {orderSummary?.summary?.plans
                              ? orderSummary.summary.plans[obj.sim_id] &&
                                formatNumber(
                                  orderSummary.summary.plans[obj.sim_id].prices[0] *
                                    orderSummary.summary.plans[obj.sim_id].quantity
                                )
                              : '0.00'}
                          </>
                        )}
                        {obj.type == 'one_offs' && (
                          <>
                            {orderSummary?.summary?.one_offs
                              ? orderSummary.summary.one_offs[obj.sim_id] &&
                                formatNumber(
                                  orderSummary.summary.one_offs[obj.sim_id].prices[0] *
                                    orderSummary.summary.one_offs[obj.sim_id].quantity
                                )
                              : '0.00'}
                          </>
                        )}
                      </Typography>
                      {props.hasOwnProperty('isLock') && !props.isLock && (
                        <div
                          className="remove-item-action col-span-12 !mt-12"
                          onClick={() => removeThisItem(obj)}
                          style={{
                            opacity: removeLoader === obj.sim_id ? 0.5 : 1,
                            cursor: removeLoader === obj.sim_id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {removeLoader === obj.sim_id ? <span>Removing....</span> : 'Remove'}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                  <div className="col-span-12 mb-16 border-b" />
                </>
              );
            })
          ) : (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">{props.desc.name}</Typography>
              </div>

              <Typography className="self-center text-right col-span-2">{props.qty}</Typography>
              <Typography className="col-span-4 self-center text-right">
                $
                {orderSummary.subtotalPrice
                  ? formatNumber(orderSummary.subtotalPrice)
                  : formatNumber(orderSummary.totalPrice)}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          )}
          {orderSummary.monthlyCharge && (
            <>
              <Typography
                className="col-span-8 self-center font-medium tracking-tight"
                color="text.secondary"
              >
                MONTHLY CHARGE
              </Typography>

              <Typography className="col-span-4 text-right">
                ${orderSummary.monthlyCharge ? formatNumber(orderSummary?.monthlyCharge) : '0.00'}
              </Typography>
              <div className="col-span-12 my-12 border-b" />
            </>
          )}

          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            TAX
          </Typography>

          <Typography className="col-span-4 text-right">
            ${orderSummary.taxes ? formatNumber(orderSummary.taxes) : '0.00'}
          </Typography>

          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            REGULATORY
          </Typography>
          <Typography className="col-span-4 text-right">
            ${orderSummary.regulatory ? formatNumber(orderSummary.regulatory) : '0.00'}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            SHIPPING FEES
          </Typography>
          <Typography className="col-span-4 text-right">
            ${orderSummary.shippingFees ? formatNumber(orderSummary.shippingFees) : '0.00'}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            ACTIVATION FEES
          </Typography>
          <Typography className="col-span-4 text-right">
            ${orderSummary.activationFees ? formatNumber(orderSummary.activationFees) : '0.00'}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            DISCOUNT
          </Typography>
          <Typography className="col-span-4 text-right">$0.00</Typography>
          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-bold tracking-tight"
            color="text.secondary"
          >
            SUBTOTAL
          </Typography>
          <Typography className="col-span-4 font-bold  text-right">
            ${formatNumber(orderSummary.subtotalPrice)}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Tooltip
            title={
              props.tooltip ? (props.tabValue === 0 ? 'Surcharge added' : 'Surcharge removed') : ''
            }
            placement="left"
            arrow
            open={showTooltip}
          >
            <Typography
              className="col-span-8 self-center font-medium tracking-tight"
              color="text.secondary"
            >
              SURCHARGE ({props.tabValue == 0 ? surcharge : 0}%)
            </Typography>
          </Tooltip>
          <Typography className="col-span-4 text-right">
            $
            {props.tabValue == 0
              ? orderSummary?.credit_card?.surcharge
              : orderSummary?.bank_account?.surcharge}
          </Typography>

          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center text-2xl font-medium tracking-tight"
            color="text.secondary"
          >
            TOTAL
          </Typography>
          <Typography className="col-span-4 text-right text-2xl font-medium">
            $
            {formatNumber(
              props.tabValue == 0
                ? orderSummary?.credit_card?.totalPrice
                : orderSummary?.bank_account?.totalPrice
            )}
          </Typography>
        </div>

        <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />
      </Paper>
    </>
  );
}

export default memo(OrderSummary);
