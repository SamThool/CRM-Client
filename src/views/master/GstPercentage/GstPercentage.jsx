import React, { useState, useEffect } from 'react';
import {
    Grid, TextField, Button, Typography, Card, CardContent, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
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
import { get, post, put, remove } from 'api/api'; // <-- import your API helpers
import { useSelector } from 'react-redux';

const GstPercentage = () => {
    const [form, setForm] = useState({ gstPercentage: '' });
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isAdmin,setAdmin]=useState(false);
    const [gstPercentagePermission,setGstPercentagePermission]=useState({
        View: false,
        Add: false,
        Edit: false,
        Delete: false
    });
    const systemRights = useSelector((state)=>state.systemRights.systemRights);

    // Fetch Prefix list from backend
    useEffect(() => {
        const loginRole=localStorage.getItem('loginRole');
        if (loginRole === 'admin') {
        setAdmin(true);
        }
        if (systemRights?.actionPermissions?.["gst-percentage"]) {
        setGstPercentagePermission(systemRights.actionPermissions["gst-percentage"]);
        }
        fetchData();
    }, [systemRights]);

    const fetchData = async () => {
        const res = await get('gst-percentage');

        console.log("gst percentage data:", res.data)

        if (res && res.data) setData(res.data);
        else setData([]);
    };

    const validate = () => {
        const newErrors = {};
        if (!form.gstPercentage) newErrors.gstPercentage = 'gst-percentage is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpen = () => {
        setForm({ gstPercentage: '' });
        setErrors({});
        setEditIndex(null);
        setEditId(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (validate()) {
            if (editIndex !== null && editId) {
                // Edit
                const res = await put(`gst-percentage/${editId}`, { value: form.gstPercentage });
                if (res && res.data) {
                    fetchData();
                    setOpen(false);
                }
            } else {
                // Add
                const res = await post('gst-percentage', { value: form.gstPercentage });
                if (res && res.data) {
                    fetchData();
                    setOpen(false);
                }
            }
        }
    };

    const handleEdit = (index) => {
        setForm({ gstPercentage: data[index].value });
        setEditIndex(index);
        setEditId(data[index]._id);
        setOpen(true);
    };

    const handleDelete = async (index) => {
        const id = data[index]._id;
        await remove(`gst-percentage/${id}`, {}); // Soft delete
        fetchData();
    };

    return (
        <div>
            <Breadcrumb>
                <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                    Home
                </Typography>
                <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                    Gst Percentage
                </Typography>
            </Breadcrumb>

            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Gst Percentage</Typography>
                {(gstPercentagePermission.Add===true || isAdmin) && <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                    Add Gst Percentage
                </Button>}
            </Grid>

            {/* Modal Form */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {editIndex !== null ? 'Edit Gst ' : 'Add Gst'}
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
                <DialogContent sx={{ minWidth: 400 }}>
                    <TextField
                        label="Gst Percentage"
                        name="gstPercentage"
                        value={form.gstPercentage}
                        onChange={handleChange}
                        error={!!errors.gstPercentage}
                        helperText={errors.gstPercentage}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="error"
                        sx={{ minWidth: '40px', padding: '2px' }}
                    >
                        <IconButton color="inherit">
                            <CancelIcon />
                        </IconButton>
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ minWidth: '40px', padding: '2px', backgroundColor: value.primaryLight }}
                    >
                        <IconButton color="inherit">
                            {editIndex !== null ? <EditIcon /> : <SaveIcon />}
                        </IconButton>
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Table */}
            {data.length > 0 && (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SN</TableCell>
                                    <TableCell>Gst Percentage </TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={row._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                        <TableCell>
                                            {(gstPercentagePermission.Edit===true || isAdmin) && <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEdit(index)}
                                                sx={{ padding: '1px', minWidth: '24px', height: '24px', mr: '5px' }}
                                            >
                                                <IconButton color='inherit'><Edit /></IconButton>
                                            </Button>}
                                            {(gstPercentagePermission.Delete===true || isAdmin) && <Button
                                                color="error"
                                                onClick={() => handleDelete(index)}
                                                sx={{ padding: '1px', minWidth: '24px', height: '24px' }}
                                            >
                                                <IconButton color='inherit'><Delete /></IconButton>
                                            </Button>}
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
}

export default GstPercentage;