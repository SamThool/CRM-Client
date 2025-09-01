import React, { useState, useEffect } from 'react';
import {
  Grid, TextField, Button, Typography, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Box
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';

// import { axiosInstance } from '../../../api/api.js';

import { get, post, put, remove } from "../../../api/api.js"
import { useSelector } from 'react-redux';

const TicketStatus = () => {
  const [form, setForm] = useState({
    TicketStatus: '',
    shortForm: '',
    colorCode: ''
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([
    //   {
    //   TicketStatus: 'Example Status',
    //   shortForm: 'Ex',
    //   colorCode: '#123456'
    // }
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin,setAdmin]=useState(false);
    const [ticketStatusPermission,setTicketStatusPermission]=useState({
        View: false,
        Add: false,
        Edit: false,
        Delete: false
      });
  const systemRights = useSelector((state)=>state.systemRights.systemRights);
  

  const validate = () => {
    const newErrors = {};
    if (!form.TicketStatus) newErrors.TicketStatus = 'Ticket Status is required';
    if (!form.shortForm) newErrors.shortForm = 'Short Form is required';
    if (!form.colorCode) newErrors.colorCode = 'Color Code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all ticket statuses from backend
  const fetchTicketStatuses = async () => {
    try {
      const response = await get('ticketStatus');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // use axiosInstance to fetch data from the server with useEffect
  useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["Ticket Status"]) {
      setTicketStatusPermission(systemRights.actionPermissions["Ticket Status"]);
    }
    fetchTicketStatuses();
  }, [systemRights]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({
      TicketStatus: '',
      shortForm: '',
      colorCode: ''
    });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // CRUD handlers using axiosInstance
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editIndex !== null) {
        // Update existing
        const id = data[editIndex]._id;
        await put(`ticketStatus/${id}`, form);
      } else {
        // Create new
        await post('ticketStatus', form);
      }
      setOpen(false);
      setEditIndex(null);
      setForm({ TicketStatus: '', shortForm: '', colorCode: '' });
      fetchTicketStatuses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`ticketStatus/${id}`);
      fetchTicketStatuses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Ticket Status
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Ticket Status</Typography>
        {(ticketStatusPermission.Add===true || isAdmin) && <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Ticket Status
        </Button>}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Ticket Status' : 'Add Ticket Status'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Ticket Status"
                name="TicketStatus"
                value={form.TicketStatus}
                onChange={handleChange}
                error={!!errors.TicketStatus}
                helperText={errors.TicketStatus}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Short Form"
                name="shortForm"
                value={form.shortForm}
                onChange={handleChange}
                error={!!errors.shortForm}
                helperText={errors.shortForm}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Color Code"
                name="colorCode"
                value={form.colorCode}
                onChange={handleChange}
                error={!!errors.colorCode}
                helperText={errors.colorCode}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px',
              padding: '2px',
            }}
          >
            <IconButton color="inherit">
              <CancelIcon />
            </IconButton>
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              minWidth: '40px',
              padding: '2px',
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">
              {editIndex !== null ? <EditIcon /> : <SaveIcon />}
            </IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      {data?.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Ticket Status</TableCell>
                    <TableCell>Short Form</TableCell>
                    <TableCell>Color Code</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.TicketStatus}</TableCell>
                      <TableCell>{row.shortForm}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 40,
                            height: 25,
                            backgroundColor: row.colorCode,
                            border: '2px solid #ccc ',
                            borderRadius: '4px',
                           
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {(ticketStatusPermission.Edit===true || isAdmin) && <Button size="small" onClick={() => handleEdit(index)} sx={{
                          padding: '1px',
                          minWidth: '24px',
                          height: '24px',
                          mr: '5px',
                        }}>
                          <IconButton color='inherit'><Edit /></IconButton>
                        </Button>}
                        {(ticketStatusPermission.Delete===true || isAdmin) && <Button color="error" onClick={() => handleDelete(index)} sx={{
                          padding: '1px',
                          minWidth: '24px',
                          height: '24px'
                        }}>
                          <IconButton color='inherit'><Delete /></IconButton>
                        </Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketStatus;
