import Popover from "@mui/material/Popover";
import * as React from "react";
import { useImperativeHandle } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import PortingModal from "./Modal";

const BasicPopover = React.forwardRef((props, ref) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [Ids, setgroupsId] = React.useState();
  const [portingInformation, setPortingInformation] = React.useState([]);
  useImperativeHandle(ref, (e, lines) => ({
    childFunction(e, lines, id, portNumbers) {
      handleClick(e, lines, id, portNumbers);
    },
  }));
  const [data, setData] = React.useState([]);
  const handleClick = (event, lines, id, portNumbers) => {
    setData(lines);
    setgroupsId(id);
    setAnchorEl(event.currentTarget);
    setPortingInformation(portNumbers);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  React.useEffect(() => {}, []);
  return (
    <div>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="min-h-[100px] max-h-[200px] overflow-y-auto">
          <Table
            sx={{ minWidth: 200 }}
            stickyHeader
            size="small"
            aria-label=" sticky table a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell align="center">Lines</TableCell>
                {data.some((x) => x.zip) && (
                  <TableCell align="center">Requested Zip</TableCell>
                )}
                {data.some((x) => x.port) && (
                  <TableCell align="center">Porting no</TableCell>
                )}
                {data.some((x) => x.sim?.port_option_enabled) && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((obj, i) => (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {i + 1}
                  </TableCell>
                  <TableCell align="center">{obj.sim_num}</TableCell>
                  {data.some((x) => x.zip) && (
                    <TableCell align="center">{obj.zip}</TableCell>
                  )}

                  {data.some((x) => x.port) && (
                    <TableCell align="center">{obj.port}</TableCell>
                  )}
                  {!!obj.sim?.port_option_enabled && !obj.zip && (
                    <TableCell>
                      <PortingModal
                        data={obj}
                        Id={Ids[i]}
                        setPortingInformation={setPortingInformation}
                        setrefresh={props.setrefresh}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* <Typography sx={{ p: 2 }}>{data}</Typography> */}
      </Popover>
    </div>
  );
});

export default BasicPopover;
