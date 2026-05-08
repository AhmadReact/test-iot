import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone';

import { getcustomersubscriptionfresh, savelabel } from '../../services/services';

export default function LabelEditbtn(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const save = () => {
    setloading(true);
    savelabel(props.id, label).then((result) => {
      //    props.setdata((prev)=>{

      //         prev.map((obj)=>{
      //         if(obj.id===props.id)
      //         {
      //             obj.label=label;
      //             return obj;
      //         }
      //         else{
      //             return obj;
      //         }})
      //    })

      // props.setdata(props.data.map((obj=>
      //     {if(obj.id==props.id)
      //     {
      //         obj.label=label;

      //     }
      //     return obj;

      //     })))
      getcustomersubscriptionfresh().then((result) => {
        setloading(false);
        handleClose();
        const [key, value] = Object.entries(result)[0];

        props.setData(value);
        props.settmpdata(value);
      });
    });
  };

  const [label, setlabel] = useState(props.label ? props.label : '');
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setlabel(props.label ? props.label : '');
  }, [props]);

  return (
    <div>
      <SaveAsTwoToneIcon style={{ maxWidth: 15, position: 'relative' }} onClick={handleClick} />
      {/* <Button size="small"  style={{maxWidth: '40px', maxHeight: '20px', minWidth: '40px', minHeight: '20px',fontSize:10}}  aria-describedby={id} variant="contained" onClick={handleClick}>
        Edit
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <TextField
          className="mt-10 mb-16 w-7 sm:w-1/2 md:w-200 md:mx-11 md:mt-14 "
          required
          onChange={(e) => setlabel(e.target.value)}
          label="Label"
          autoFocus
          id="name"
          variant="outlined"
          value={label}
          size="small"
        />

        <div className="flex justify-center gap-x-6 mb-11">
          <Button variant="contained" size="small" onClick={handleClose}>
            Cancel
          </Button>
          {loading ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              size="small"
            >
              Saving
            </LoadingButton>
          ) : (
            <Button size="small" variant="contained" onClick={save} disabled={label.length == 0}>
              Save
            </Button>
          )}
        </div>
      </Popover>
    </div>
  );
}
