import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  CardContent,
  DialogActions,
  IconButton,
  TablePagination
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ReportCard from './ReportCard';
import { gridSpacing } from 'config.js';
import { get, post, put } from '../../../api/api.js';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import DepartmentOpdPieChart from '../Charts/PieChart/DepartmentOPD';
import ReusableBarChart from '../Charts/BarCharts/ReusbaleBarChart';
import { useSelector } from 'react-redux';
import { Delete, Edit, Info as InfoIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const inputData = [
  { department: 'Cardiology', label: 'Dr. Smith', value: 5 },
  { department: 'Orthopedics', label: 'Dr. Brown', value: 8 },
  { department: 'Orthopedics', label: 'Dr. White', value: 3 },
  { department: 'Pediatrics', label: 'Dr. Green', value: 2 },
  { department: 'Cardiology', label: 'Dr. Red', value: 20 },
  { department: 'Orthopedics', label: 'Dr. Blue', value: 10 },
  { department: 'Orthopedics', label: 'Dr. Yellow', value: 7 },
  { department: 'Pediatrics', label: 'Dr. Purple', value: 12 }
];

const Default = () => {
  const theme = useTheme();
  const [selectedChart, setSelectedChart] = useState('Revenue');
  const [doctorOpdData, setDoctorOpdData] = useState(inputData);
  const [leads, setLeads] = useState([]);
  const [addFollowIndex, setAddFollowIndex] = useState(null);
  const [openAddFollowUp, setOpenAddFollowUp] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [editFollowUpId, setEditFollowUpId] = useState(null);
  const [followUpData, setFollowUpData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [client, setclient] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [paid, setPaid] = useState(0);
  const [unpaid, setUnpaid] = useState(0);
  const [pending, setPending] = useState(0);
  const [leadColours, setLeadColours] = useState([]);
  const [rleadCounts, setrLeadCounts] = useState([]);
  const [leadCounts, setLeadCounts] = useState([]);
  const [leadLabels, setLeadLabels] = useState([]);
  const [rleadLabels, setrLeadLabels] = useState([]);
  const [chartInvoice, setChartInvoive] = useState([]);
  const [chartInvoiceMoney, setChartInvoiveMoney] = useState([]);
  const [chartInvoiceLabels, setChartInvoiveLabels] = useState([]);
  const [clientmonthlabel, setClientMonthLabel] = useState([]);
  const [clientmonthcount, setClientMonthCount] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const systemRights = useSelector((state) => state.systemRights.systemRights);
  const [productCategories, setProductCategories] = useState([]);

  const [form, setForm] = useState({
    followupDate: '',
    followupTime: '',
    leadstatus: '',
    comment: '',
    leadId: ''
  });

  const [staff, setStaff] = useState([]);

  // const [invoice, setinvoice] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated data

  const fetchStaff = async () => {
    try {
      const response = await get('/administrative');
      setStaff(response.data || []);
      // console.log('Fetched staff:', response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const [invoicetotal, setinvoicetotal] = useState(0);
  const [leadtotal, setleadtotal] = useState(0);
  const fetchinvoice = async () => {
    try {
      const response = await get('invoiceRegistration');
      if (response.status === true) {
        const filteredData = response.invoices.filter((invoice) => invoice.gstType === 'gst');
        const nonGstData = response.invoices.filter((invoice) => invoice.gstType === 'non-gst');
        // setGstData(filteredData || []);
        // setNonGstData(nonGstData || []);
        // console.log('filterdata', response);
        // console.log('nongst:', nonGstData);

        // console.log('Fetched invoice:', response.data);
        setinvoicetotal(response?.invoices.length);
        // console.log('total invoice', invoicetotal);
      }
    } catch (error) {
      console.error('Error fetching  invoice:', error);
    }
  };

  useEffect(() => {
    const loginRole = localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.['lead']) {
      setLeadPermission(systemRights.actionPermissions['lead']);
    }
    fetchLeadStatusOptions();
  }, [systemRights]);

  const fetchLeadStatusOptions = async () => {
    try {
      const response = await get('leadstatus');
      setStatusOptions(response.data || []);
    } catch (err) {
      toast.error('Failed to load leadstatus options');
      console.error(err);
    }
  };

  const handleInfoClose = () => {
    setOpenAddFollowUp(false);
    setForm({
      followupDate: '',
      followupTime: '',
      leadstatus: '',
      comment: ''
    });
    setAddFollowIndex(null);
    setEditFollowUpId(null);
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFollowUp = (id, data) => {
    setEditFollowUpId(id);
    setIsEditMode(true);
    setForm({
      followupDate: data.followupDate || '',
      followupTime: data.followupTime || '',
      leadstatus: data.leadstatus?._id || data.leadstatus || '',
      comment: data.comment || ''
    });
  };

  const handleDeleteFollowUp = async (followUpId) => {
    try {
      await remove(`lead/followup/${followUpId}`);
      toast.success('Follow-up deleted');
      setFollowUpData((prev) => prev.filter((item) => item._id !== followUpId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete follow-up');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && editFollowUpId) {
        await put(`lead/followup/${editFollowUpId}`, form);
        toast.success('Follow-up updated successfully');
      } else {
        // console.log(form, addFollowIndex);
        const payload = { ...form, leadId: addFollowIndex };
        await post('lead/followup', payload);
        toast.success('Follow-up added successfully');
      }

      await fetchFollowUps(addFollowIndex);
      // await getLeadData();

      setForm({
        followupDate: '',
        followupTime: '',
        leadstatus: '',
        comment: ''
      });
      setEditFollowUpId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save follow-up');
    }
  };

  useEffect(() => {
    fetchinvoice();
  }, []);

  const fetchClient = async () => {
    try {
      const role = localStorage.getItem('loginRole');
      let url = role === 'super-admin' ? 'clientRegistration' : 'admin-clientRegistration';
      const response = await get(url);
      setclient(response.data || []);
      // console.log(response.data.length);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await get('lead');

      // Filter leads with at least one followup
      const filteredLeads = (response.data || []).filter((lead) => Array.isArray(lead.followups) && lead.followups.length > 0);

      // Sort leads based on the latest followup date (last indexed followup)
      const sortedLeads = filteredLeads.sort((a, b) => {
        const lastA = a.followups[a.followups.length - 1];
        const lastB = b.followups[b.followups.length - 1];
        return new Date(lastB.updatedAt) - new Date(lastA.updatedAt);
      });

      setLeads(sortedLeads);
      setleadtotal(sortedLeads.length);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchProductCategories = async () => {
    try {
      const response = await get('/productOrServiceCategory');
      setProductCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching product categories:', error);
    }
  };
  useEffect(() => {
    fetchProductCategories();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const assignedTo = `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim();
    const product = lead.productService?.productName || '';

    const matchesStaff = !selectedStaff || assignedTo === selectedStaff;
    const matchesProduct = !selectedProduct || product === selectedProduct;
    const matchesSearch = !searchQuery || fullName.includes(searchQuery.toLowerCase());

    return matchesStaff && matchesProduct && matchesSearch;
  });

  const invoicePaymentStatusData = {
    type: 'donut',
    head: 'Invoice Payment Monthly Status',
    height: 320,
    series: [paid, pending, unpaid], // counts
    options: {
      labels: ['Paid', 'Partially Paid', 'Unpaid'],
      colors: ['#4caf50', '#ff9800', '#f44336'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Invoices` }
      }
    }
  };

  const getLeadNos = async () => {
    const res = await get('lead/status');
    setLeadColours(res?.colors || []);
    setLeadCounts(res?.counts || []);
    setLeadLabels(res?.labels || []);
    setrLeadLabels(res?.rlabels || []);
    setrLeadCounts(res?.rcounts || []);

    // console.log(res);
  };
  const getInvoiceNos = async () => {
    const res = await get('invoiceRegistration/status');
    setPaid(res?.summary?.paid);
    setUnpaid(res?.summary?.unpaid);
    setPending(res?.summary?.pending);
    setChartInvoive(res?.monthlyCounts);
    setChartInvoiveMoney(res?.monthlyTotals);
    setChartInvoiveLabels(res?.monthLabels);
    // console.log(res);
  };
  const getClientNos = async () => {
    const res = await get('admin-clientRegistration/status');
    setClientMonthCount(res?.monthlyCounts);
    setClientMonthLabel(res?.monthlyCounts);
    // console.log(res);
  };

  useEffect(() => {
    getInvoiceNos();
    getLeadNos();
    getClientNos();
  }, []);

  const fetchFollowUps = async (leadId) => {
    try {
      const response = await get(`lead/followup`);
      setFollowUpData(response.data || []);
    } catch (err) {
      console.error('Error loading followups:', err);
      toast.error('Unable to fetch follow-up data');
    }
  };

  const handleopenAddFollowUp = (leadId) => {
    console.log(leadId);
    setAddFollowIndex(leadId);
    fetchFollowUps(leadId);
    setOpenAddFollowUp(true);
  };

  // console.log(leadColours);

  const leadStatusData = {
    type: 'donut',
    head: 'Lead Status',
    height: 320,
    series: [...leadCounts],
    // series: [],
    options: {
      labels: [...leadLabels],
      // labels: [],
      colors: [...leadColours],
      // colors: [],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  const referenceSourceData = {
    type: 'donut',
    head: 'References',
    height: 320,
    series: [...rleadCounts],
    options: {
      labels: [...rleadLabels],
      // colors: ['#29b6f6', '#8e24aa', '#43a047', '#ff7043', '#fdd835'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Customers` }
      }
    }
  };
  // --- existing datasets ---
  const invoiceDataFY = {
    title: 'Monthly Invoices (FY)',
    xLabels: [...chartInvoiceLabels],
    seriesData: [[...chartInvoice]],
    seriesLabelMap: { Invoice: 'Invoices' },
    colors: ['#1E88E5']
  };

  const clientDataFY = {
    title: 'Monthly Clients (FY)',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [[...clientmonthcount]],
    seriesLabelMap: { Client: 'Clients' },
    colors: ['#43A047']
  };

  const revenueDataFY = {
    title: 'Monthly Revenue (FY)',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [[...chartInvoiceMoney]],
    seriesLabelMap: { Revenue: 'Revenue' },
    colors: ['#FB8C00']
  };

  // map for easy access
  const chartOptions = {
    Invoice: invoiceDataFY,
    Client: clientDataFY,
    Revenue: revenueDataFY
  };

  // Merged financial year data
  const mergedDataFY = {
    title: 'Financial Year Overview',
    xLabels: invoiceDataFY.xLabels,
    seriesData: [invoiceDataFY.seriesData[0], clientDataFY.seriesData[0], revenueDataFY.seriesData[0]],
    seriesLabelMap: {
      Invoice: 'Invoices',
      Client: 'Clients',
      Revenue: 'Revenue'
    },
    colors: [invoiceDataFY.colors[0], clientDataFY.colors[0], revenueDataFY.colors[0]]
  };
  // console.log(filteredLeads);

  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={gridSpacing}>
      {/* Top Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={staff.length.toString()}
              secondary="Total Staff"
              color={theme.palette.error.main}
              footerData=""
              iconPrimary={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={client.length.toString()}
              secondary="Total Client"
              color={theme.palette.info.main}
              footerData=""
              iconPrimary={TrendingDownIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={leadtotal.toString()}
              secondary="Total Leads"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={MonetizationOnTwoTone}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={invoicetotal.toString()}
              secondary="Total Invoice"
              color={theme.palette.secondary.main}
              footerData=""
              iconPrimary={PersonIcon}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Follow-up Table */}
      <Grid item xs={12}>
        <Card sx={{ mt: 4, p: 3 }}>
          {/* Search Bar */}
          <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontSize={18} gutterBottom>
              Today's Lead Follow Up Details
            </Typography>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                placeholder="Search Your Data"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {[
                    'SN',
                    'Company Name',
                    'Contact Name',
                    'Contact Phone',
                    'Status',
                    'Follow Up Date & Time',
                    'Last Communication',
                    'Product',
                    'Assign To',
                    // 'Follow Up',
                    'Action'
                  ].map((head) => (
                    <TableCell key={head}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead, index) => {
                    const followup = lead.followups?.[lead.followups.length - 1];

                    const assignedName = lead.assignTo?.basicDetails
                      ? `${lead.assignTo.basicDetails.firstName || ''} ${lead.assignTo.basicDetails.lastName || ''}`.trim()
                      : 'N/A';

                    const contact = lead.contact?.[0];

                    return (
                      <TableRow key={lead._id || index}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>{lead.companyName}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>{contact?.name}</TableCell>
                        <TableCell>{contact?.phone}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: lead?.leadstatus?.colorCode || '#f5f5f5',
                              color: '#000000',
                              padding: '4px 10px',
                              borderRadius: '10px',
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              minWidth: '80px',
                              textAlign: 'center'
                            }}
                          >
                            {lead?.leadstatus?.LeadStatus || 'N/A'}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ minWidth: 200 }}>
                          {followup?.updatedAt ? followup.updatedAt.slice(0, 10) : 'N/A'}&nbsp; &nbsp; &nbsp;
                          {followup?.updatedAt
                            ? new Date(followup.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'N/A'}{' '}
                        </TableCell>
                        {/* <TableCell sx={{ minWidth: 80 }}>
                          {followup?.updatedAt
                            ? new Date(followup.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'N/A'}
                        </TableCell> */}

                        <TableCell sx={{ minWidth: 300 }}>{followup?.comment || 'N/A'}</TableCell>

                        <TableCell>{lead.productService?.subProductName || 'N/A'}</TableCell>
                        <TableCell sx={{ minWidth: 160 }}>{assignedName}</TableCell>
                        {/* <TableCell sx={{ minWidth: 150 }}>{followup?.updatedAt ? followup.updatedAt.slice(0, 10) : 'N/A'}</TableCell> */}
                        <TableCell>
                          {/* <Button variant="contained" color="primary" size="small" onClick={() => handleopenAddFollowUp(lead._id)}> */}
                          <IconButton onClick={() => handleopenAddFollowUp(lead._id)}>
                            <InfoIcon sx={{ color: 'primary.main' }} />
                          </IconButton>
                          {/* </Button> */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available in table
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Grid>

      <Grid
        item
        sx={{
          display: 'flex',
          flexDirection: 'row'
        }}
        xs={12}
      >
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} sm={6} xs={12}>
            <DepartmentOpdPieChart chartData={invoicePaymentStatusData} />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <DepartmentOpdPieChart chartData={leadStatusData} />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <DepartmentOpdPieChart chartData={referenceSourceData} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card spacing={gridSpacing} sx={{ p: 2 }}>
          {/* Dropdown to select chart */}
          <FormControl sx={{ mb: 2, minWidth: 200 }}>
            <InputLabel>Select Data</InputLabel>
            <Select value={selectedChart} label="Select Data" onChange={(e) => setSelectedChart(e.target.value)}>
              <MenuItem value="Invoice">Invoice</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
            </Select>
          </FormControl>

          <Dialog open={openAddFollowUp} onClose={handleInfoClose} maxWidth="lg" fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Follow-Up' : 'Add Follow-Up'}</DialogTitle>
            <Divider />
            <DialogContent>
              {addFollowIndex !== null && (
                <Box>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            name="followupDate"
                            value={form.followupDate || ''}
                            label="Follow Up Date"
                            type="date"
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            margin="dense"
                          />
                          <TextField
                            fullWidth
                            name="followupTime"
                            value={form.followupTime || ''}
                            label="Follow Up Time"
                            type="time"
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            margin="dense"
                          />
                          <TextField
                            fullWidth
                            select
                            name="leadstatus"
                            value={form.leadstatus || ''}
                            label="Leadstatus"
                            onChange={handleChange}
                            margin="dense"
                          >
                            {statusOptions.map((option) => (
                              <MenuItem key={option._id} value={option._id}>
                                {option.LeadStatus}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth
                            name="comment"
                            value={form.comment || ''}
                            label="Comment"
                            onChange={handleChange}
                            multiline
                            rows={5}
                            margin="dense"
                          />
                          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                            {isEditMode ? 'Update' : 'Submit'}
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Follow-Up History
                              </Typography>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Leadstatus</TableCell>
                                    <TableCell>Comments</TableCell>
                                    <TableCell>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {Array.isArray(followUpData) && followUpData.length > 0 ? (
                                    (followUpData.find((d) => String(d._id) === String(addFollowIndex))?.followups || [])
                                      .slice() // make a shallow copy
                                      .reverse()
                                      .map((data, index) => (
                                        <TableRow key={data._id || index}>
                                          <TableCell>{data.followupDate || 'N/A'}</TableCell>
                                          <TableCell>{data.followupTime || 'N/A'}</TableCell>
                                          <TableCell>
                                            {statusOptions.find((opt) => opt._id === data.leadstatus)?.LeadStatus ||
                                              data.leadstatus?.LeadStatus ||
                                              'N/A'}
                                          </TableCell>
                                          <TableCell>{data.comment || 'N/A'}</TableCell>
                                          <TableCell>
                                            <Box display="flex" alignItems="center">
                                              <IconButton
                                                onClick={() =>
                                                  handleEditFollowUp(data._id, {
                                                    followupDate: data.followupDate,
                                                    followupTime: data.followupTime,
                                                    leadstatus: data.leadstatus?._id || data.leadstatus,
                                                    comment: data.comment
                                                  })
                                                }
                                              >
                                                <Edit color="primary" />
                                              </IconButton>
                                              <IconButton onClick={() => handleDeleteFollowUp(data._id)}>
                                                <Delete color="error" />
                                              </IconButton>
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} align="center">
                                        No follow-ups found
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleInfoClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <ReusableBarChart
            title={chartOptions[selectedChart].title}
            seriesData={chartOptions[selectedChart].seriesData}
            xLabels={chartOptions[selectedChart].xLabels}
            seriesLabelMap={chartOptions[selectedChart].seriesLabelMap}
            colors={chartOptions[selectedChart].colors}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Default;
