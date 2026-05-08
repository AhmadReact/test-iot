import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import ProductsTableHead from "../../pages/ProductsTableHead";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import _ from "@lodash";

const Numberchangedetail = (props) => {
  console.log("props.detail", props.detail);
  const [addon, setaddon] = useState([]);

  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: "desc",
    id: null,
  });
  function handleSelectAllClick(event) {
    // if (event.target.checked) {
    //   setchecked(
    //     checked.map((obj) => {
    //       return 1;
    //     })
    //   );
    // } else {
    //   setchecked(
    //     checked.map((obj) => {
    //       return 0;
    //     })
    //   );
    // }
    if (event.target.checked) {
      setSelected(data.map((n, id) => id));
      return;
    }
    setSelected([]);
    // if (event.target.checked) {
    //   setSelected(data.map((n) => n.id));
    //   return;
    // }
  }
  function handleDeselect() {
    setSelected([]);
  }
  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);
  const [data, setData] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedno, setselectedno] = useState([]);
  const [rederror, setrederror] = useState(0);
  const [formstep, setformstep] = useState(0);
  const [qty, setqty] = useState("");
  const [addons, setaddons] = useState([]);

  const [numberchangelist, setnumberchangelist] = useState([]);
  function handleChangePage(event, value) {
    setchecked(false);

    setPage(value);
  }
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
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

  const rows = [
    {
      id: "description",
      align: "center",
      disablePadding: false,
      label: "Sim number",
      sort: true,
    },
    {
      id: "new_product",
      align: "center",
      disablePadding: false,
      label: "New Phone no",
      sort: true,
    },
    {
      id: "old_product",
      align: "center",
      disablePadding: false,
      label: "Old Phone no",
      sort: true,
    },

    {
      id: "category",
      align: "center",
      disablePadding: false,
      label: "Status",
      sort: false,
    },
    {
      id: "created_at",
      align: "center",
      disablePadding: false,
      label: "Created At",
      sort: true,
    },
    {
      id: "updated_at",
      align: "center",
      disablePadding: false,
      label: "Completed At",
      sort: true,
    },
  ];
  const setsellecteddata = () => {
    if (checked == false) {
      setselectedno([...selectedno, ...data]);
    } else {
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };
  console.log("detail", props.detail);
  useEffect(() => {
    const numberChangeMap = {};

    props.detail.forEach((obj) => {
      // Group requested + processed records into a single row.
      const key = `${obj.order_num}-${obj.customer_id}-${obj.old_product}`;

      if (!numberChangeMap[key]) {
        numberChangeMap[key] = { ...obj, updated_at: "" };
      }

      if (obj.category === "Number Change Requested") {
        numberChangeMap[key].created_at =
          obj.created_at || numberChangeMap[key].created_at;
      }

      if (obj.category === "Number Change Processed") {
        numberChangeMap[key].updated_at = obj.updated_at || obj.created_at;
        numberChangeMap[key].new_product =
          obj.new_product || numberChangeMap[key].new_product;
        numberChangeMap[key].category = obj.category;
      }
    });

    setData(Object.values(numberChangeMap));
  }, [props.detail]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    if (hh < 10) hh = `0${hh}`;
    if (min < 10) min = `0${min}`;
    if (ss < 10) ss = `0${ss}`;

    return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
  };

  const exportcsv = () => {
    const json = data.map((obj) => {
      return {
        Sim_Number: obj.description ? `'${obj.description}` : "",
        New_Phone_No: obj.new_product,
        Old_Phone_No: obj.old_product,
        Status: obj.category,
        Created_At: formatDate(obj.created_at),
        Updated_At: formatDate(obj.updated_at),
      };
    });
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
      `Numberchange-${props.detail[0].order_num}-${formattedToday}.csv`,
    );
    document.body.appendChild(link); // Required for FF

    link.click();
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
                <FuseSvgIcon size={20}>
                  heroicons-outline:arrow-sm-left
                </FuseSvgIcon>
                <span className="flex mx-4 font-medium">Back</span>
              </Typography>
            </motion.div>
            <motion.div
              className="hidden sm:flex md:justify-between"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-3xl font-semibold tracking-tight leading-8">
                Number Change Detail
              </Typography>
              <Button
                className="md:relative md:left-16"
                // component={Link}
                to="/apps/e-commerce/products/new"
                variant="contained"
                color="secondary"
                onClick={exportcsv}
                disabled={data.length === 0}
              >
                <FuseSvgIcon className="text-48" size={24} color="white">
                  heroicons-outline:external-link
                </FuseSvgIcon>
              </Button>
            </motion.div>
            <Typography
              className="font-medium tracking-tight"
              color="text.secondary"
            >
              Order Number {props.detail[0].order_num}
            </Typography>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12" />
        </div>
      </div>

      <div
        className="w-full flex flex-col  p-24 pt-[11px] "
        style={{ margin: "30px 0px 0px" }}
      >
        <div className="grow overflow-auto max-h-[calc(100vh-280px)]">
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
              selectall={selectall}
              checked={checked}
              setchecked={setchecked}
              rows={rows}
              disabledcheck={1}
            />

            <TableBody style={{ backgroundColor: "#fff" }}>
              {data.length == 0 && (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: "center" }}>
                    {loading2 ? (
                      <Box sx={{ width: "100%" }}>
                        <LinearProgress color="secondary" />
                      </Box>
                    ) : (
                      <>No data found</>
                    )}
                  </TableCell>
                </TableRow>
              )}
              {_.orderBy(
                data,
                [
                  (o) => {
                    switch (order.id) {
                      case "description": {
                        return o.description;
                      }
                      case "new_product": {
                        return o.new_product;
                      }
                      case "old_product": {
                        return o.old_product;
                      }
                      case "created_at": {
                        return o.created_at
                          ? new Date(o.created_at).getTime()
                          : 0;
                      }
                      case "updated_at": {
                        return o.updated_at
                          ? new Date(o.updated_at).getTime()
                          : 0;
                      }
                      default: {
                        return o;
                      }
                    }
                  },
                ],
                [order.direction],
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((obj, j) => {
                  const isiamSelected = selected.indexOf(j) !== -1;
                  return (
                    <>
                      <TableRow
                        className="h-[20px]  text-sm cursor-pointer"
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={j}
                        selected={isiamSelected}
                      >
                        <TableCell
                          className="md:p-16  md:text-center  md:text-sm"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {" "}
                          <div className="flex justify-center gap-x-3 items-center">
                            {obj.description}
                          </div>
                        </TableCell>
                        <TableCell
                          className="md:p-16  md:text-center  md:text-sm"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {" "}
                          <div className="flex justify-center gap-x-3 items-center">
                            {obj.new_product}
                          </div>
                        </TableCell>
                        <TableCell
                          className="md:p-16  md:text-center  md:text-sm"
                          component="th"
                          scope="row"
                          style={{ minWidth: 130 }}
                        >
                          <span>{obj.old_product}</span>
                        </TableCell>

                        <TableCell
                          className="md:p-16 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {" "}
                          {obj.category}
                        </TableCell>
                        <TableCell
                          className="md:p-16 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {formatDate(obj.created_at)}
                        </TableCell>
                        <TableCell
                          className="md:p-16 md:text-sm md:text-center"
                          component="th"
                          scope="row"
                          align="right"
                        >
                          {formatDate(obj.updated_at)}
                        </TableCell>
                      </TableRow>
                      {/* <TableRow tabIndex={-1}
                          key={j}
                          selected={isiamSelected}
                          onClick={(event) => handleClick(j)}
                         
                          style={{boxShadow: "rgb(153 171 187 / 50%) 3px 3px 6px 0px inset, rgb(153 171 187 / 25%) -3px -3px 6px 1px inset"}}
                          >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open==obj.id} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
       
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                    <TableRow key={1}>
                      <TableCell component="th" scope="row">
                      02/14/23
                      </TableCell>
                      <TableCell>512</TableCell>
                      <TableCell align="right">$100</TableCell>
                      <TableCell align="right">
                    $120
                      </TableCell>
                    </TableRow>
              
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    
     */}
                    </>
                  );
                })}
            </TableBody>
          </Table>

          <TablePagination
            className="shrink-0 border-t-1"
            component="div"
            count={data.length ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
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
      </div>
    </>
  );
};

export default Numberchangedetail;
