import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useLayoutEffect,
} from "react";

import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { cardTransactionLimit } from "src/app/constraint/constraints";
import { isExpired } from "src/app/myUtils/Utilities";

import { updateloader } from "../apps/e-commerce/store/loaderSlice";
import {
  addbillingcard,
  MakePrimaryCardService,
  UpdateCustomerInformation,
  addAccountAndCharge,
  chargefromCreditBalance,
  chargefromaccount,
  chargefromcard,
  getCreditBalance,
  getcustomeraccounts,
  getcustomercards,
  getcustomerdetail,
  onetimeinvoice,
} from "../services/services";

import { formatNumber, formatNumberWithoutFraction } from "./OrderSummary";

import { selectCompanyDetail } from "app/store/userSlice";

import FuseLoading from "@fuse/core/FuseLoading";
import Banksection from "app/shared-components/Banksection";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const url = process.env.REACT_APP_API;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000 0000 0000 0000 000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const MMYY = React.forwardRef(function MMYY(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00/00"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

MMYY.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PaymentModule = React.forwardRef((props, ref) => {
  const { tabValue, setTabValue } = props;

  useImperativeHandle(ref, () => ({
    childFunction1() {
      if (tabValue === 0) {
        ifCardSelected();
      }
      if (tabValue === 1) {
        ifBankSelected();
      }
    },
  }));

  const ifCardSelected = () => {
    if (cardnumber != "new") {
      props.setloading(true);
      props
        .submit()
        .then((result) => {
          if (result.amountcharged > cardTransactionLimit) {
            props.setloading(false);
            Swal.fire({
              icon: "info",
              title: "Transcation Limit",
              text: `For transactions above $${formatNumberWithoutFraction(
                cardTransactionLimit,
              )} please use a bank account instead of a credit card to complete your payment.`,
            });
            return;
          }

          const chargedAmount = result.amountcharged ?? props.amountcharged;
          chargefromCreditBalance(
            chargedAmount,
            balance,
            payFromBalance,
            result.data.order_hash,
            props.tabValue,
          )
            .then((response) => {
              chargefromcard(
                cardnumber,
                response.data.remaining_cart_amount,
                props.billing.firstname,
                props.billing.lastname,
                result.data.order_hash,
              )
                .then((res) => {
                  if (res.success == true) {
                    if (enableAutopay != data?.detail?.auto_pay) {
                      UpdateCustomerInformation({
                        auto_pay: enableAutopay ? 1 : 0,
                      }).then((res) => {});
                    }
                    onetimeinvoice(
                      result.planactivation ? result.planactivation : 0,
                      result.data.order_hash,
                      props.numberchange && props.numberchange,
                      props.onetimeinvoice && props.onetimeinvoice,
                      props.tabValue,
                    ).then((response) => {
                      if (response.status === "success") {
                        props.setloading(false);
                        window.history.replaceState(
                          null,
                          "New Page Title",
                          window.location.pathname,
                        );
                        localStorage.removeItem("orderhash");
                        Swal.fire({
                          title: "Order received successfully",
                          html: `<h4>Your order no : ${
                            response.data.order_num
                          }</h4><br> ${
                            response.data.invoice_in_background
                              ? `<h3>
                                <b>Your invoice is generating and will be sent to your
                                email</b>
                              </h3>
                            `
                              : ""
                          }
                      `,
                          denyButtonText: `Download Invoice`,
                          showDenyButton: !response.data.invoice_in_background,
                          denyButtonColor: "#7066e0",
                          icon: "success",
                          confirmButtonText: "Ok",
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          preDeny: () => {
                            window.open(
                              `${url}invoice/download/1?order_hash=${result.data.order_hash}`,
                              "_blank",
                            );
                            return false; // Prevent denied
                          },
                          preConfirm: () => {
                            window.location.reload();
                          },
                        });
                      } else {
                        Swal.fire({
                          title: "Error",
                          html: `Error generating Invoice`,
                          icon: "error",
                          confirmButtonText: "Ok",
                          allowOutsideClick: false,
                          allowEscapeKey: false,

                          preConfirm: () => {
                            location.reload();
                          },
                        });
                        props.setloading(false);
                      }
                    });
                  } else {
                    Swal.fire({
                      title: "Error",
                      html: `Error processing payment`,
                      icon: "error",
                      confirmButtonText: "Ok",
                      allowOutsideClick: false,
                      allowEscapeKey: false,

                      preConfirm: () => {
                        location.reload();
                      },
                    });
                    props.setloading(false);
                    return false;
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    html: `${error}`,
                    icon: "error",
                    confirmButtonText: "Ok",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                    // preConfirm: () => {
                    //   location.reload();
                    // },
                  });
                  props.setloading(false);
                });
            })
            .catch(() => {
              Swal.fire({
                title: "Error",
                html: "Error paying from credit balance",
                icon: "error",
                confirmButtonText: "Ok",
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: () => {
                  location.reload();
                },
              });
            });
        })
        .catch((error) => {
          if (Array.isArray(error.detail)) {
            Swal.fire({
              title: "Error",
              html: error.detail,
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          } else {
            Swal.fire({
              title: "Error",
              html: "Error Submitting Order",
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          }

          props.setloading(false);
        });
    } else {
      if (cardholdername.length < 3) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Enter valid cardholder name");
        setrederror(0);
        return false;
      }
      if (values.textmask.length < 15) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Enter proper card number");
        setrederror(1);
        return false;
      }
      if (cvv.length < 3) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Enter proper cvv");
        setrederror(2);
        return false;
      }
      if (values.mmyy.length != 5) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Enter proper MM/YY");
        setrederror(3);
        return false;
      }
      if (isExpired(values.mmyy)) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Card expiration date is invalid");
        setrederror(3);
      } else {
        let bol = false;
        props.setloading(true);

        props
          .submit()
          .then((result) => {
            if (result.amountcharged > cardTransactionLimit) {
              props.setloading(false);
              Swal.fire({
                icon: "info",
                title: "Transcation Limit",
                text: `For transactions above $ ${formatNumberWithoutFraction(
                  cardTransactionLimit,
                )} please use a bank account instead of a credit card to complete your payment.`,
              });
              return;
            }

            getcustomerdetail().then((bill) => {
              const chargedAmount = result.amountcharged ?? props.amountcharged;

              chargefromCreditBalance(
                chargedAmount,
                balance,
                payFromBalance,
                result.data.order_hash,
                props.tabValue,
              )
                .then((response) => {
                  addbillingcard(
                    cardholdername,
                    values.textmask.replace(/\s/g, ""),
                    values.mmyy,
                    cvv,
                    bill,
                    response.data.remaining_cart_amount,
                    result.data.order_hash,
                  )
                    .then((res) => {
                      if (res.success == true) {
                        if (
                          customeraccounts.length == 0 &&
                          customercardlist.length == 0 &&
                          res?.primary
                        ) {
                          MakePrimaryCardService(res.card.card.id).then(
                            () => {},
                          );
                        }

                        if (enableAutopay != data?.detail?.auto_pay) {
                          UpdateCustomerInformation({
                            auto_pay: enableAutopay ? 1 : 0,
                          }).then((res) => {});
                        }

                        onetimeinvoice(
                          result.planactivation ? result.planactivation : 0,
                          result.data.order_hash,
                          props.numberchange && props.numberchange,
                          props.onetimeinvoice && props.onetimeinvoice,
                          props.tabValue,
                        ).then((response) => {
                          if (response.status === "success") {
                            window.history.replaceState(
                              null,
                              "New Page Title",
                              window.location.pathname,
                            );
                            localStorage.removeItem("orderhash");
                            Swal.fire({
                              title: "Order received successfully",
                              html: `<h4>Your order no : ${
                                response.data.order_num
                              }</h4><br> ${
                                response.data.invoice_in_background
                                  ? `<h3>
                                <b>Your invoice is generating and will be sent to your
                                email</b>
                              </h3>
                            `
                                  : ""
                              }`,
                              denyButtonText: `Download Invoice`,
                              showDenyButton:
                                !response.data.invoice_in_background,
                              denyButtonColor: "#7066e0",
                              icon: "success",
                              confirmButtonText: "Ok",
                              allowOutsideClick: false,
                              allowEscapeKey: false,
                              preDeny: () => {
                                window.open(
                                  `${url}invoice/download/1?order_hash=${result.data.order_hash}`,
                                  "_blank",
                                );
                                return false; // Prevent denied
                              },
                              preConfirm: () => {
                                location.reload();
                              },
                            });
                            props.setloading(false);
                            bol = true;
                          } else {
                            Swal.fire({
                              title: "Error",
                              html: `Error generating Invoice`,
                              icon: "error",
                              confirmButtonText: "Ok",
                              allowOutsideClick: false,
                              allowEscapeKey: false,

                              preConfirm: () => {
                                location.reload();
                              },
                            });
                            props.setloading(false);
                            bol = true;
                          }
                        });
                      } else {
                        if (Array.isArray(res.message)) {
                          Swal.fire({
                            title: "Payment Error",
                            html: `${res.message[0]}`,
                            icon: "error",
                            confirmButtonText: "Ok",
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                            // preConfirm: () => {
                            //   location.reload();
                            // },
                          });
                        } else if (res?.message) {
                          Swal.fire({
                            title: "Payment Error",
                            html: `${res?.message}`,
                            icon: "error",
                            confirmButtonText: "Ok",
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                            // preConfirm: () => {
                            //   location.reload();
                            // },
                          });
                        } else {
                          Swal.fire({
                            title: "Payment Error",
                            html: `Error Adding Card`,
                            icon: "error",
                            confirmButtonText: "Ok",
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                            // preConfirm: () => {
                            //   location.reload();
                            // },
                          });
                        }
                        props.setloading(false);
                        bol = true;
                      }
                    })
                    .catch((error) => {
                      props.setloading(false);
                      Swal.fire({
                        title: "Error",
                        html: `${error}`,
                        icon: "error",
                        confirmButtonText: "Ok",
                        allowOutsideClick: false,
                        allowEscapeKey: false,

                        // preConfirm: () => {
                        //   location.reload();
                        // },
                      });
                    });
                })
                .catch(() => {
                  Swal.fire({
                    title: "Error",
                    html: "Error paying from credit balance",
                    icon: "error",
                    confirmButtonText: "Ok",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                    preConfirm: () => {
                      location.reload();
                    },
                  });
                });
            });
          })
          .catch((error) => {
            if (Array.isArray(error.detail)) {
              Swal.fire({
                title: "Error",
                html: error.detail,
                icon: "error",
                confirmButtonText: "Ok",
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: () => {
                  // location.reload();
                },
              });
            } else {
              Swal.fire({
                title: "Error",
                html: "Error Submitting Order",
                icon: "error",
                confirmButtonText: "Ok",
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: () => {
                  // location.reload();
                },
              });
            }

            props.setloading(false);
          });
        return bol;
      }
    }
  };

  const ifBankSelected = () => {
    if (customeraccount != "new") {
      props.setloading(true);
      props
        .submit()
        .then((result) => {
          const chargedAmount = result.amountcharged ?? props.amountcharged;

          chargefromCreditBalance(
            chargedAmount,
            balance,
            payFromBalance,
            result.data.order_hash,
            props.tabValue,
          )
            .then((response) => {
              chargefromaccount(
                customeraccount,
                response.data.remaining_cart_amount,
                0,
                result.data.order_hash,
              )
                .then((res) => {
                  if (res.status == "success") {
                    if (enableAutopay != data?.detail?.auto_pay) {
                      UpdateCustomerInformation({
                        auto_pay: enableAutopay ? 1 : 0,
                      }).then((res) => {});
                    }
                    onetimeinvoice(
                      result.planactivation ? result.planactivation : 0,
                      result.data.order_hash,
                      props.numberchange && props.numberchange,
                      props.onetimeinvoice && props.onetimeinvoice,
                      props.tabValue,
                    ).then((response) => {
                      if (response.status === "success") {
                        props.setloading(false);
                        window.history.replaceState(
                          null,
                          "New Page Title",
                          window.location.pathname,
                        );
                        localStorage.removeItem("orderhash");
                        Swal.fire({
                          title: "Order received successfully",
                          html: `<h4>Your order no : ${
                            response.data.order_num
                          }</h4><br> ${
                            response.data.invoice_in_background
                              ? `<h3>
                                <b>Your invoice is generating and will be sent to your
                                email</b>
                              </h3>
                            `
                              : ""
                          }`,
                          denyButtonText: `Download Invoice`,
                          showDenyButton: !response.data.invoice_in_background,
                          denyButtonColor: "#7066e0",
                          icon: "success",
                          confirmButtonText: "Ok",
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          preDeny: () => {
                            window.open(
                              `${url}invoice/download/1?order_hash=${result.data.order_hash}`,
                              "_blank",
                            );
                            return false;
                          },
                          preConfirm: () => {
                            window.location.reload();
                          },
                        });
                      } else {
                        Swal.fire({
                          title: "Error",
                          html: `Error generating Invoice`,
                          icon: "error",
                          confirmButtonText: "Ok",
                          allowOutsideClick: false,
                          allowEscapeKey: false,

                          preConfirm: () => {
                            location.reload();
                          },
                        });
                        props.setloading(false);
                      }
                    });
                  } else {
                    Swal.fire({
                      title: "Error",
                      html: `Error processing payment`,
                      icon: "error",
                      confirmButtonText: "Ok",
                      allowOutsideClick: false,
                      allowEscapeKey: false,

                      preConfirm: () => {
                        location.reload();
                      },
                    });
                    props.setloading(false);
                    return false;
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    html: `${error}`,
                    icon: "error",
                    confirmButtonText: "Ok",
                    allowOutsideClick: false,
                    allowEscapeKey: false,

                    preConfirm: () => {
                      location.reload();
                    },
                  });
                  props.setloading(false);
                });
            })
            .catch(() => {
              Swal.fire({
                title: "Error",
                html: "Error paying from credit balance",
                icon: "error",
                confirmButtonText: "Ok",
                allowOutsideClick: false,
                allowEscapeKey: false,

                preConfirm: () => {
                  location.reload();
                },
              });
            });
        })
        .catch((error) => {
          if (Array.isArray(error.detail)) {
            Swal.fire({
              title: "Error",
              html: error.detail,
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          } else {
            Swal.fire({
              title: "Error",
              html: "Error Submitting Order",
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          }

          props.setloading(false);
        });
    } else {
      if (
        formObj.account_number.length < 5 ||
        formObj.account_number.length > 17
      ) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Account no. must be between 5 to 17");
        setRedErrorAccount(0);
        return false;
      }
      if (formObj.confirm_account != formObj.account_number) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Confirm account number must match");
        return false;
      }
      if (
        formObj.routing_number.length == 0 ||
        formObj.routing_number.length != 9
      ) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("The routing number must be 9 digits");
        return false;
      }
      if (formObj.billing_address1 == "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing address is required");
        return false;
      }
      if (formObj.billing_city == "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing city is required");
        return false;
      }
      if (formObj.billing_fname == "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing first name is required");
        return false;
      }
      if (formObj.billing_lname == "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing last name is required");
        return false;
      }
      if (formObj.billing_state_id == "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing state is required");
        return false;
      }
      if (formObj.billing_fname === "") {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Billing first name is required");
        return false;
      }
      if (!/^(?:(\d{5})(?:[ \-](\d{4}))?)$/i.test(formObj.billing_zip)) {
        setState({ open: true, vertical: "bottom", horizontal: "right" });
        seterror("Zipcode must be 5 digit long");
        return false;
      }
      let bol = false;
      props.setloading(true);

      props
        .submit()
        .then((result) => {
          getcustomerdetail().then((bill) => {
            if (customeraccounts.length == 0 && customercardlist.length == 0) {
              formObj.make_primary = 1;
            }

            const chargedAmount = result.amountcharged ?? props.amountcharged;
            chargefromCreditBalance(
              chargedAmount,
              balance,
              payFromBalance,
              result.data.order_hash,
              props.tabValue,
            )
              .then((response) => {
                addAccountAndCharge(
                  formObj,
                  response.data.remaining_cart_amount,
                  result.data.order_hash,
                )
                  .then((res) => {
                    if (res.status == "success") {
                      if (enableAutopay != data?.detail?.auto_pay) {
                        UpdateCustomerInformation({
                          auto_pay: enableAutopay ? 1 : 0,
                        }).then((res) => {});
                      }
                      onetimeinvoice(
                        result.planactivation ? result.planactivation : 0,
                        result.data.order_hash,
                        props.numberchange && props.numberchange,
                        props.onetimeinvoice && props.onetimeinvoice,
                        props.tabValue,
                      ).then((response) => {
                        if (response.status === "success") {
                          window.history.replaceState(
                            null,
                            "New Page Title",
                            window.location.pathname,
                          );
                          localStorage.removeItem("orderhash");
                          Swal.fire({
                            title: "Order received successfully",
                            html: `<h4>Your order no : ${
                              response.data.order_num
                            }</h4><br> ${
                              response.data.invoice_in_background
                                ? `<h3>
                                <b>Your invoice is generating and will be sent to your
                                email</b>
                              </h3>
                            `
                                : ""
                            }`,
                            denyButtonText: `Download Invoice`,
                            showDenyButton:
                              !response.data.invoice_in_background,
                            denyButtonColor: "#7066e0",
                            icon: "success",
                            confirmButtonText: "Ok",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            preDeny: () => {
                              window.open(
                                `${url}invoice/download/1?order_hash=${result.data.order_hash}`,
                                "_blank",
                              );
                              return false; // Prevent denied
                            },
                            preConfirm: () => {
                              location.reload();
                            },
                          });
                          props.setloading(false);
                          bol = true;
                        } else {
                          Swal.fire({
                            title: "Error",
                            html: `Error generating Invoice`,
                            icon: "error",
                            confirmButtonText: "Ok",
                            allowOutsideClick: false,
                            allowEscapeKey: false,

                            preConfirm: () => {
                              location.reload();
                            },
                          });
                          props.setloading(false);
                          bol = true;
                        }
                      });
                    } else {
                      if (res.message) {
                        Swal.fire({
                          title: "Error",
                          html: JSON.stringify(res.message),
                          icon: "error",
                        });
                      } else {
                        Swal.fire({
                          title: "Error",
                          html: `Error Adding Account`,
                          icon: "error",
                        });
                      }
                      props.setloading(false);
                      bol = true;
                    }
                  })
                  .catch((error) => {
                    props.setloading(false);
                    Swal.fire({
                      title: "Error",
                      html: `Error Adding Account`,
                      icon: "error",
                    });
                  });
              })
              .catch(() => {
                Swal.fire({
                  title: "Error",
                  html: "Error paying from credit balance",
                  icon: "error",
                  confirmButtonText: "Ok",
                  allowOutsideClick: false,
                  allowEscapeKey: false,

                  preConfirm: () => {
                    location.reload();
                  },
                });
              });
          });
        })
        .catch((error) => {
          if (Array.isArray(error.detail)) {
            Swal.fire({
              title: "Error",
              html: error.detail,
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          } else {
            Swal.fire({
              title: "Error",
              html: "Error Submitting Order",
              icon: "error",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              allowEscapeKey: false,

              preConfirm: () => {
                // location.reload();
              },
            });
          }

          props.setloading(false);
        });
      return bol;
    }
  };

  const handleApiCall = (hash) => {
    const downloadurl = `${url}invoice/download/1?order_hash=${hash}`;

    const patiencePopupTimeout = setTimeout(() => {
      dispatch(updateloader("Downloading CSV"));
    }, 6000);

    axios
      .get(downloadurl, {
        responseType: "arraybuffer", // Required to read response as binary data
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setProgress(percentCompleted);
        },
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = downloadUrl;
        a.download = "Invoice"; // Replace with the desired file name
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      })
      .finally(() => {
        dispatch(updateloader(""));
        clearTimeout(patiencePopupTimeout);
      });

    // Process the response or update your app's state
  };

  const [redErrorAccount, setRedErrorAccount] = useState("");
  const [servermsg, setservermsg] = useState("");
  const [rederror, setrederror] = useState("");
  const [error, seterror] = useState("");
  const [customercards, setcustomercards] = useState();
  const [loading, setloading] = useState(false);
  const [cardholdername, setcardholdername] = useState("");
  const [cardnumber, setcardnumber] = useState("new");
  const [cvv, setcvv] = useState("");
  const [open2, setopen2] = useState(false);
  const [mmyy, setmmyy] = useState("");
  const [style, setstyle] = useState({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  });
  const [values, setValues] = React.useState({
    textmask: "",
    numberformat: "0000 0000 0000 0000 000",
    mmyy: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleerror = () => {
    setrederror((pre) => {
      if (pre != 9) {
        return 9;
      }
    });
  };

  const [customercardlist, setcustomercardlist] = useState([]);
  const { data } = useSelector((state) => {
    return state.user;
  });
  const companyDetail = useSelector(selectCompanyDetail);
  const hasBankAccountProcessor = Boolean(
    companyDetail?.has_bank_account_processor,
  );

  const [enableAutopay, setenableAutopay] = useState(data?.detail?.auto_pay);
  const [payFromBalance, setPayFromBalance] = useState(false);
  const [customeraccounts, setcustomeraccounts] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setenableAutopay(data?.detail?.auto_pay);
  }, [data]);

  useLayoutEffect(() => {
    const promises = [];

    const cardpromise = getcustomercards().then((result) => {
      if (result.length > 0) {
        setcustomercardlist(result);
        return result;
      }
    });

    getCreditBalance().then((response) => {
      setBalance(response.balance);
    });

    promises.push(cardpromise);

    const accountpromise = getcustomeraccounts().then((result) => {
      if (result.status == "success") {
        setcustomeraccounts(result.data);
        return result.data;
      }
    });

    promises.push(accountpromise);

    Promise.all(promises).then((result) => {
      setfuseloading(false);

      if (!hasBankAccountProcessor) {
        setTabValue(0);
      } else if (result[0]?.length == 0 && result[1]?.length == 0) {
        setTabValue(0);
      } else if (result[0]?.length == 0) {
        setTabValue(1);
      } else if (result[1]?.length === 0) {
        setTabValue(0);
      } else {
        setTabValue(result[0].some((obj) => obj.is_primary) ? 0 : 1);
      }
    });
  }, [hasBankAccountProcessor, setTabValue]);

  useEffect(() => {
    getdefaultcard();
  }, [customercardlist]);

  useEffect(() => {
    if (!hasBankAccountProcessor && tabValue === 1) {
      setTabValue(0);
    }
  }, [hasBankAccountProcessor, setTabValue, tabValue]);

  const getdefaultcard = () => {
    if (customercardlist.length > 0) {
      if (customercardlist.filter((obj) => obj.default).length > 0)
        setcardnumber(customercardlist.filter((obj) => obj.default)[0].id);
      else setcardnumber(customercardlist[0].id);

      setloading(false);
    } else {
      setcardnumber("new");
      setloading(true);
    }
    if (!hasBankAccountProcessor) {
      setTabValue(0);
      return;
    }

    setTabValue(customercardlist.some((obj) => obj.is_primary) ? 0 : 1);
  };

  // const [tabValue, setTabValue] = useState(0);
  const [customeraccount, setcustomeraccount] = useState("new");
  const [fuseloading, setfuseloading] = useState(true);
  const dispatch = useDispatch();
  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  const [formObj, setformObj] = useState({
    routing_number: "",
    account_number: "",
    confirm_account: "",
    name_on_account: "",
    nick_name: "test",
    make_primary: 0,
    billing_fname: "",
    billing_lname: "",
    billing_address1: "",
    billing_city: "",
    billing_zip: "",
    billing_state_id: "",
  });

  return (
    <>
      <Paper className="relative flex flex-col flex-auto p-24  pb-12 rounded-2xl shadow overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Billing Details
            </Typography>

            <Typography className="text-green-600 font-medium text-sm">
              Payment{" "}
            </Typography>
          </div>

          <div className="-mt-8" />
        </div>
        {!fuseloading ? (
          <>
            <Tabs
              value={props.tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons={false}
              className="w-full  py-10 mb-5 -mx-4 min-h-40"
              classes={{
                indicator: "flex justify-center bg-transparent w-full h-full",
              }}
              TabIndicatorProps={{
                children: (
                  <Box
                    sx={{ bgcolor: "text.disabled" }}
                    className="w-full h-full rounded-full opacity-20"
                  />
                ),
              }}
            >
              <Tab
                className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                disableRipple
                label="Credit"
              />
              {hasBankAccountProcessor && (
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  label="Bank"
                />
              )}
            </Tabs>
            {props.tabValue === 0 && (
              <>
                {" "}
                <div className="flex items-center">
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-error-radios"
                      name="quiz"
                      value={cardnumber}
                      onChange={(e) => setcardnumber(e.target.value)}
                      id="selectedcard"
                    >
                      {customercardlist.length > 0 &&
                        customercardlist.map((obj) => {
                          return (
                            <FormControlLabel
                              onChange={() => {
                                setcardnumber(obj.id);
                                setloading(false);
                              }}
                              value={obj.id}
                              control={<Radio />}
                              label={obj.info}
                            />
                          );
                        })}
                      <FormControlLabel
                        onChange={() => setloading(true)}
                        value="new"
                        control={<Radio />}
                        label="Add New Card"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                {loading && (
                  <>
                    <Typography className="mt-8 font-medium text-3xl leading-none">
                      <TextField
                        error={rederror === 0}
                        fullWidth
                        id="outlined-required"
                        label="Cardholder Name"
                        value={cardholdername}
                        onChange={(e) => {
                          setcardholdername(e.target.value), handleerror();
                        }}
                      />
                    </Typography>

                    <Typography className="mt-8 font-medium text-3xl leading-none">
                      <TextField
                        fullWidth
                        error={rederror === 1}
                        InputProps={{
                          inputComponent: TextMaskCustom,
                        }}
                        name="textmask"
                        placeholder="0000 0000 0000 0000"
                        value={values.textmask}
                        onChange={(e) => {
                          handleChange(e), handleerror();
                        }}
                        id="outlined-required"
                        label="Card Number"
                      />
                    </Typography>

                    <div className="flex gap-6">
                      <Typography className="mt-8 font-medium text-3xl leading-none">
                        <TextField
                          error={rederror === 2}
                          maxlength="3"
                          value={cvv}
                          onChange={(e) => {
                            (e.target.value >= 0) &
                              (e.target.value.length < 5) &&
                              setcvv(e.target.value),
                              handleerror();
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <FuseSvgIcon
                                  className="text-48"
                                  size={24}
                                  color="action"
                                >
                                  material-outline:credit_card
                                </FuseSvgIcon>
                              </InputAdornment>
                            ),
                          }}
                          id="outlined-required"
                          label="CVV"
                        />
                      </Typography>
                      <Typography className="mt-8 font-medium text-3xl leading-none">
                        <TextField
                          error={rederror === 3}
                          InputProps={{
                            inputComponent: MMYY,
                          }}
                          id="outlined-required"
                          label="MM/YY"
                          name="mmyy"
                          value={values.mmyy}
                          onChange={(e) => {
                            handleChange(e), handleerror();
                          }}
                        />
                      </Typography>
                    </div>
                  </>
                )}
              </>
            )}
            {hasBankAccountProcessor && props.tabValue === 1 && (
              <Banksection
                redErrorAccount={redErrorAccount}
                formObj={formObj}
                setformObj={setformObj}
                customeraccount={customeraccount}
                setcustomeraccount={setcustomeraccount}
                customeraccounts={customeraccounts}
              />
            )}
          </>
        ) : (
          <FuseLoading />
        )}

        {balance > 0 && (
          <div className="mt-[10px]">
            {" "}
            <FormControlLabel
              control={
                <Checkbox
                  checked={payFromBalance}
                  onChange={() => setPayFromBalance(!payFromBalance)}
                />
              }
              label={
                <>
                  Use Your Credit Balance{" "}
                  <strong>${formatNumber(balance)}</strong>
                </>
              }
            />
          </div>
        )}

        <div className="">
          {" "}
          <FormControlLabel
            control={
              <Checkbox
                checked={enableAutopay}
                onChange={() => setenableAutopay(!enableAutopay)}
              />
            }
            label="Enable Autopay"
          />
        </div>
        <Typography>
          Click{" "}
          <a className="cursor-pointer" onClick={() => window.open("/terms")}>
            here
          </a>{" "}
          to read the terms of service.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={props.agreement}
              onChange={() => props.setagreement(!props.agreement)}
            />
          }
          label="I have read and accept the terms of service."
        />
        <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24" />

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="I love snacks"
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>

      <Modal
        open={open2}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {servermsg}
          </Typography>
        </Box>
      </Modal>
    </>
  );
});

export default memo(PaymentModule);
