import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { LinearProgress } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import ProductsTableHead from '../../pages/ProductsTableHead';
import { useFetchOrderHistoryQuery } from '../../services/Apis';

import FuseScrollbars from '@fuse/core/FuseScrollbars';

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { order } = props;
  const [open, setOpen] = React.useState(false);

  const OrderAddon = ({ orderGroupAddon }) => {
    let addonName;

    if (orderGroupAddon.length > 0) {
      const orderAddon = orderGroupAddon.map((addon) => addon.addon);
      addonName = orderAddon.map((addon) => addon.name).join(',');
    } else {
      addonName = 'NA';
    }
    return addonName;
  };
  const ShippingInformation = (orderGroup) => {
    let shippingDate;
    let trackingNum;
    if (orderGroup && orderGroup.plan && orderGroup.plan.subscription) {
      shippingDate = orderGroup.plan.subscription.shipping_date;
      trackingNum = orderGroup.plan.subscription.tracking_num;
    } else if (orderGroup && orderGroup.device) {
      shippingDate =
        orderGroup.device.customer_standalone_device != null &&
        orderGroup.device.customer_standalone_device.shipping_date;
      trackingNum =
        orderGroup.device.customer_standalone_device != null &&
        orderGroup.device.customer_standalone_device.tracking_num;
    } else if (orderGroup && orderGroup.sim) {
      shippingDate =
        orderGroup.sim.customer_standalone_sim &&
        orderGroup.sim.customer_standalone_sim.shipping_date;
      trackingNum =
        orderGroup.sim.customer_standalone_sim &&
        orderGroup.sim.customer_standalone_sim.tracking_num;
    }

    return [shippingDate, trackingNum];
  };

  const TrackingInformation = (orderGroup) => {
    let shippingDate;
    let trackingNum;
    if (orderGroup && orderGroup.customer_standalone_sim) {
      shippingDate =
        orderGroup.customer_standalone_sim && orderGroup.customer_standalone_sim.shipping_date;
      trackingNum =
        orderGroup.customer_standalone_sim && orderGroup.customer_standalone_sim.tracking_num;
    }

    return [shippingDate, trackingNum];
  };

  return (
    <>
      <TableRow className="h-[28px] text-sm cursor-pointer " hover role="checkbox">
        <TableCell
          className="md:p-0 md:text-sm md:text-center"
          component="th"
          scope="row"
          align="right"
        >
          {order.order_num}
        </TableCell>
        <TableCell
          className="md:p-0 md:text-sm md:text-center"
          component="th"
          scope="row"
          align="right"
        >
          {order.date_processed}
        </TableCell>
        <TableCell
          className="md:p-0 md:text-sm md:text-center"
          component="th"
          scope="row"
          align="right"
        >
          ${order.invoice.subtotal.toFixed(2)}
        </TableCell>
        <TableCell
          className="md:p-0 md:text-sm md:text-center"
          component="th"
          scope="row"
          align="right"
        >
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, border: '1px solid black' }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Shipping Date</TableCell>
                    <TableCell>Tracking Number</TableCell>
                    <TableCell>Device Name</TableCell>
                    <TableCell>Plans</TableCell>
                    <TableCell>SIMs</TableCell>
                    <TableCell>Add-ons</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order &&
                    order.all_order_group &&
                    order.all_order_group.map((historyRow) => (
                      <TableRow key={historyRow.id}>
                        <TableCell component="th" scope="row">
                          {TrackingInformation(order)[0] ? TrackingInformation(order)[0] : 'NA'}
                        </TableCell>
                        <TableCell>{TrackingInformation(order)[1] || 'NA'} </TableCell>
                        <TableCell>
                          {historyRow.device && historyRow.device.name
                            ? historyRow.device.name
                            : 'NA'}
                        </TableCell>
                        <TableCell>
                          {historyRow.plan && historyRow.plan.name ? historyRow.plan.name : 'NA'}
                        </TableCell>
                        <TableCell>
                          {historyRow.sim && historyRow.sim.name ? historyRow.sim.name : 'NA'}
                        </TableCell>

                        <TableCell>
                          {OrderAddon({
                            orderGroupAddon: historyRow.order_group_addon || [],
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  {
    id: 'orderno',
    align: 'center',
    disablePadding: false,
    label: 'Order number',
    sort: true,
  },
  {
    id: 'date',
    align: 'center',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'amount',
    align: 'center',
    disablePadding: false,
    label: 'Amount',
    sort: true,
  },
  {
    id: 'detail',
    align: 'center',
    disablePadding: false,
    label: 'Detail',
    sort: false,
  },
];
export default function CollapsibleTable({ customer }) {
  function handleChangePage(event, value) {
    setchecked(false);

    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

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

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
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
      // var filtered = selectedno.filter(function(el) { if(data.data.some(x=>x.id!=el.id)) return el });

      setselectedno([]);
    }
  };

  function handleCheck(obj) {
    if (selectedno.some((x) => x.id === obj.id)) {
      const filtered = selectedno.filter(function (el) {
        return el.id != obj.id;
      });
      setselectedno(filtered);
    } else {
      setselectedno([...selectedno, obj]);
    }
  }
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState({
    direction: 'desc',
    id: null,
  });

  const [selectall, setselectall] = useState(false);
  const [checked, setchecked] = useState(false);

  const [loading2, setloading2] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedno, setselectedno] = useState([]);
  // const { isLoading, error, data } = useQuery(
  //   "repoData",
  //   () =>
  //     getBillinghistory().then((result) => {
  //      return result;
  //     }),
  //   { staleTime: 0 }
  // );
  const { user } = useSelector((state) => {
    return state;
  });

  const {
    data: fetchOrderHistory,
    isFetching,
    isLoading,
  } = useFetchOrderHistoryQuery(
    {
      page: page + 1,
      perpage: rowsPerPage,
      hash: user?.data?.detail?.hash,
    },
    {
      enabled: !!user?.data?.detail?.hash, // Only run query when hash is available
    }
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <FuseScrollbars className="grow overflow-x-auto">
      <Table stickyHeader className="min-w-xl" aria-label="collapsible table">
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
        <TableBody style={{ backgroundColor: '#fff' }}>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress color="secondary" />
                </Box>
              </TableCell>
            </TableRow>
          )}
          {fetchOrderHistory && fetchOrderHistory?.data.length == 0 && (
            <TableRow>
              <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                No data found
              </TableCell>
            </TableRow>
          )}

          {fetchOrderHistory &&
            fetchOrderHistory?.data?.length > 0 &&
            _.orderBy(
              fetchOrderHistory.data,
              [
                (o) => {
                  switch (order.id) {
                    case 'orderno': {
                      return o.order_num;
                    }
                    case 'date': {
                      return o.date_processed;
                    }
                    case 'amount': {
                      return o.invoice.subtotal;
                    }
                    default: {
                      return o.order_num;
                    }
                  }
                },
              ],
              [order.direction]
            ).map((order) =>
              order?.invoice?.hasOwnProperty('subtotal') && order?.invoice?.type != 1 ? (
                <Row key={order.id} order={order} />
              ) : null
            )}
        </TableBody>
      </Table>
      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={fetchOrderHistory?.total ? fetchOrderHistory.total : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[50, 100, 300]}
      />
      {isFetching && (
        <div className="text-blue-400 flex justify-end mr-[20px] relative bottom-[15px] italic">
          Loading...
        </div>
      )}
    </FuseScrollbars>
  );
}
