import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';

import { getUsages } from '../../services/services';

import EnhancedTable from './table';

import FuseLoading from '@fuse/core/FuseLoading';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ id }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setloading(true);
    getUsages(id, 1).then((result) => {
      if (result.hasOwnProperty('cycle')) {
        setcycle(result.cycle);
        setdata(result.data);
        setcurrentcycle(result.cycle[0].value1);
      }
      setloading(false);
      getUsages(id, 2).then((result) => {
        if (result.hasOwnProperty('cycle')) {
          setcycle2(result.cycle);
          setcurrentcycle2(result.cycle[0].value1);
          setdata2(result.data);
        }
        getUsages(id, 3).then((result) => {
          if (result.hasOwnProperty('cycle')) {
            setcycle3(result.cycle);
            setcurrentcycle3(result.cycle[0].value1);
            setdata3(result.data);
          }
        });
      });
    });
  }, []);

  const [cycle, setcycle] = useState([]);
  const [cycle2, setcycle2] = useState([]);
  const [cycle3, setcycle3] = useState([]);

  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [data3, setdata3] = useState([]);

  const [currentcycle, setcurrentcycle] = useState();
  const [currentcycle2, setcurrentcycle2] = useState();
  const [currentcycle3, setcurrentcycle3] = useState();

  const headCells1 = [
    {
      id: 'name',
      numeric: true,
      disablePadding: false,
      label: 'Phone Number',
    },
    {
      id: 'calories',
      numeric: true,
      disablePadding: false,
      label: 'Local Time Call Started',
    },
    {
      id: 'fat',
      numeric: true,
      disablePadding: false,
      label: 'Answer Time Duration Min',
    },
    {
      id: 'carbs',
      numeric: true,
      disablePadding: false,
      label: 'Direction',
    },
    {
      id: 'protein',
      numeric: true,
      disablePadding: false,
      label: 'Number Called',
    },
    {
      id: 'techused',
      numeric: true,
      disablePadding: false,
      label: 'Tech Used',
    },
  ];

  const headCells2 = [
    {
      id: 'name',
      numeric: true,
      disablePadding: false,
      label: 'Phone Number',
    },
    {
      id: 'calories',
      numeric: true,
      disablePadding: false,
      label: 'Local Time Session Started',
    },
    {
      id: 'fat',
      numeric: true,
      disablePadding: false,
      label: 'Total Volumn Mb',
    },
    {
      id: 'techused',
      numeric: true,
      disablePadding: false,
      label: 'Tech Used',
    },
  ];

  const headCells3 = [
    {
      id: 'name',
      numeric: true,
      disablePadding: false,
      label: 'Phone Number',
    },
    {
      id: 'calories',
      numeric: true,
      disablePadding: false,
      label: 'Local Time Call Started',
    },
    {
      id: 'fat',
      numeric: true,
      disablePadding: false,
      label: 'Answer Time Duration Min',
    },
    {
      id: 'techused',
      numeric: true,
      disablePadding: false,
      label: 'Direction',
    },
    {
      id: 'techused',
      numeric: true,
      disablePadding: false,
      label: 'Number Called',
    },
    {
      id: 'techused',
      numeric: true,
      disablePadding: false,
      label: 'Tech Used',
    },
  ];

  const [loading, setloading] = useState(false);

  const handleCycle = (e) => {
    if (e.target.name == 'cycle1') {
      setloadingarr([1, 0, 0]);
      setcurrentcycle(e.target.value);
      setdata([]);
      getUsages(id, 1, e.target.value).then((result) => {
        setdata(result.data);

        setloadingarr([0, 0, 0]);
      });
    }

    if (e.target.name == 'cycle2') {
      setloadingarr([0, 1, 0]);
      setcurrentcycle3(e.target.value);
      setdata2([]);
      getUsages(id, 2, e.target.value).then((result) => {
        setdata2(result.data);

        setloadingarr([0, 0, 0]);
      });
    }

    if (e.target.name == 'cycle3') {
      setloadingarr([0, 0, 1]);
      setcurrentcycle2(e.target.value);
      setdata3([]);
      getUsages(id, 3, e.target.value).then((result) => {
        setdata3(result.data);

        setloadingarr([0, 0, 0]);
      });
    }
  };

  const [loadingarr, setloadingarr] = useState([0, 0, 0]);

  const downloadcsv = () => {
    const json = data.map((obj) => {
      return {
        Phone_Number: obj.msisdn,
        Local_Time_Call_Started: obj.local_time_call_started,
        Answer_Time_Duration_Min: obj.ans_time_duration_min,
        Direction: obj.call_direction == 0 ? 'Outgoing' : 'Incoming',
        Number_Called: obj.subscriber_call_no,
        Tech_Used: obj.tech_used,
      };
    });
    const fields = Object.keys(json[0]);
    const replacer = function (key, value) {
      return value === null ? '' : value;
    };
    let csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(',');
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}/${mm}/${yyyy}`;

    const csvContent = `data:text/csv;charset=utf-8,${csv}`;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Voice Log${formattedToday}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const downloadcsv2 = () => {
    const json = data3.map((obj) => {
      return {
        Phone_Number: obj.msisdn,
        Local_Time_Call_Started: obj.local_time_call_started,
        Total_Volume_Mb: obj.total_volume_mb,
        Tech_Used: obj.tech_used,
      };
    });
    const fields = Object.keys(json[0]);
    const replacer = function (key, value) {
      return value === null ? '' : value;
    };
    let csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(',');
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}/${mm}/${yyyy}`;

    const csvContent = `data:text/csv;charset=utf-8,${csv}`;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data Log${formattedToday}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  const downloadcsv3 = () => {
    const json = data2.map((obj) => {
      return {
        Phone_Number: obj.msisdn,
        Local_Time_Call_Started: obj.local_time_call_started,
        Answer_Time_Duration_Min: obj.ans_time_duration_min,
        Direction: obj.call_direction == 0 ? 'Outgoing' : 'Incoming',
        Number_Called: obj.subscriber_call_no,
        Tech_Used: obj.tech_used,
      };
    });
    const fields = Object.keys(json[0]);
    const replacer = function (key, value) {
      return value === null ? '' : value;
    };
    let csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(',');
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;

    const formattedToday = `${dd}/${mm}/${yyyy}`;

    const csvContent = `data:text/csv;charset=utf-8,${csv}`;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Text Log${formattedToday}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();
  };

  return (
    <Box sx={{ width: '100%', height: '80%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Voice" {...a11yProps(0)} />
          <Tab label="Data" {...a11yProps(1)} />
          <Tab label="Text" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <FuseLoading />
        </div>
      ) : (
        <>
          <TabPanel className="text-blue-gray-300" value={value} index={0}>
            <div className="flex justify-between">
              <FormControl className="w-[20%]">
                <InputLabel id="demo-simple-select-label">Cycle</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  value={currentcycle}
                  label="Cycle"
                  name="cycle1"
                  onChange={handleCycle}
                >
                  {cycle.map((obj) => {
                    return <MenuItem value={obj.value1}>{obj.key1}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <button onClick={downloadcsv}>Download CSV</button>
            </div>
            <h1 className="text-[36px] text-[#31a5d2] mt-[20px] mb-[10px]">CALL LOGS</h1>

            <h2 className="mb-[20px] text-black">
              Total: {data.reduce((total, obj) => total + parseFloat(obj.ans_time_duration_min), 0)}{' '}
              Min
            </h2>

            {loadingarr[0] === 1 ? (
              <div className="flex items-center justify-center h-full">
                <FuseLoading />
              </div>
            ) : (
              <EnhancedTable data={data} headcell={headCells1} />
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="flex justify-between">
              <FormControl className="w-[20%]">
                <InputLabel id="demo-simple-select-label">Cycle</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  value={currentcycle2}
                  label="Cycle"
                  name="cycle3"
                  onChange={handleCycle}
                >
                  {cycle2.map((obj) => {
                    return <MenuItem value={obj.value1}>{obj.key1}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <button onClick={downloadcsv2}>Download CSV</button>
            </div>
            <h1 className="text-[36px] text-[#31a5d2] mt-[20px] mb-[10px]">DATA LOGS</h1>

            <h2 className="mb-[20px]">
              Total:{' '}
              {data3.reduce((total, obj) => total + parseFloat(obj.total_volume_mb), 0).toFixed(2)}{' '}
              MB
            </h2>

            {loadingarr[2] === 1 ? (
              <div className="flex items-center justify-center h-full">
                <FuseLoading />
              </div>
            ) : (
              <EnhancedTable data1={data3} headcell={headCells2} />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="flex justify-between">
              <FormControl className="w-[20%]">
                <InputLabel id="demo-simple-select-label">Cycle</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  value={currentcycle3}
                  label="Cycle"
                  name="cycle2"
                  onChange={handleCycle}
                >
                  {cycle3.map((obj) => {
                    return <MenuItem value={obj.value1}>{obj.key1}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <button onClick={downloadcsv3}>Download CSV</button>
            </div>
            <h1 className="text-[36px] text-[#31a5d2] mt-[20px] mb-[10px]">TEXT LOGS</h1>

            <h2 className="mb-[20px]">
              Total:{' '}
              {data2.reduce((total, obj) => total + parseFloat(obj.ans_time_duration_min), 0)}
            </h2>
            {loadingarr[1] === 1 ? (
              <div className="flex items-center justify-center h-full">
                <FuseLoading />
              </div>
            ) : (
              <EnhancedTable data2={data2} headcell={headCells3} />
            )}
          </TabPanel>
        </>
      )}
    </Box>
  );
}
