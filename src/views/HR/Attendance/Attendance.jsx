import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Status from 'views/master/Status/Status';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Attendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const Status = ['PRESENT', 'ABSENT', 'LEAVE', 'HALF DAY'];

  const navigate = useNavigate();

  // Inside Attendance.jsx

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const dateParam = queryParams.get('date');
    const targetDate = dateParam || new Date().toISOString().split('T')[0];
    setSelectedDate(targetDate);

    const existing = JSON.parse(localStorage.getItem('attendanceLog')) || [];
    const found = existing.find((item) => item.date === targetDate);
    if (found) {
      setAttendanceData(found.records);
    } else {
      const mockStaff = [
        { id: 'S1001', name: 'Amit Sharma' },
        { id: 'S1', name: 'Sakshi Ambolikar' }
      ];
      const initialAttendance = mockStaff.map((staff) => ({
        staffId: staff.id,
        name: staff.name,
        status: 'PRESENT',
        inTime: '10:00',
        outTime: '18:00',
        comment: ''
      }));
      setAttendanceData(initialAttendance);
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...attendanceData];
    updated[index][field] = value;
    setAttendanceData(updated);
  };

  const handleSubmit = () => {
    const saved = JSON.parse(localStorage.getItem('attendanceLog')) || [];

    const updated = saved.filter((item) => item.date !== selectedDate);
    updated.push({ date: selectedDate, records: attendanceData });

    localStorage.setItem('attendanceLog', JSON.stringify(updated));
    alert('Attendance saved!');
    navigate('/hr/attendance-list');
  };

  const goBack = () => {
    navigate('/hr/attendance-list');
  };

  const handleEdit = (date) => {
    navigate(`/hr/attendance-list`);
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          HR
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Attendance
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <TextField type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEdit} startIcon={<CheckIcon />}>
                Go
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={goBack} startIcon={<ArrowBackIcon />}></Button>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>SN</TableCell>
                        <TableCell>STAFF ID</TableCell>
                        <TableCell>STAFF NAME</TableCell>
                        <TableCell>MARK</TableCell>
                        <TableCell>IN TIME</TableCell>
                        <TableCell>OUT TIME</TableCell>
                        <TableCell>COMMENTS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{entry.staffId}</TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                  <InputLabel id={`status-label-${index}`}>Status</InputLabel>
                                  <Select
                                    labelId={`status-label-${index}`}
                                    id={`status-select-${index}`}
                                    value={entry.status}
                                    label="Status"
                                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                                  >
                                    {Status.map((status) => (
                                      <MenuItem key={status} value={status}>
                                        {status}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="time"
                              value={entry.inTime}
                              onChange={(e) => handleChange(index, 'inTime', e.target.value)}
                              inputProps={{ step: 300 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="time"
                              value={entry.outTime}
                              onChange={(e) => handleChange(index, 'outTime', e.target.value)}
                              inputProps={{ step: 300 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField value={entry.comment} onChange={(e) => handleChange(index, 'comment', e.target.value)} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Box>

              <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit} startIcon={<SaveIcon />}>
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Attendance;
