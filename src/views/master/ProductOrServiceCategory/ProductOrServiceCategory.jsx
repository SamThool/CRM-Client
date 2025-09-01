import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const ProductOrServiceCategory = () => {
  const [form, setForm] = useState({ productName: '' });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin,setAdmin]=useState(false);
    const [productCategoryPermission,setProductCategoryPermission]=useState({
          View: false,
          Add: false,
          Edit: false,
          Delete: false
        });
    const systemRights = useSelector((state)=>state.systemRights.systemRights);
  

  const validate = () => {
    const newErrors = {};
    if (!form.productName) newErrors.productName = 'Product Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // use axiosInstance to fetch data from the server with useEffect
  useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["product-or-service-category"]) {
      setProductCategoryPermission(systemRights.actionPermissions["product-or-service-category"]);
    }
    const fetchData = async () => {
      try {
        const response = await get('/productOrServiceCategory');

        console.log('Full API Response:', response.data); // 👀 should show { status: 'true', data: [...] }

        const list = response.data; // ✅ safely access nested data
        console.log('Final Data Set:', list); // 👀 confirm it has productName values

        setData(list); // ✅ populate table
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchData();
  }, [systemRights]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpen = () => {
    setForm({ productName: '' });
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Add or update product/service category using axiosInstance
  // const handleSubmit = async () => {
  //   if (validate()) {
  //     try {
  //       // adding headers for token authorization
  //       const headers = { Authorization: `Bearer ${token}` };

  //       if (editIndex !== null) {
  //         // Update
  //         const id = data[editIndex]._id;
  //         const response = await put(`/productOrServiceCategory/${id}`, form, { headers });
  //         // Update the specific item in the data array
  //           const newCategory = response.data?.data; // ✅ get new object
  //       setData([...data, newCategory]);
  //       } else {
  //         // Add
  //         const response = await post('/productOrServiceCategory', form, { headers });
  //         setData([...data, response.data]);
  //       }
  //       setOpen(false);
  //     } catch (error) {
  //       console.error(error);
  //       // Optionally show a toast or error message here
  //     }
  //   }
  // };

  //todo: handleSubmit
  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editIndex !== null) {
          // Edit case
          const id = data[editIndex]._id;
          const response = await put(`/productOrServiceCategory/${id}`, form);
          const updatedCategory = response.data;
          console.log('Updated Category from API:', updatedCategory); // 🔍 debug

          if (updatedCategory) {
            const updated = [...data];
            updated[editIndex] = updatedCategory;
            setData(updated);
          }
        } else {
          // Add case
          console.log('form is',form);
          const response = await post('/productOrServiceCategory', form);
          console.log('New Category from API:', response.data); // 🔍 debug
          const newCategory = response.data;

          if (newCategory) {
            // setData([...data, newCategory]);
            setData([...(data || []), response.data]);
          }
        }

        setOpen(false);
        setEditIndex(null); // ✅ Clear state after submit
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  // Delete product/service category using axiosInstance
  const handleDelete = async (index) => {
    try {
      const id = data[index]._id;
      await remove(`/productOrServiceCategory/${id}`);

      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Edit handler (no change, just ensure it's defined)
  // const handleEdit = (index) => {
  //   setForm(data[index]);
  //   setEditIndex(index);
  //   setOpen(true);
  // };

  //todo: handleEdit
  const handleEdit = (index) => {
    const selected = data[index];
    setForm({ productName: selected.productName }); // only needed fields
    setEditIndex(index);
    setOpen(true);
  };
console.log('productCategoryPermission',productCategoryPermission);
  return (
    <div>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Product-Service Categories
        </Typography>
      </Breadcrumb>

      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Product/Service Categories</Typography>
        {(productCategoryPermission.Add===true || isAdmin) && <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Category
        </Button>}
      </Grid>

      {/* Modal Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Category' : 'Add Category'}
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
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            error={!!errors.productName}
            helperText={errors.productName}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px',
              padding: '2px'
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
            <IconButton>{editIndex !== null ? <EditIcon /> : <SaveIcon />}</IconButton>
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      {/* adding Array.isArray(data) && */}
      {Array.isArray(data) && data.length > 0 && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* adding Array.isArray(data) && */}
                {Array.isArray(data) &&
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row?.productName || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleEdit(index)}
                          sx={{
                            padding: '1px', // Reduced padding
                            minWidth: '24px', // Set minimum width
                            height: '24px',
                            mr: '5px'
                          }}
                        >
                          <IconButton color="inherit">
                            <Edit />
                          </IconButton>
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDelete(index)}
                          sx={{
                            padding: '1px', // Reduced padding
                            minWidth: '24px', // Set minimum width
                            height: '24px'
                          }}
                        >
                          <IconButton color="inherit">
                            <Delete />
                          </IconButton>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductOrServiceCategory;
