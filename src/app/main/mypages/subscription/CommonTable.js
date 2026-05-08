import { memo, useState } from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Chip, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useDispatch, useSelector } from "react-redux";

import { useFetchSubscriptionQuery } from "../../services/Apis";

import ProductsTableHead from "../../pages/ProductsTableHead";

import { getcustomersubscriptionfresh } from "../../services/services";

import BasicModal from "./Modal";
import LabelEditbtn from "./LabelEditbtn";

import PauseUnpauseVtmo from "./PauseUnpauseVtmo";

import { updateUser } from "app/store/userSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const CommonTable = ({ heading, type }) => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({
    direction: "desc",
    id: null,
  });
  const [searchNumber, setSearchNumber] = useState([]);
  const { user } = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const { data, isFetching, isLoading, refetch } = useFetchSubscriptionQuery({
    hash: user?.data?.detail?.hash,
    per_page: perPage,
    page,
    subscription_search: searchNumber,
    closed_subscription_search: searchNumber,
  });

  if (data?.data?.["standard-recurring-plans"]?.total) {
    dispatch(updateUser({ key: "standard_recurring", value: true }));
  }

  // Filter data based on table type
  const getFilteredData = () => {
    if (!data?.data) return { data: [], total: 0 };

    const allData = data.data["standard-recurring-plans"]?.data || [];

    if (type === "active-standard-recurring-plans") {
      const filtered = allData.filter(
        (obj) => obj.status_formated !== "Subscription Closed",
      );
      return { data: filtered, total: filtered.length };
    }
    if (type === "closed-standard-recurring-plans") {
      const filtered = allData.filter(
        (obj) => obj.status_formated === "Subscription Closed",
      );
      return { data: filtered, total: filtered.length };
    }
    return data.data[type] || { data: [], total: 0 };
  };

  const filteredData = getFilteredData();
  const [checked, setchecked] = useState(false);

  const [selectedno, setselectedno] = useState([]);
  const rows = [
    {
      id: "order",
      align: "center",
      disablePadding: false,
      label: "Sim Number",
      sort: true,
    },
    {
      id: "phoneno",
      align: "center",
      disablePadding: false,
      label: "Phone Number",
      sort: true,
    },
    {
      id: "label",
      align: "center",
      disablePadding: false,
      label: "Label",
      sort: true,
    },
    {
      id: "datausage",
      align: "center",
      disablePadding: false,
      label: "Data Usage",
      sort: true,
    },
    {
      id: "smsusage",
      align: "center",
      disablePadding: false,
      label: "SMS Usage",
      sort: true,
    },
    {
      id: "voiceusage",
      align: "center",
      disablePadding: false,
      label: "Voice Usage",
      sort: true,
    },
    {
      id: "id",
      align: "center",
      disablePadding: false,
      label: "Plan Name",
      sort: true,
    },
    {
      id: "feature",
      align: "center",
      disablePadding: false,
      label: "Feature",
      sort: true,
    },
    {
      id: "month",
      align: "center",
      disablePadding: false,
      label: "Monthly Charge",
      sort: true,
    },

    {
      id: "status",
      align: "center",
      disablePadding: false,
      label: "Status",
      sort: true,
    },
    {
      id: "action",
      align: "center",
      disablePadding: false,
      label: "Action",
      sort: false,
    },
  ];

  if (
    heading === "Active / Pending Lines" ||
    heading === "Active / Pending Standard Recurring Plans"
  ) {
    rows.splice(9, 0, {
      id: "activation_date",
      align: "center",
      disablePadding: false,
      label: "Activation Date",
      sort: true,
    });

    if (heading === "Active / Pending Standard Recurring Plans") {
      rows.splice(0, 2);
      rows.splice(9, 1);
      rows.splice(1, 3);
    }
  } else if (
    heading === "Closed Lines" ||
    heading === "Closed Standard Recurring Plans"
  ) {
    rows.splice(9, 0, {
      id: "close_date",
      align: "center",
      disablePadding: false,
      label: "Close Date",
      sort: true,
    });

    if (heading === "Closed Standard Recurring Plans") {
      rows.splice(0, 2);
      rows.splice(9, 1);
      rows.splice(1, 3);
    }
  }

  function handleChangePage(event, value) {
    setchecked(false);

    setPage(value + 1);
  }

  function handleChangeRowsPerPage(event) {
    setPerPage(event.target.value);
    setPage(1);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n, id) => id));
      return;
    }
    setSelected([]);
  }

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleDeselect() {
    setSelected([]);
  }

  const setsellecteddata = () => {
    if (checked == false) {
      setselectedno([...selectedno, ...data.data]);
    } else {
      setselectedno([]);
    }
  };

  const [searchterm, setsearchterm] = useState("");

  const searchresult = () => {
    if (searchterm !== null && searchterm !== "") {
      const arrayOfLines = searchterm.split("\n");
      setSearchNumber(arrayOfLines);
      setPage(1);
    } else {
      setSearchNumber([]);
    }
  };

  const exportcsv = () => {
    let xdata;
    setLoading(true);
    getcustomersubscriptionfresh().then((result) => {
      const [key, value] = Object.entries(result)[0];
      if (type == "customer-plans") {
        xdata = value.filter(
          (obj) =>
            obj.status_formated != "Subscription Closed" && obj.plan.type != 4,
        );
      }
      if (type == "closed-customer-plans") {
        xdata = value.filter(
          (obj) =>
            obj.status_formated == "Subscription Closed" && obj.plan.type != 4,
        );
      }
      if (type == "active-standard-recurring-plans") {
        xdata = value.filter(
          (obj) =>
            obj.plan.type == 4 && obj.status_formated != "Subscription Closed",
        );
      }
      if (type == "closed-standard-recurring-plans") {
        xdata = value.filter(
          (obj) =>
            obj.plan.type == 4 && obj.status_formated == "Subscription Closed",
        );
      }
      if (type == "standard-recurring-plans") {
        xdata = value.filter((obj) => obj.plan.type == 4);
      }

      const json = xdata.map((obj) => ({
        Plan_Name: obj.plan.name,
        Sim_No:
          obj.sim_card_num === "null" || obj.sim_card_num === ""
            ? null
            : `'${obj.sim_card_num}`,
        Phone_No: obj.phone_number
          ? obj.phone_number.includes("null") || obj.phone_number === ""
            ? null
            : `'${obj.phone_number}`
          : "",
        Label: obj.label || "",
        Monthly_Charge: obj.plan.amount_recurring,
        Status:
          obj.status_formated === "Subscription Closed"
            ? "Closed"
            : obj.status_formated === "active"
            ? "Active"
            : obj.status_formated,
        ...((type === "closed-customer-plans" ||
          type === "closed-standard-recurring-plans") && {
          Close_date: obj.closed_date,
        }),
      }));
      const fields = Object.keys(json[0]);
      const replacer = function (key, value) {
        return value === null ? "" : value;
      };
      let csv = json.map(function (row) {
        return fields
          .map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer);
          })
          .join(",");
      });
      csv.unshift(fields.join(",")); // add header column
      csv = csv.join("\r\n");
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
      if (dd < 10) dd = `0${dd}`;
      if (mm < 10) mm = `0${mm}`;
      const formattedToday = `${dd}/${mm}/${yyyy}`;
      const csvContent = `data:text/csv;charset=utf-8,${csv}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `customer_subscriptions${formattedToday}.csv`,
      );
      document.body.appendChild(link); // Required for FF
      link.click();
      setLoading(false);
    });
  };

  const covertDate = (obj) => {
    return `${obj.slice(0, 10).split("-")[1]}-${
      obj.slice(0, 10).split("-")[2]
    }-${obj.slice(0, 10).split("-")[0]}`;
  };

  if (data?.error) {
    return <div />;
  }
  return (
    <>
      <div className="flex flex-col  justify-between items-end sm:flex-row md:items-end min-w-0  md:px-32 md:py-10">
        <div>
          <div className="flex mt-10 flex-col gap-y-10">
            <div className="flex w-full container">
              <div className="flex flex-col items-start sm:flex-row flex-auto md:items-start min-w-0 md:pb-0 p-24 md:pl-0 md:p-32 ">
                <div className="flex flex-col flex-auto">
                  <motion.div
                    className="flex"
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.3 } }}
                  >
                    <Typography className="text-3xl font-semibold tracking-tight leading-8">
                      {heading}
                    </Typography>{" "}
                  </motion.div>
                  {user?.data?.detail &&
                    user.data.detail.account_suspended == 1 && (
                      <Typography className="text-red-600 font-medium text-lg">
                        Account Suspended
                      </Typography>
                    )}
                </div>
              </div>
            </div>
            <div className="mr-[20px] w-[300px]">
              {heading != "Active / Pending Standard Recurring Plans" &&
                heading != "Closed Standard Recurring Plans" && (
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Search"
                    multiline
                    rows={4}
                    value={searchterm}
                    onChange={(e) => setsearchterm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          sx={{ color: "gray", p: "10px" }}
                          className="relative top-16 left-6"
                          onClick={searchresult}
                          aria-label="directions"
                        >
                          <DirectionsIcon />
                        </IconButton>
                      ),
                    }}
                  />
                )}
              {/* <div className="flex justify-end"> <Button style={{maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px',fontSize:10}}  className="bg-[#4f46e5] text-white mt-10" variant="contained"  size="small" onClick={searchresult} >Search</Button>
</div> */}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=" "
            // component={Link}
            to="/apps/e-commerce/products/new"
            variant="contained"
            color="secondary"
            onClick={exportcsv}
            disabled={filteredData?.data?.length === 0}
          >
            {loading ? (
              <div>Downloading...</div>
            ) : (
              <FuseSvgIcon className="text-48" size={24} color="white">
                heroicons-outline:external-link
              </FuseSvgIcon>
            )}
          </Button>
        </motion.div>
      </div>

      <div
        className="w-full flex flex-col  p-24 pt-[11px] "
        style={{ margin: "10px 0px 0px" }}
      >
        <div className="grow overflow-x-auto">
          <Table
            stickyHeader
            className="min-w-xl"
            aria-labelledby="collapsible table"
          >
            <ProductsTableHead
              selectedProductIds={selected}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              onMenuItemClick={handleDeselect}
              setselecteddata={setsellecteddata}
              checked={checked}
              setchecked={setchecked}
              rows={rows}
              disabledcheck={1}
            />

            <TableBody style={{ backgroundColor: "#fff" }}>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={13} style={{ textAlign: "center" }}>
                    {" "}
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress color="secondary" />
                    </Box>
                  </TableCell>{" "}
                </TableRow>
              ) : filteredData?.data?.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={13} style={{ textAlign: "center" }}>
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                _.orderBy(
                  filteredData?.data,
                  [
                    (o) => {
                      switch (order.id) {
                        case "simnum": {
                          return o.sim_card_num;
                        }
                        case "status": {
                          return o.status_formated;
                        }
                        case "month": {
                          return o.plan.amount_recurring;
                        }
                        case "datausage": {
                          if (o.usage_data) {
                            return o.usage_data ? o.usage_data.data : 0;
                          }
                          if (o.att_two_usage_data) {
                            return o.att_two_usage_data
                              ? o.att_two_usage_data.usage_data
                              : 0;
                          }
                        }
                        case "smsusage": {
                          return o.usage_data ? o.usage_data.sms : 0;
                        }
                        case "voiceusage": {
                          return o.usage_data ? o.usage_data.voice : 0;
                        }
                        case "phoneno": {
                          return o.phone_number;
                        }
                        case "activation_date": {
                          return o.activation_date;
                        }
                        case "close_date": {
                          return o.closed_date;
                        }
                        case "feature": {
                          return o.subscription_addon_not_removed;
                        }
                        default: {
                          return o.order_id;
                        }
                      }
                    },
                  ],
                  [order.direction],
                ).map((obj, j) => {
                  const isiamSelected = selected.indexOf(j) !== -1;
                  return (
                    <>
                      <TableRow
                        className="h-[20px] text-[1.1rem] cursor-pointer"
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={j}
                        selected={isiamSelected}
                      >
                        {heading !=
                          "Active / Pending Standard Recurring Plans" &&
                          heading != "Closed Standard Recurring Plans" && (
                            <TableCell
                              className="md:pl-4 md:text-center  md:text-[1.1rem]"
                              component="th"
                              scope="row"
                            >
                              {obj.sim_card_num}
                            </TableCell>
                          )}

                        {heading !=
                          "Active / Pending Standard Recurring Plans" &&
                          heading != "Closed Standard Recurring Plans" && (
                            <TableCell
                              className="md:p-0 md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="center"
                              style={{ minWidth: 130 }}
                            >
                              <span>{obj.phone_number}</span>
                            </TableCell>
                          )}

                        <TableCell
                          className="md:p-0 md:text-right md:text-[1.1rem]"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {" "}
                          <div className="flex justify-center gap-x-3 items-center">
                            {obj.label == null ? "NA" : obj.label}

                            <LabelEditbtn
                              heading={heading}
                              label={obj.label}
                              id={obj.id}
                              refetch={refetch}
                              data={data}
                            />
                          </div>
                        </TableCell>
                        {heading !=
                          "Active / Pending Standard Recurring Plans" &&
                          heading != "Closed Standard Recurring Plans" && (
                            <>
                              <TableCell
                                className="md:p-0 md:text-[1.1rem] md:text-center"
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {obj?.plan?.carrier?.slug === "ultra" ? (
                                  <span>
                                    {obj.usage_data &&
                                      Math.round(obj.usage_data.data * 100) /
                                        100}
                                  </span>
                                ) : (
                                  <span>
                                    {obj.att_two_usage_data &&
                                      Math.round(
                                        obj.att_two_usage_data.usage_data * 100,
                                      ) / 100}
                                  </span>
                                )}
                              </TableCell>

                              <TableCell
                                className="md:p-0 md:text-[1.1rem] md:text-center"
                                component="th"
                                scope="row"
                                align="center"
                              >
                                <span>
                                  {obj.usage_data && obj.usage_data.sms}
                                </span>
                              </TableCell>
                              <TableCell
                                className="md:p-0 md:text-[1.1rem] md:text-center"
                                component="th"
                                scope="row"
                                align="center"
                              >
                                <span>
                                  {obj.usage_data && obj.usage_data.voice}
                                </span>
                              </TableCell>
                            </>
                          )}
                        <TableCell
                          className="md:p-0 md:text-[1.1rem]"
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {obj?.plan?.name}
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-[1.1rem] md:text-center"
                          component="th"
                          scope="row"
                          align="center"
                        >
                          <span>
                            {obj.subscription_addon_not_removed.length > 0 && (
                              <>
                                {obj.subscription_addon_not_removed.map(
                                  (obj) => {
                                    return (
                                      <p className="text-left">
                                        • {obj.addons.name}
                                      </p>
                                    );
                                  },
                                )}
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell
                          className="md:p-0 md:text-[1.1rem] md:text-center"
                          component="th"
                          scope="row"
                          align="center"
                        >
                          <span>
                            ${obj?.plan?.amount_recurring?.toFixed(2)}
                          </span>
                        </TableCell>
                        {heading === "Active / Pending Lines" ||
                        heading ==
                          "Active / Pending Standard Recurring Plans" ? (
                          <TableCell
                            className="md:p-0 md:text-[1.1rem] md:text-center"
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <span>
                              {obj.activation_date &&
                                covertDate(obj.activation_date)}
                            </span>
                          </TableCell>
                        ) : (
                          <TableCell
                            className="md:p-0 md:text-[1.1rem] md:text-center"
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <span>
                              {obj.closed_date && covertDate(obj.closed_date)}
                            </span>
                          </TableCell>
                        )}
                        <TableCell
                          className="md:p-0 md:text-[1.1rem]"
                          component="th"
                          scope="row"
                          align="center"
                        >
                          <Chip
                            className="font-semibold text-10"
                            label={
                              obj.status_formated === "Subscription Closed"
                                ? "Closed"
                                : obj.status_formated === "active"
                                ? "Active"
                                : obj.status_formated
                            }
                            color={
                              obj.status_formated.includes("for Activation")
                                ? "warning"
                                : obj.status_formated === "active"
                                ? "success"
                                : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        {heading !=
                          "Active / Pending Standard Recurring Plans" &&
                          heading != "Closed Standard Recurring Plans" && (
                            <TableCell
                              className="md:p-0 md:text-[1.1rem]"
                              component="th"
                              scope="row"
                              align="right"
                            >
                              <div className="flex flex-row my-4 mr-5">
                                {(obj.plan.carrier_id == 5 ||
                                  obj.plan.carrier_slug == "vtmo") &&
                                  obj.status_formated === "active" && (
                                    <BasicModal
                                      id={obj.id}
                                      carrier_id={obj.plan.carrier_id}
                                      act_date={obj.activation_date}
                                      active={obj.status_formated === "active"}
                                      sim_card_num={obj.sim_card_num}
                                    />
                                  )}
                                {obj.plan.carrier_slug == "vtmo" &&
                                  obj.status_formated === "active" && (
                                    <PauseUnpauseVtmo
                                      phone_number={obj.phone_number}
                                      msisdn={obj.phone_number}
                                      plan_id={obj.plan.id}
                                      plan_name={obj.plan.name}
                                    />
                                  )}
                                {/* <Button className={open===obj.id?"bg-[#4f46e5] text-white":"bg-[#f6f9fb] "} variant="contained" onClick={open===obj.id?()=>setOpen(false):()=>setOpen(obj.id)}>View</Button> */}
                                {/* <Actionbtn/> */}
                              </div>
                            </TableCell>
                          )}
                      </TableRow>
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>

          <TablePagination
            id="paginationSection"
            className="shrink-0 border-t-1"
            component="div"
            count={filteredData?.total ?? 0}
            rowsPerPage={perPage}
            page={page - 1}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[50, 100, 1000]}
          />
        </div>

        <div className="text-blue-400 flex justify-end mr-[20px] relative bottom-[15px] italic min-h-[20px]">
          {isFetching && " Loading... "}
        </div>
      </div>
    </>
  );
};

CommonTable.defaultProps = {
  data: [],
};

export default memo(CommonTable);
