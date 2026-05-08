import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import BasicTabs from "./Tabs";
import SimpleListMenu from "./PauseUnpause";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  height: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  id,
  act_date,
  carrier_id,
  sim_card_num,
  active,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div className="flex gap-x-2">
        <Button
          style={{
            maxWidth: "40px",
            maxHeight: "20px",
            minWidth: "40px",
            minHeight: "20px",
            fontSize: 10,
          }}
          className="bg-[#f6f9fb]"
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          Usage
        </Button>
        {carrier_id == 5 && active && (
          <SimpleListMenu sim_card_num={sim_card_num} />
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[90vw] md:w-[1200px] p-4 md:p-20">
          <BasicTabs id={id} act_date={act_date} />
        </Box>
      </Modal>
    </div>
  );
}
