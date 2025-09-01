import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Table, TableBody,
  TableCell, TableHead, TableRow, Typography, TextField, Grid, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { useSelector } from 'react-redux';


const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [isAdmin,setAdmin]=useState(false);
    const [attendancePermission,setAttendancePermission]=useState({
        View: false,
        Add: false,
        Edit: false,
        Delete: false
      });
  const systemRights = useSelector((state)=>state.systemRights.systemRights);
  

  useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["attendance-list"]) {
      setAttendancePermission(systemRights.actionPermissions["attendance-list"]);
    }
    const data = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    setAttendanceRecords(data);
  }, [systemRights]);

    useEffect(() => {
    const data = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    setAttendanceRecords(data);
    setFilteredRecords(data);
  }, []);

  const handleEdit = (date) => {
    navigate(`/hr/attendance `);

  };

  const addAttendance = () => {
    navigate('/hr/attendance');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = attendanceRecords.filter(record =>
      record.date.toLowerCase().includes(value)
    );
    setFilteredRecords(filtered);
  };

  const handleBack=()=>{
    navigate('/')
  };

  return (
    <Box p={3}>

            <Breadcrumb>
              <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                HR
              </Typography>
              <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                Attendance
              </Typography>
            </Breadcrumb>
      
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
  {/* Left: Heading */}
  <Typography variant="h5" component="div">
    Attendance List
  </Typography>

  {/* Right: Search + Add + Back */}
  <Box display="flex" alignItems="center" gap={2}>
    <TextField
      label="Search by Date"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleSearch}
    />
    {(attendancePermission?.Add===true || isAdmin) && <Button variant="contained" color="primary" onClick={addAttendance} startIcon={<AddIcon />}>
     
    </Button>}
    <Button variant="outlined" color="secondary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
      
    </Button>
  </Box>
</Box>
        
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SR.NO</TableCell>
                <TableCell>ATTENDANCE DATE</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map((record, index) => (
                <TableRow key={record.date}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                   <Box display="flex" gap={1}>
                      {(attendancePermission?.Edit===true || isAdmin) && <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(record.date)}
                      >
                      </Button>}
                      {(attendancePermission?.Delete===true || isAdmin) && <Button
                          variant="contained"
                          color="error"
                          sx={{
                            minWidth: '40px', // Adjust the button size to fit the icon
                            padding: '2px', // Reduce padding around the icon
                          }}
                        >
                          <IconButton color="inherit">
                            <CancelIcon /> {/* Cancel icon */}
                          </IconButton>
                      </Button>}
                    </Box>
                  </TableCell>
                  

                </TableRow>
              ))}
              {attendanceRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No attendance data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>

  );
};

export default AttendanceList;
