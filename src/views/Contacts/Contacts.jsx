// import React, { useState } from 'react';
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Card,
//   IconButton,
//   CardContent,
//   Divider,
//   Box,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TableHead,
//   Table,
//   TableCell,
//   TableRow,
//   TableBody
// } from '@mui/material';
// import { Add, Edit, Delete, Close } from '@mui/icons-material';
// import value from 'assets/scss/_themes-vars.module.scss';
// import { FaTrash } from 'react-icons/fa';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect } from 'react';
// import axios from 'axios';
// import { Form } from 'react-router-dom';
// import Breadcrumb from 'component/Breadcrumb';
// import { Link } from 'react-router-dom';
// import CloseIcon from '@mui/icons-material/Close';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { departmentApi } from 'services/endpoints/departmentApi';

// import { get , post } from "../../api/api.js"

// const Contacts = () => {
//   const [logoPreview, setLogoPreview] = useState('');

//   const [form, setForm] = useState({
//     companyName: '',
//     contactName: '',
//     lastName: '',
//     phoneNo: '',
//     email: '',
//     designation: '',
//     department: '',
//   });
//   const initailState = () => {
//     return {
//       companyName: 'Anuj',
//       contactName: 'Manav',
//       phoneNo: '1234567876',
//       email: 'anujjain@gmail.com',
//       designation: 'Developer',
//       department: 'IT',
//     };
//   };

//   const [data, setData] = useState([initailState()]);
//   const [open, setOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);

//   const [clientOptions, setClientOptions] = useState([]);

//   useEffect(() => {
//     axios
//       .get('/client') // Replace with your real endpoint
//       .then((res) => {
//         const clients = res.data; // Adjust according to your API shape
//         setClientOptions(clients);
//       })
//       .catch((err) => console.error('Failed to fetch clients', err));
//   }, []);

//   const [errors, setErrors] = useState({});

//   const handleSubmit = () => {
//     if (validateForm()) {
//       if (editIndex !== null) {
//         const updated = [...data];
//         updated[editIndex] = form;
//         setData(updated);
//         toast.success('Form submitted successfully!');
//       } else {
//         setData([...data, form]);
//       }
//       setOpen(false);
//     }
//   };

//   const handleEdit = (index) => {
//     setForm(data[index]);
//     setEditIndex(index);
//     setOpen(true);
//   };

//   const handleDelete = (index) => {
//     const updated = [...data];
//     updated.splice(index, 1);
//     setData(updated);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.companyName) newErrors.companyName = 'First Name is required';
//     if (!form.contactName) newErrors.contactName = 'Middle Name is required';
//     if (!form.phoneNo.match(/^[0-9]{10}$/)) newErrors.phoneNo = 'Phone Number is required';
//     if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email is required';
//     if (!form.desgination) newErrors.desgination = 'Company is required';
//     if (!form.department) newErrors.department = 'Client is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleOpen = () => {
//     setErrors({});
//     setEditIndex(null);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const fieldGroups = [
//     [
//       { label: 'Company Name', name: 'companyName' },
//       { label: 'Contact Name', name: 'contactName' },

//     ],
//     [
//       { label: 'Phone Number', name: 'phoneNo' },
//       { label: 'Email', name: 'email' },
//     ],
//     [
//       { label: 'Designation', name: 'designation' },
//       {label : 'Department', name: 'department'}
//     ]
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <>
//       <Breadcrumb>
//         <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
//           Home
//         </Typography>
//         <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
//           Contacts
//         </Typography>
//       </Breadcrumb>
//       <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//         <Typography variant="h5">Contact</Typography>

//         <Box display="flex" alignItems="center" gap={2}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             size="small"
//             // value={searchTerm}
//             // onChange={handleSearch}
//           />
//           <Button variant="contained" onClick={handleOpen}>
//             Add Contact
//           </Button>
//         </Box>
//       </Grid>

//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ m: 0, p: 2 }}>
//           {editIndex !== null ? 'Edit Contact' : 'Add Contact'}
//           <IconButton
//             aria-label="close"
//             onClick={() => setOpen(false)}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500]
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ overflowY: 'auto', overflowX: 'auto', }}>
//           {/* <Card>
//          <Divider />
//         <CardContent> */}
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {fieldGroups.map((group, idx) => (
//               <React.Fragment key={idx}>
//                 {group.map((field) => (
//                   <Grid item xs={12} sm={4} key={field.name}>

//                       <TextField
//                         label={field.label}
//                         name={field.name}
//                         value={form[field.name]}
//                         error={!!errors[field.name]}
//                         helperText={errors[field.name]}
//                         onChange={handleChange}
//                         fullWidth
//                         required
//                       />
//                   </Grid>
//                 ))}
//               </React.Fragment>
//             ))}
//             {/* <Grid item xs={12} sm={9}>
//               <TextField
//                 label="Address"
//                 name="address"
//                 value={form.address}
//                 error={!!errors.address}
//                 helperText={errors.address}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//             </Grid> */}
//           </Grid>
//           <DialogActions sx={{ pr: 3, pb: 2 }}>
//             <Button
//               onClick={() => setOpen(false)}
//               variant="contained"
//               color="error"
//               sx={{
//                 minWidth: '40px', // Adjust the button size to fit the icon
//                 padding: '2px' // Reduce padding around the icon
//               }}
//             >
//               <IconButton color="inherit">
//                 <CancelIcon /> {/* Cancel icon */}
//               </IconButton>
//             </Button>

//             <Button
//               onClick={handleSubmit}
//               variant="contained"
//               sx={{
//                 minWidth: '40px', // Adjust the button size to fit the icon
//                 padding: '2px', // Reduce padding around the icon
//                 backgroundColor: value.primaryLight
//               }}
//             >
//               <IconButton color="inherit">
//                 {editIndex !== null ? <EditIcon /> : <SaveIcon />} {/* Conditional rendering of icons */}
//               </IconButton>
//             </Button>
//           </DialogActions>
//           {/* </CardContent> */}

//           <ToastContainer />
//           {/* </Card> */}
//         </DialogContent>
//       </Dialog>
//       {/* {Contact table} */}
//       {
//         <Card>
//           <CardContent>
//             <Box>
//               <Grid container spacing={2}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>SN</TableCell>
//                       <TableCell>Company Name</TableCell>
//                       <TableCell>Contact Name</TableCell>
//                       <TableCell>Phone Number</TableCell>
//                       <TableCell>Email</TableCell>
//                       <TableCell>Designation</TableCell>
//                       <TableCell>Department</TableCell>
//                       <TableCell>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((entry, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{entry.companyName}</TableCell>
//                         <TableCell>{entry.contactName}</TableCell>
//                         <TableCell>{entry.phoneNo}</TableCell>
//                         <TableCell>{entry.email}</TableCell>
//                         <TableCell>{entry.designation}</TableCell>
//                         <TableCell>{entry.department}</TableCell>
//                         <TableCell sx={{ verticalAlign: 'middle' }}>
//                           <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 1 }}>
//                             <IconButton size="small" color="primary" onClick={() => handleEdit(index)} sx={{ padding: '4px' }}>
//                               <Edit fontSize="small" />
//                             </IconButton>
//                             <IconButton size="small" color="error" onClick={() => handleDelete(index)} sx={{ padding: '4px' }}>
//                               <Delete fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Grid>
//             </Box>
//           </CardContent>
//         </Card>
//       }
//     </>
//   );
// };

// export default Contacts;

//todo: new one
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableHead,
  Table,
  TableCell,
  TableRow,
  MenuItem,
  TableBody,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast, ToastContainer } from 'react-toastify';
import { get, post, put, remove } from '../../api/api.js';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Contacts = () => {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    phoneNo: '',
    email: '',
    designation: '',
    department: ''
  });

  const [data, setData] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin,setAdmin]=useState(false);
    const [contactsPermission,setContactsPermission]=useState({
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
    if (systemRights?.actionPermissions?.["contacts"]) {
      setContactsPermission(systemRights.actionPermissions["contacts"]);
    }
    fetchContacts();
    fetchDepartments();
  }, [systemRights]);

  const fetchContacts = async () => {
    try {
      const res = await get('contact');
      console.log('Contact data:', res.data);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load contacts');
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await get('department');
      console.log('Department data:', res.data);
      setDeptOptions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load departments');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.companyName) newErrors.companyName = 'Required';
    if (!form.contactName) newErrors.contactName = 'Required';
    if (!/^[0-9]{10}$/.test(form.phoneNo)) newErrors.phoneNo = '10 digits only';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.designation) newErrors.designation = 'Required';
    if (!form.department) newErrors.department = 'Select a department';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      companyName: form.companyName,
      name: form.contactName,
      phone: form.phoneNo,
      email: form.email,
      designation: form.designation,
      department: form.department
    };

    try {
      if (editIndex !== null) {
        const toUpdate = data[editIndex];
        await put(`contact/${toUpdate._id}`, payload);
        toast.success('Contact updated');
      } else {
        await post('contact', payload);
        toast.success('Contact added');
      }
      fetchContacts();
      handleClose();
    } catch (e) {
      console.error(e);
      toast.error('Submission failed');
    }
  };

  const handleDelete = async (index) => {
    try {
      const toDelete = data[index];
      await remove(`contact/${toDelete._id}`);
      toast.success('Deleted');
      fetchContacts();
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    }
  };

  const handleEdit = (index) => {
    const c = data[index];
    setForm({
      companyName: c.companyName || '',
      contactName: c.name || '',
      phoneNo: c.phone || '',
      email: c.email || '',
      designation: c.designation || '',
      department: typeof c.department === 'object' ? c.department.department : c.department || ''
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleOpen = () => {
    setForm({
      companyName: '',
      contactName: '',
      phoneNo: '',
      email: '',
      designation: '',
      department: ''
    });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/">
          Home
        </Typography>
        <Typography>Contacts</Typography>
      </Breadcrumb>

      {/* <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Contacts</Typography>
        <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
          Add Contact
        </Button>
      </Grid> */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Contacts</Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Search" size="small" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {(contactsPermission.Add===true || isAdmin) && <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
            Add Contact
          </Button>}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editIndex != null ? 'Edit Contact' : 'Add Contact'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              ['companyName', 'Company Name'],
              ['contactName', 'Contact Name'],
              ['phoneNo', 'Phone Number'],
              ['email', 'Email'],
              ['designation', 'Designation']
            ].map(([name, label]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name]}
                  fullWidth
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={!!errors.department}
                helperText={errors.department}
                fullWidth
              >
                {deptOptions.length > 0 ? (
                  deptOptions.map((d) => (
                    <MenuItem key={d._id} value={d.department}>
                      {d.department}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No departments found</MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            <CancelIcon />
          </Button>
          <Button onClick={handleSubmit}>
            <SaveIcon />
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardContent>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  ?.filter(
                    (c) =>
                      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      c.designation?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((c, i) => (
                    <TableRow sx={{ verticalAlign: 'top' }} key={c._id || i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{c.companyName}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.designation}</TableCell>
                      <TableCell>{typeof c.department === 'object' ? c.department.department : c.department || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {(contactsPermission.Edit===true || isAdmin) && <IconButton color="primary" onClick={() => handleEdit(i)}>
                            <EditIcon />
                          </IconButton>}
                          {(contactsPermission.Delete===true || isAdmin) && <IconButton color="error" onClick={() => handleDelete(i)}>
                            <DeleteIcon />
                          </IconButton>}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
          <ToastContainer />
        </CardContent>
      </Card>
    </>
  );
};

export default Contacts;
