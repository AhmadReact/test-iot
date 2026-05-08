import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Button } from "@mui/material";
import PhonePausedIcon from "@mui/icons-material/PhonePaused";
import Swal from "sweetalert2";

import {
  getVtmobileSimInfo,
  vtmobilePause,
  vtmobileUnpause,
} from "../../services/services";

/* eslint-disable camelcase */
export default function SimpleListMenu({
  phone_number,
  msisdn,
  plan_id,
  plan_name,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [options, setOptions] = React.useState(["Current status: Loading..."]);
  const [loader, setLoader] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
    setOptions(["Current status: Loading..."]);
    getVtmobileSimInfo(phone_number).then((res) => {
      if (res?.data?.status) {
        setOptions([
          `Current status: ${res?.data?.status}`,
          res?.data?.status === "Active" ? "Pause" : "Unpause",
        ]);
      } else if (res?.status === "error") {
        setOptions(["Current status: Not Valid "]);
      }
    });
  };

  const handleMenuItemClick = (event, option) => {
    setLoader(true);

    const today = new Date().toISOString().split("T")[0];
    const isUnpause = option === "suspended";
    const apiCall = isUnpause
      ? vtmobileUnpause({ msisdn, effective_date: today, plan_id, plan_name })
      : vtmobilePause({ msisdn, effective_date: today });

    apiCall
      .then((result) => {
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: isUnpause
              ? "Line unpaused successfully"
              : "Line paused successfully",
          });
        } else if (result.status === "error") {
          const formattedErrors = Object.entries(result.message)
            .map(
              ([field, messages]) =>
                `<strong>${field}</strong>: ${messages.join(", ")}`,
            )
            .join("<br>");
          Swal.fire({
            icon: "info",
            title: "Validation Errors",
            html: formattedErrors,
            customClass: {
              popup: "swal-front",
            },
          });
        }
      })
      .finally(() => {
        setLoader(false);
        setAnchorEl(null);
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        style={{
          maxWidth: "10px",
          maxHeight: "20px",
          minWidth: "10px",
          minHeight: "20px",
          fontSize: 5,
        }}
        className="bg-[#f6f9fb]"
        variant="contained"
        size="small"
        onClick={handleClickListItem}
      >
        <PhonePausedIcon className="!text-[15px]" />
      </Button>
      {/* <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="!"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText primary="!" secondary={options[selectedIndex]} />
        </ListItemButton> */}

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {loader ? (
          <MenuItem>
            <div>Working...</div>
          </MenuItem>
        ) : (
          options.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === selectedIndex}
              onClick={(event) =>
                handleMenuItemClick(
                  event,
                  option === "Pause" ? "active" : "suspended",
                )
              }
            >
              {option}
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
}
