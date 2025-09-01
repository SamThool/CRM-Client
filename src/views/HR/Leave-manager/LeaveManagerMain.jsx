import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  // Edit,
  // Delete,
  Radio,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Edit, Delete } from '@mui/icons-material';

import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Add, Close as CloseIcon } from '@mui/icons-material';
import Breadcrumb from 'component/Breadcrumb';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const gridSpacing = 2;

const LeaveApplicationForm = () => {
  const [form, setForm] = useState(initialFormState());
  const [data, setData] = useState([]);

  const [staffOptions, setStaffOptions] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [status, setStatus] = useState([]);

  const [errors, setErrors] = useState({});
  const [availableLeave, setAvailableLeave] = useState(null); // Example only

  const [leaveDuration, setLeaveDuration] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [open, setOpen] = useState(false);

  const [isAdmin,setAdmin]=useState(false);
    const [leaveManagementPermission,setLeaveManagementPermission]=useState({
      View: false,
      Add: false,
      Edit: false,
      Delete: false
    });
    const systemRights = useSelector((state)=>state.systemRights.systemRights);

  function initialFormState() {
    return {
      staffName: '',
      leaveType: '',
      noOfDays: '',
      status: '',
      reason: ''
    };
  }

  const handleLeaveDurationChange = (e) => {
    setLeaveDuration(e.target.value);
    if (e.target.value !== 'multi') {
      setNumberOfDays('');
    }
  };

  const handleNumberOfDaysChange = (e) => {
    setNumberOfDays(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.staffName) newErrors.staffName = 'Staff Name is required';
    if (!form.leaveType) newErrors.leaveType = 'Leave Type is required';
    if (form.leaveMode === 'multi' && !form.noOfDays) newErrors.noOfDays = 'No. of Days is required';
    if (!form.reason) newErrors.reason = 'Reason is required';
    if (!form.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //todo : new handle submit
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (form._id) {
        // Update existing
        await put(`leaveManager/${form._id}`, form);
        toast.success('Leave updated!');
      } else {
        // Create new
        await post('leaveManager', form);
        toast.success('Leave created!');
      }

      setOpen(false);
      setForm(initialFormState());
      getLeaveManagerData();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  //todo: handle edit and delete
  const handleEdit = (entry) => {
    setForm(entry); // populate form with clicked row data
    setOpen(true); // open dialog
  };

  const handleDelete = async (id) => {
    try {
      await remove(`leaveManager/delete/${id}`);
      toast.success('Leave deleted');
      getLeaveManagerData(); // refresh table
    } catch (error) {
      toast.error('Failed to delete');
      console.error('Delete error:', error);
    }
  };

  // get whole data from the leaveManager
  const getLeaveManagerData = async () => {
    let response = await get('/leaveManager');
    console.log('leave manager ', response.data);
    setData(response.data);
  };

  // statff name adminstrative
  const getStaffName = async () => {
    const response = await get('administrative');
    const dataStaff = response.data.map((item) => {
      // console.log("basic details ", item.basicDetails)
      const fullName = item.basicDetails.firstName + ' ' + item.basicDetails.lastName;
      console.log('fullname of statff: ', fullName);
      return fullName;
    });
    console.log('administrative data:', dataStaff);
    setStaffOptions(dataStaff);
  };

  // leave type
  const leaveTypeData = async () => {
    try {
      const response = await get('leaveType');

      // ✅ Check if response has data
      if (response.status === 'true' && Array.isArray(response.data)) {
        console.log('✅ Leave Types:', response.data);
        setLeaveTypes(response.data); // set state
      } else {
        console.warn('⚠️ Unexpected response format', response);
      }
    } catch (error) {
      console.error('❌ Error fetching leave types:', error);
    }
  };

  const getStatusData = async () => {
    try {
      const response = await get('status');

      // ✅ Check if response is valid
      if (response.status === 'true' && Array.isArray(response.data)) {
        console.log('✅ Status result:', response.data);
        setStatus(response.data); // Set state
      } else {
        console.warn('⚠️ Unexpected response format in status API:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching status data:', error);
    }
  };

  useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["leave-management"]) {
      setLeaveManagementPermission(systemRights.actionPermissions["leave-management"]);
    }
    getLeaveManagerData();
    getStaffName();
    leaveTypeData();
    getStatusData();
  }, [systemRights]);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Leave Manager
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              {(leaveManagementPermission.Add===true || isAdmin) && <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                Add Leave
              </Button>}
            </Grid>
          </Grid>

          {/* Bank Table */}
          {data.length > 0 && (
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SN</TableCell>
                          <TableCell>Staff Name</TableCell>
                          <TableCell>Leave Type</TableCell>
                          <TableCell>Days</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((entry, index) => (
                          <TableRow sx={{ verticalAlign: 'top' }} key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{entry.staffName}</TableCell>
                            <TableCell>{entry.leaveType}</TableCell>
                            <TableCell>{entry.noOfDays}</TableCell>
                            <TableCell>{entry.status}</TableCell>
                            <TableCell>{entry.reason}</TableCell>
                            <TableCell>
                              {(leaveManagementPermission.Edit===true || isAdmin) && <IconButton color="primary" onClick={() => handleEdit(entry)}>
                                <Edit />
                              </IconButton>}
                              {(leaveManagementPermission.Delete===true || isAdmin) && <IconButton color="error" onClick={() => handleDelete(entry._id)}>
                                <Delete />
                              </IconButton>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Leave Application
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center" sx={{ my: 'auto' }}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Staff Name"
                name="staffName"
                value={form.staffName}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.staffName}
                helperText={errors.staffName}
              >
                {staffOptions.map((staff, i) => (
                  <MenuItem key={i} value={staff}>
                    {staff}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                select
                label="Leave Type"
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.leaveType}
                helperText={errors.leaveType}
              >
                {leaveTypes.map((item) => (
                  <MenuItem key={item._id} value={item.leaveType}>
                    {item.leaveType}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.status}
                helperText={errors.status}
              >
                {status.map((item) => (
                  <MenuItem key={item._id} value={item.statusName}>
                    {item.statusName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="No. of Days"
                name="noOfDays"
                type="number"
                value={form.noOfDays}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.noOfDays}
                helperText={errors.noOfDays}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                error={!!errors.reason}
                helperText={errors.reason}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>

          <ToastContainer />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveApplicationForm;
