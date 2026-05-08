import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Button } from "@mui/material";
import PhonePausedIcon from "@mui/icons-material/PhonePaused";
import Swal from "sweetalert2";

import {
  getUltraSimStatus,
  pauseUnPauseUltraLines,
} from "../../services/services";

// eslint-disable-next-line camelcase
export default function SimpleListMenu({ sim_card_num }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [options, setOptions] = React.useState(["Current status: Loading..."]);
  const [loader, setLoader] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
    setOptions(["Current status: Loading..."]);
    getUltraSimStatus({ sim_card_num }).then((res) => {
      if (res?.data?.status) {
        setOptions([
          `Current status: ${res?.data?.status}`,
          res?.data?.status === "active" ? "Pause" : "Unpause",
        ]);
      } else if (res?.status === "error") {
        setOptions(["Current status: Not Valid "]);
      }
    });
  };

  const handleMenuItemClick = (event, option) => {
    setLoader(true);
    pauseUnPauseUltraLines({
      sim_card_num,
      line_status: option,
    })
      .then((result) => {
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            title: result.message,
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
