import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import BasicPopover from "../main/mypages/orderlists/Popover";
import { ordersummary, removeOrderItem } from "../main/services/services";
import { updateloader } from "../main/apps/e-commerce/store/loaderSlice";

import { formatNumber } from "../main/pages/OrderSummary";

import Skeleton from "./Skeleton";

function OrderSummaryModified(props) {
  const childRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  }, [props.tabValue]);

  const [tmpDisable, setTmpDisable] = useState(false);
  const [surcharge, setsurcharge] = useState(0);
  const loadingSummary = useSelector((state) => {
    return state.loader;
  });

  const [removeLoader, setRemoveLoader] = useState();
  useLayoutEffect(() => {
    const user = JSON.parse(secureLocalStorage.getItem("user_info"));

    setsurcharge(user.surcharge);
  }, []);
  const dispatch = useDispatch();
  const removeThisItem = (obj, type) => {
    setTmpDisable(true);

    if (tmpDisable) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(props.itemsArray, "hash")) {
      if (!(removeLoader === (obj.plan_id || obj.sim_id))) {
        setRemoveLoader(obj.plan_id || obj.sim_id);

        const patiencePopupTimeout = setTimeout(() => {
          dispatch(updateloader("loading"));
        }, 6000);

        removeOrderItem(props.itemsArray.hash, obj.order_group_ids)
          .then((result) => {
            setTmpDisable(false);
            setRemoveLoader("");
            if (result.status === "success") {
              const arr = props.itemsArray;
              arr.summary = props.itemsArray.summary.filter((x) => x !== obj);
              props.setitemsArray(arr);
              props.setrefresh((prev) => prev + 1);

              Swal.fire({
                icon: "success",
                title: "Item removed from your cart",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Cart is currently locked",
                text: "Error",
              });
              // setloading2(false);
            }
          })
          .finally(() => {
            dispatch(updateloader(""));
            clearTimeout(patiencePopupTimeout);
          });
      }
    } else {
      const arr = props.itemsArray;
      arr.summary = props.itemsArray.summary.filter((x) => x !== obj);
      props.setitemsArray(arr);
      props.setrefresh((prev) => prev + 1);
      setTmpDisable(false);
    }
  };

  if (loadingSummary === "loading") {
    return (
      <Paper className="relative flex flex-col flex-auto p-24  rounded-2xl shadow overflow-hidden max-md:mt-5">
        <div className="flex items-center justify-between ">
          <div className="flex flex-col">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Order Summary
            </Typography>

            <Typography className="text-green-600 font-medium text-sm">
              Payment Pending{" "}
            </Typography>
          </div>
          <div className="-mt-8" />
        </div>

        <div className="grid grid-cols-12 gap-x-4 mt-16">
          <Typography
            className="col-span-6 font-medium text-md"
            color="text.secondary"
          >
            Order
          </Typography>
          <Typography
            className="font-medium text-md text-right col-span-2"
            color="text.secondary"
          >
            QTY
          </Typography>
          <Typography
            className="col-span-4 font-medium text-md text-right"
            color="text.secondary"
          >
            TOTAL
          </Typography>
          <div className="col-span-12 my-16 border-b" />
          <Skeleton
            times={7}
            itemsLength={props.itemsArray.summary.length}
          />{" "}
        </div>
      </Paper>
    );
  }

  return (
    <>
      <Paper className="relative flex flex-col flex-auto p-24  rounded-2xl shadow overflow-hidden mt-24 lg:mt-0">
        <div className="flex items-center justify-between ">
          <div className="flex flex-col">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Order Summary
            </Typography>

            <Typography className="text-green-600 font-medium text-sm">
              Payment Pending{" "}
            </Typography>
          </div>
          <div className="-mt-8" />
        </div>

        <div className="grid grid-cols-12 gap-x-4 mt-16">
          <Typography
            className="col-span-6 font-medium text-md"
            color="text.secondary"
          >
            Order
          </Typography>

          <Typography
            className="font-medium text-md text-right col-span-2"
            color="text.secondary"
          >
            QTY
          </Typography>
          <Typography
            className="col-span-4 font-medium text-md text-right"
            color="text.secondary"
          >
            TOTAL
          </Typography>

          <div className="col-span-12 my-16 border-b" />
          {props.itemsArray.summary.length > 0 ? (
            props.itemsArray.summary.map((obj) => {
              return (
                <>
                  <Tooltip
                    title={
                      Object.prototype.hasOwnProperty.call(props, "isLock") &&
                      props.isLock
                        ? "The cart is locked by admin"
                        : ""
                    }
                    arrow
                    placement="top-end"
                  >
                    <div className="col-span-12 grid grid-cols-12 gap-x-4 cart-items ">
                      <div className="col-span-6 ">
                        <Typography className="text-lg font-medium flex ">
                          {obj.plan_name ? obj.plan_name : obj.sim_name}

                          {obj?.lines?.[0] != null && (
                            <button
                              type="button"
                              className="text-green-300 cursor-pointer ml-2"
                              aria-describedby={obj.sim_id}
                              onClick={(e) =>
                                childRef.current.childFunction(
                                  e,
                                  obj.lines,
                                  obj.order_group_ids,
                                  props.itemsArray.portNumbers,
                                )
                              }
                            >
                              (Show lines)
                            </button>
                          )}
                        </Typography>
                      </div>

                      <Typography className="self-center text-right col-span-2">
                        {obj.qty ? obj.qty : 0}
                      </Typography>
                      <Typography className="col-span-4 self-center text-right">
                        ${formatNumber(obj.total)}
                      </Typography>

                      <>
                        <div className="remove-item-action col-span-12 flex justify-center gap-x-[15px] !mt-12">
                          <button
                            type="button"
                            className="text-red-400"
                            onClick={() => removeThisItem(obj)}
                            style={{
                              opacity:
                                removeLoader === (obj.plan_id || obj.sim_id)
                                  ? 0.5
                                  : 1,
                              cursor:
                                removeLoader === (obj.plan_id || obj.sim_id)
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {removeLoader === (obj.plan_id || obj.sim_id) ? (
                              <span className="bold">Removing....</span>
                            ) : (
                              "Remove"
                            )}
                          </button>
                        </div>
                      </>
                    </div>
                  </Tooltip>
                  <BasicPopover
                    id={obj.sim_id}
                    ref={childRef}
                    setrefresh={props.setrefresh}
                    key={JSON.stringify(obj)}
                  />
                  <div className="col-span-12 mb-16 border-b" />
                </>
              );
            })
          ) : (
            <>
              <div className="col-span-6">
                <Typography className="text-lg font-medium">
                  {props?.desc?.name}
                </Typography>
              </div>

              <Typography className="self-center text-right col-span-2">
                {props.qty}
              </Typography>
              <Typography className="col-span-4 self-center text-right">
                $
                {/* {orderSummary.subtotalPrice
                  ? orderSummary.subtotalPrice
                  : orderSummary.totalPrice} */}
              </Typography>

              <div className="col-span-12 my-16 border-b" />
            </>
          )}

          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            TAX
          </Typography>
          <Typography className="col-span-4 text-right">
            $
            {props.itemsArray.taxes
              ? formatNumber(props.itemsArray.taxes)
              : "0.00"}
          </Typography>

          <div className="col-span-12 my-12 border-b" />

          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            REGULATORY
          </Typography>
          <Typography className="col-span-4 text-right">
            $
            {props.itemsArray.regulatory
              ? formatNumber(props.itemsArray.regulatory)
              : "0.00"}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            SHIPPING FEES
          </Typography>
          <Typography className="col-span-4 text-right">
            $
            {props.itemsArray.shippingFees
              ? formatNumber(props.itemsArray.shippingFees)
              : "0.00"}
          </Typography>
          <div className="col-span-12 my-12 border-b" />

          <Typography
            className="col-span-8 self-center font-medium tracking-tight"
            color="text.secondary"
          >
            ACTIVATION FEES
          </Typography>
          <Typography className="col-span-4 text-right">
            $
            {props.itemsArray.activationFees
              ? formatNumber(props.itemsArray.activationFees)
              : "0.00"}
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
            $
            {props.itemsArray.subtotalPrice
              ? formatNumber(props.itemsArray.subtotalPrice)
              : formatNumber(ordersummary.subtotalPrice)}
          </Typography>
          <div className="col-span-12 my-12 border-b" />
          <Tooltip
            title={
              props.tabValue === 0 ? "Surcharge added" : "Surcharge removed"
            }
            placement="left"
            arrow
            open={showTooltip}
          >
            <Typography
              className="col-span-8 self-center font-medium tracking-tight"
              color="text.secondary"
            >
              SURCHARGE (
              {props.tabValue ? (
                <>{props.tabValue === 0 ? surcharge : 0}</>
              ) : (
                surcharge
              )}
              %)
            </Typography>
          </Tooltip>

          <Typography className="col-span-4 text-right">
            $
            {props.tabValue === 0
              ? formatNumber(props?.itemsArray?.credit_card?.surcharge)
              : props.tabValue === 1
              ? formatNumber(props?.itemsArray?.bank_account?.surcharge)
              : formatNumber(props?.itemsArray?.credit_card?.surcharge)}
            {/* ${props.itemsArray.surcharge ? formatNumber(props.itemsArray.surcharge) : "0.00"} */}
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
            {props.tabValue === 0
              ? formatNumber(props?.itemsArray?.credit_card?.totalPrice)
              : props.tabValue === 1
              ? formatNumber(props?.itemsArray?.bank_account?.totalPrice)
              : formatNumber(props?.itemsArray?.credit_card?.totalPrice)}
          </Typography>
          {props.showSubmitBtn && (
            <>
              <Typography
                className="col-span-8 self-center text-2xl font-medium tracking-tight"
                color="text.secondary"
              />
              <LoadingButton
                className="col-span-4 mt-[30px] cursor-pointer"
                //  className={classes.customButton}
                //    loadingClassName={classes.loadingButton}
                sx={{ color: "white" }}
                size="large"
                // onClick={handleClick}
                // endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                color="primary"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    props.checkout().then(() => {
                      setLoading(false);
                    });
                  }, 3000);
                }}
              >
                <span>Submit</span>
              </LoadingButton>
            </>
          )}
        </div>
      </Paper>
    </>
  );
}

export default memo(OrderSummaryModified);
