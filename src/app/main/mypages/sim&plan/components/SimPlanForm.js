import { LoadingButton } from "@mui/lab";
import { Button, MenuItem, TextField, Typography, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  useFetchPlansQuery,
  useFetchSimsQuery,
} from "src/app/main/services/Apis";
import secureLocalStorage from "react-secure-storage";
import {
  getorderdetail,
  getPendingOrderHash,
  submitOrder,
  validatezipcodeapi,
} from "src/app/main/services/services";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";

import checkSignin from "src/app/main/customHook.js/checkSignin";

import CheckOutCombine from "./CheckOutCombine";

import FuseLoading from "@fuse/core/FuseLoading";
import OrderSummaryForCombined from "app/shared-components/OrderSummaryForCombined";

const SimPlanForm = () => {
  const [formObj, setFormObj] = useState({
    qty: 0,
    sim: 0,
    plan: "",
  });
  const user = JSON.parse(secureLocalStorage.getItem("user_info"));
  const [refresh, setRefresh] = useState(0);
  const [orderHash, setOrderHash] = useState();
  const [loading, setLoading] = useState(false);
  const [itemsArray, setitemsArray] = useState({ summary: [] });
  const [tabValue, setTabValue] = useState(0);
  const { data, isFetching } = useFetchSimsQuery({ customer_id: user?.id });
  const { data: plans, isFetching: isFetchingPlans } = useFetchPlansQuery(
    {
      sim_id: formObj?.sim?.id,
      customer_id: user?.id,
    },
    {
      skip: !formObj?.sim?.id,
    },
  );
  const [loader, setloader] = useState(true);
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [formStep, setFormStep] = useState(0);
  const [isLock, setIsLock] = useState(false);
  const [zipcode, setzipcode] = useState("");
  const [rederror, setrederror] = useState(0);
  const [errortext, setErrorText] = useState("");
  const [bulkZipCodes, setBulkZipCodes] = useState([]);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const csvInputRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormObj((prev) => ({ ...prev, [name]: value }));
  };
  checkSignin();
  const handleSubmit = () => {
    setLoading("submitOrder");
    submitOrder({
      customer_id: user?.id,
      order_hash: orderHash,
      zip_code: zipcode,
      csv_file: csvContent,
      order_items: Array(parseInt(formObj.qty)).fill({
        sim_id: formObj.sim.id,
        plan_id: formObj.plan.id,
      }),
    })
      .then((result) => {
        if (result && result.status === "success") {
          setRefresh((prev) => prev + 1);
        } else {
          const extraInfo =
            result?.order_items_count !== undefined &&
            result?.csv_rows_count !== undefined
              ? `\nOrder items: ${result.order_items_count}, CSV rows: ${result.csv_rows_count}`
              : "";

          Swal.fire({
            icon: "error",
            title: result?.message || "Error placing order",
            text: `${result?.details || ""}${extraInfo}`,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const populateArray = (data) => {
    const plans = data;
    plans.summary = Object.entries(data.summary.plan_and_sims).map((obj) => {
      return {
        plan_id: obj[0].split("_")[1],
        // sim_id: obj[1],
        plan_name: obj[1].plan,
        // sim_name: obj[1].sim,
        sim_id: obj[0].split("_")[0],
        sim_name: obj[1].sim,
        type:
          data.order_groups
            .filter((x) => x.plan_id == obj[0].split("_")[1])
            .map((x) => x.sim_num)[0] == null
            ? "standard_recurring_plan"
            : "standard_subscription",
        price: obj[1].combined_prices.reduce((t, x) => t + parseFloat(x), 0),
        qty: obj[1].quantity,
        total: obj[1].combined_prices.reduce((t, x) => t + parseFloat(x), 0),
        plan_prices: obj[1].plan_prices.reduce((t, x) => t + parseFloat(x), 0),
        sim_prices: obj[1].sim_prices.reduce((t, x) => t + parseFloat(x), 0),
        order_group_ids: data.order_groups
          .filter((x) => x.plan_id == obj[0].split("_")[1])
          .map((x) => x.id),

        lines: data.order_groups
          .filter((x) => x.plan_id == obj[0].split("_")[1])
          .map((x) => {
            return {
              sim: x.sim_num,
              zip: x.requested_zip,
              port: x.porting_number,
              carrier_id: x.plan.carrier_id,
              order_group_id: x.id,
              ...x,
            };
          }),
      };
    });
    plans.portNumbers = data.order_groups
      .filter((x) => x.porting_number)
      .map((obj) => {
        return { sim: obj.sim_num, port: obj.porting_number };
      });
    return plans;
  };

  const wrapper = () => {
    setloader(true);
    if (searchParams.get("order_hash")) {
      setMessage("Loading your cart...");
      getorderdetail(searchParams.get("order_hash"), tabValue).then(
        (result) => {
          setloader(false);
          if (
            result.status === "success" &&
            result.data.status === 0 &&
            result.data.type === 1
          ) {
            setitemsArray(populateArray(result.data));
            setIsLock(result.data.is_locked);
            setOrderHash(searchParams.get("order_hash"));
            refresh == 0 &&
              result.data.order_groups.length > 0 &&
              setFormStep(formStep + 1);

            // setFormstep(1);
          } else if (result.data.type != 1) {
            Swal.fire({
              icon: "info",
              title: "Error",
              text: "Invalid order type",
            });

            window.history.replaceState(
              null,
              "New Page Title",
              window.location.pathname,
            );
          } else if (result.data.status === 1) {
            Swal.fire({
              icon: "info",
              title: "This order has been placed",
              text: "Order Already Placed",
            });

            window.history.replaceState(
              null,
              "New Page Title",
              window.location.pathname,
            );
          } else {
            Swal.fire({
              icon: "info",
              title: "Invalid order",
              text: "Not a valid order hash",
            });
            window.history.replaceState(
              null,
              "New Page Title",
              window.location.pathname,
            );
          }
        },
      );
    } else {
      getPendingOrderHash(1).then((obj) => {
        if (obj?.data?.hash) {
          setMessage("Loading your cart...");
          getorderdetail(obj.data.hash, tabValue).then((result) => {
            if (
              result.status === "success" &&
              result.data.status === 0 &&
              result.data.type === 1
            ) {
              setitemsArray(populateArray(result.data));
              setOrderHash(obj.data.hash);
              setIsLock(result.data.is_locked);
              window.location.href.includes("placeorder") &&
                window.history.replaceState(
                  null,
                  "New Page Title",
                  `${window.location.pathname}?order_hash=${obj.data.hash}`,
                );

              refresh == 0 &&
                result.data.order_groups.length > 0 &&
                setFormStep(formStep + 1);
              // window.location.search = '?orderhash='+JSON.parse(secureLocalStorage.getItem("user_info")).order.hash;
              // setFormstep(1);
            } else if (result.data.type != 1) {
              Swal.fire({
                icon: "info",
                title: "Error",
                text: "Invalid order type",
              });

              window.history.replaceState(
                null,
                "New Page Title",
                window.location.pathname,
              );
            } else if (result.data.status === 1) {
              Swal.fire({
                icon: "info",
                title: "This order has been placed",
                text: "Order Already Placed",
              });

              window.history.replaceState(
                null,
                "New Page Title",
                window.location.pathname,
              );
            } else {
              Swal.fire({
                icon: "info",
                title: "Invalid order",
                text: "Not a valid order hash",
              });
              window.history.replaceState(
                null,
                "New Page Title",
                window.location.pathname,
              );
            }
            setloader(false);
          });
        } else {
          setloader(false);
        }
      });
    }
  };
  useEffect(() => {
    wrapper();
  }, []);

  const updatecart = (hash) => {
    return new Promise((resolve, reject) => {
      const patiencePopupTimeout = setTimeout(() => {
        dispatch(updateloader("loading"));
      }, 6000);

      getorderdetail(hash, tabValue)
        .then((result) => {
          setsimid("");
          setqty("");
          setloading2(false);

          if (result.status === "success" && result.data.status === 0) {
            setitemsArray(populateArray(result.data));
            resolve(result);
          } else if (result.data.status === 1) {
            Swal.fire({
              icon: "info",
              title: "This order has been placed",
              text: "Order Already Placed",
            });

            window.history.replaceState(
              null,
              "New Page Title",
              window.location.pathname,
            );
          } else {
            Swal.fire({
              icon: "info",
              title: "Invalid order",
              text: "Not a valid order hash",
            });
            window.history.replaceState(
              null,
              "New Page Title",
              window.location.pathname,
            );
          }
        })
        .catch(() => {
          Swal.fire({
            icon: "info",
            title: "Invalid order",
            text: "Not a valid order hash",
          });
        })
        .finally(() => {
          dispatch(updateloader(""));
          clearTimeout(patiencePopupTimeout);
        });
    });
  };

  const validatezipcode = (e) => {
    setrederror(1);
    setzipcode(e.target.value);
  };

  const downloadSampleCSV = () => {
    const csvContent = "zip_code\n10128\n10023\n10036\n10031";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_zip_code_file.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Check if file is CSV
    if (!file.name.endsWith(".csv")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a CSV file",
      });
      e.target.value = "";
      return;
    }

    setCsvUploading(true);
    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      try {
        const text = target.result;
        setCsvContent(text);
        const lines = text.split("\n").filter((line) => line.trim() !== "");

        if (lines.length < 2) {
          Swal.fire({
            icon: "error",
            title: "Invalid CSV",
            text: "CSV file must contain at least a header and one data row",
          });
          setCsvUploading(false);
          e.target.value = "";
          return;
        }

        // Check header
        const header = lines[0].trim().toLowerCase();
        if (!header.includes("zip_code")) {
          Swal.fire({
            icon: "error",
            title: "Invalid CSV Format",
            text: "CSV header must contain 'zip_code'. Please download the sample CSV for reference.",
          });
          setCsvUploading(false);
          e.target.value = "";
          return;
        }

        // Extract zip codes (skip header)
        const zipCodes = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            // Handle CSV with comma delimiter
            const values = line.split(",");
            const zipCode = values[0]?.trim();
            if (zipCode) {
              zipCodes.push(zipCode);
            }
          }
        }

        if (zipCodes.length === 0) {
          Swal.fire({
            icon: "error",
            title: "No Zip Codes Found",
            text: "No valid zip codes found in the CSV file",
          });
          setCsvUploading(false);
          e.target.value = "";
          return;
        }

        // Validate zip codes format
        const zipRegex = /^(?:(\d{5})(?:[ \-](\d{4}))?)$/i;
        const invalidZipCodes = zipCodes.filter((zip) => !zipRegex.test(zip));

        if (invalidZipCodes.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Some Invalid Zip Codes",
            text: `Found ${
              invalidZipCodes.length
            } invalid zip code(s): ${invalidZipCodes.join(", ")}`,
          });
        }

        setBulkZipCodes(zipCodes);

        Swal.fire({
          icon: "success",
          title: "CSV Uploaded Successfully",
          text: `Successfully loaded ${zipCodes.length} zip code(s) from CSV`,
        });

        // If carrier requires zip code validation, validate them
        if (
          formObj?.sim?.carrier_id == 5 ||
          formObj?.sim?.carrier_id == 18 ||
          formObj?.sim?.carrier_id == 15
        ) {
          // You can add bulk validation here if needed
          // For now, we'll just store them
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error Processing CSV",
          text: "An error occurred while processing the CSV file",
        });
      } finally {
        setCsvUploading(false);
        if (csvInputRef.current) {
          csvInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "Error Reading File",
        text: "Failed to read the CSV file",
      });
      setCsvUploading(false);
      if (csvInputRef.current) {
        csvInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleClearCSV = () => {
    setCsvContent("");
    setBulkZipCodes([]);
    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }
  };

  useEffect(() => {
    getPendingOrderHash(1).then((response) => {
      if (response.data) {
        getorderdetail(response.data.hash, 1).then((result) => {
          setitemsArray(populateArray(result.data));
          setOrderHash(result.data.hash);

          window.location.href.includes("simsplans") &&
            window.history.replaceState(
              null,
              "New Page Title",
              `${window.location.pathname}?order_hash=${result.data.hash}`,
            );
        });
      }
    });
  }, [refresh]);
  useEffect(() => {
    const zipRegex = /^(?:(\d{5})(?:[ \-](\d{4}))?)$/i;
    const handler = setTimeout(() => {
      if (zipcode == "") {
        setrederror(0);
      } else if (!zipRegex.test(zipcode)) {
        setrederror(1);
        setErrorText("Zip code must be greater than 4 digit");
      } else if (formObj.sim.carrier_id == 6) {
        setrederror(0);
      } else if (
        formObj.sim.carrier_id == 5 ||
        formObj.sim.carrier_id == 18 ||
        formObj.sim.carrier_id == 15
      ) {
        setErrorText("Checking zipcode...");
        validatezipcodeapi(zipcode).then((result) => {
          if (result.status == "success") {
            setrederror(0);
            setErrorText("");
          } else if (result.status == "error") {
            setErrorText("Zip code is invalid");
            setrederror(1);
          }
        });
      }
    }, 2000);

    // Clean up the timeout if the input changes before the delay is reached
    return () => {
      clearTimeout(handler);
    };
  }, [zipcode]);

  if (loader) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading message={message} />
      </div>
    );
  }

  if (formStep == 1)
    return (
      <CheckOutCombine
        setFormstep={setFormStep}
        itemsArray={itemsArray}
        setitemsArray={setitemsArray}
        orderhash={orderHash}
        setrefresh={setRefresh}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
    );

  return (
    <div className="flex flex-col w-full container">
      {/* {loading == "loading" && <Longloading />} */}

      <div className="flex flex-col  sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <motion.div
            className="flex"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-3xl font-semibold tracking-tight leading-8">
              Order SIMs & Plans
            </Typography>
          </motion.div>
        </div>
      </div>

      <div className="flex gap-x-24 p-24  flex-col md:flex-col lg:flex-row sm:flex-col ">
        <div
          className=" h-fit p-24 rounded-2xl  shadow basis-2/3 mb-24 lg:mb-0 flex flex-col gap-x-20 justify-start !mt-[30px]"
          style={{
            backgroundColor: "#fff",
            padding: 15,
            margin: "0px 10px 0px 10px",
            borderRadius: 10,
          }}
        >
          <div className="flex flex-col gap-y-5">
            <TextField
              className="w-full sm:w-1/2 md:w-full"
              required
              label="Quantity"
              helperText="Please select quantity"
              autoFocus
              onChange={handleChange}
              name="qty"
              variant="outlined"
            />
            <TextField
              id="outlined-select-currency"
              select
              label="Sim"
              helperText="Please select your sim"
              className="w-full sm:w-1/2 md:w-full"
              onChange={handleChange}
              name="sim"
              required
            >
              {!isFetching &&
                data.data.map((obj) => {
                  return <MenuItem value={obj}>{obj.name}</MenuItem>;
                })}
            </TextField>
            <TextField
              id="outlined-select-currency"
              select
              label="Plan"
              helperText="Please select your plan"
              className="w-full sm:w-1/2 md:w-full"
              onChange={handleChange}
              name="plan"
              required
            >
              {!isFetchingPlans &&
                plans?.map((obj) => {
                  return <MenuItem value={obj}>{obj?.name}</MenuItem>;
                })}
            </TextField>
            {formObj?.sim?.zip_code_enabled != 0 && (
              <>
                <TextField
                  id="outlined-select-currency"
                  className="w-full sm:w-1/2 md:w-full"
                  label="Zip Code (Optional)"
                  name="Zipcode"
                  error={rederror == 1}
                  helperText={rederror == 1 && errortext}
                  onChange={(e) => {
                    validatezipcode(e);
                  }}
                />
                <Box className="flex flex-col gap-y-2 mt-2">
                  <Box className="flex gap-x-2">
                    <Button
                      variant="outlined"
                      color="primary"
                      component="label"
                      disabled={csvUploading}
                    >
                      {csvUploading ? "Uploading..." : "Bulk Upload CSV"}
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        hidden
                        onChange={handleCSVUpload}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={downloadSampleCSV}
                    >
                      Download Sample CSV
                    </Button>
                    {csvContent && (
                      <Button
                        variant="text"
                        color="error"
                        onClick={handleClearCSV}
                      >
                        Clear CSV
                      </Button>
                    )}
                  </Box>
                  {bulkZipCodes.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {bulkZipCodes.length} zip code(s) loaded from CSV:{" "}
                      {bulkZipCodes.slice(0, 5).join(", ")}
                      {bulkZipCodes.length > 5 &&
                        ` and ${bulkZipCodes.length - 5} more...`}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </div>
          <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 pr-0 p-20 md:pt-20 pb-0 md:pb-0">
            <div className="flex flex-col flex-auto" />
            <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
              <LoadingButton
                loading={loading == "submitOrder"}
                loadingPosition="start"
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={rederror === 1}
              >
                {loading == "submitOrder" ? "Processing.." : "Add item"}
              </LoadingButton>
            </div>
          </div>
        </div>

        <div className="basis-1/3  mt-[30px]">
          {itemsArray?.summary?.length > 0 && (
            <>
              <OrderSummaryForCombined
                itemsArray={itemsArray}
                setrefresh={setRefresh}
                refresh={refresh}
                setitemsArray={setitemsArray}
                isLock={isLock}
              />
            </>
          )}
        </div>
      </div>

      {itemsArray.summary.length > 0 && (
        <div className="flex flex-row sm:flex-row flex-auto sm:items-center min-w-0 p-20  md:pt-20 pb-0 md:pb-0">
          <div className="flex flex-col flex-auto" />
          <div className="flex items-center mb-28 mt-24 sm:mt-0 sm:mx-8 space-x-12">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              onClick={() => {
                setFormStep(1);
              }}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimPlanForm;
