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
  Card
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ReportCard from './ReportCard';
import { gridSpacing } from 'config.js';
import { get } from '../../../api/api.js';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import DepartmentOpdPieChart from '../Charts/PieChart/DepartmentOPD';
import { head } from 'lodash';
import ReusableBarChart from '../Charts/BarCharts/ReusbaleBarChart';

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

  const [doctorOpdData, setDoctorOpdData] = useState(inputData);
  const [leads, setLeads] = useState([]);
  const [client, setclient] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');

  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [productCategories, setProductCategories] = useState([]);

  const handleDepartmentChange = (value) => {
    const filteredData = inputData?.filter((d) => d.department === value);
    setDoctorOpdData(filteredData ?? []);
  };

  const [staff, setStaff] = useState([]);

  const [invoice, setinvoice] = useState([]);

  const fetchStaff = async () => {
    try {
      const response = await get('/administrative');
      setStaff(response.data || []);
      console.log('Fetched staff:', response.data);
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
        console.log('filterdata', filteredData.length);
        console.log('nongst:', nonGstData.length);

        console.log('Fetched invoice:', response.data);
        setinvoicetotal(filteredData.length + nonGstData.length);
        console.log('total invoice', invoicetotal);
      }
    } catch (error) {
      console.error('Error fetching  invoice:', error);
    }
  };

  useEffect(() => {
    fetchinvoice();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await get('typeOfClient');
      setclient(response.data || []);
      console.log(response.data.length);
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
      setLeads(response.data || []);
      console.log('lead data', response.data);
      console.log('leadtotal', response.data.length);

      setleadtotal(response.data.length);
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

  const getLeadStatusColor = (leadstatus) => {
    if (!leadstatus) return '#9e9e9e';
    // leadstatus can be populated object or string id
    const statusObj = typeof leadstatus === 'object' ? leadstatus : statusOptions.find((s) => s._id === leadstatus);
    return statusObj?.colorCode || '#9e9e9e';
  };

  const invoicePaymentStatusData = {
    type: 'donut',
    head: 'Invoice Payment Status',
    height: 320,
    series: [40, 15, 20], // counts
    options: {
      labels: ['Paid', 'Partially Paid', 'Unpaid'],
      colors: ['#4caf50', '#ff9800', '#f44336'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Invoices` }
      }
    }
  };
  const leadStatusData = {
    type: 'donut',
    head: 'Lead Status',
    height: 320,
    series: [25, 18, 12, 8, 15],
    options: {
      labels: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'],
      colors: ['#42a5f5', '#ab47bc', '#26a69a', '#ef5350', '#66bb6a'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  const referenceSourceData = {
    type: 'donut',
    head: 'Refferences',
    height: 320,
    series: [30, 20, 25, 10, 15],
    options: {
      labels: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Walk-in'],
      colors: ['#29b6f6', '#8e24aa', '#43a047', '#ff7043', '#fdd835'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Customers` }
      }
    }
  };
  // Labels for the X-axis (e.g., months)
  const invoiceData = {
    title: 'Monthly Invoices',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    seriesData: [
      [120, 150, 170, 140, 180, 200] // invoices per month
    ],
    seriesLabelMap: { Invoice: 'Invoices' },
    colors: ['#1E88E5'] // bright blue
  };

  const clientData = {
    title: 'Monthly Clients',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    seriesData: [
      [80, 100, 90, 120, 110, 130] // clients acquired per month
    ],
    seriesLabelMap: { Client: 'Clients' },
    colors: ['#43A047'] // bright green
  };

  const revenueData = {
    title: 'Monthly Revenue',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    seriesData: [
      [5000, 7000, 6500, 8000, 7200, 9000] // revenue per month
    ],
    seriesLabelMap: { Revenue: 'Revenue' },
    colors: ['#FB8C00'] // bright orange
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Top Summary Cards */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={staff.length}
              secondary="Total Staff"
              color={theme.palette.error.main}
              footerData=""
              iconPrimary={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={client.length}
              secondary="Total Client"
              color={theme.palette.info.main}
              footerData=""
              iconPrimary={TrendingDownIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={leadtotal}
              secondary="Total Leads"
              color={theme.palette.warning.main}
              footerData=""
              iconPrimary={MonetizationOnTwoTone}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={invoicetotal}
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
          {/* Top Row: Title + Filters */}
          <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            {/* Title */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Today's Lead Follow Up Details
              </Typography>
            </Grid>

            {/* Filters */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Staff</InputLabel>
                    <Select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      {staff.map((person, idx) => {
                        const fullName = `${person?.basicDetails?.firstName || ''} ${person?.basicDetails?.lastName || ''}`.trim();
                        return (
                          <MenuItem key={idx} value={fullName}>
                            {fullName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Product</InputLabel>
                    <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      {productCategories.map((product, idx) => (
                        <MenuItem key={idx} value={product.productName}>
                          {product.productName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Search Bar */}
          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
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
                  {['SN', 'Name', 'Status', 'Date', 'Time', 'Last Communication', 'Product/Service', 'Assign To', 'Follow Up'].map(
                    (head) => (
                      <TableCell key={head}>{head}</TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, index) => {
                    const followup = lead.followups?.[0]; // Access first follow-up

                    return (
                      <TableRow key={lead._id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {lead.firstName} {lead.lastName}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              backgroundColor: getLeadStatusColor(lead.leadstatus),
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
                            {lead.leadstatus?.LeadStatus || statusOptions.find((opt) => opt._id === lead.leadstatus)?.LeadStatus || 'N/A'}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ minWidth: 120 }}>{followup?.followupDate || 'N/A'}</TableCell>
                        <TableCell>{followup?.followupTime || 'N/A'}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>{followup?.comment || 'N/A'}</TableCell>

                        <TableCell>{lead.productService?.productName || 'N/A'}</TableCell>
                        <TableCell>
                          {lead.assignTo?.basicDetails?.firstName || lead.assignTo?.basicDetails?.lastName
                            ? `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim()
                            : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}> {followup?.updatedAt ? followup.updatedAt.slice(0, 10) : 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No data available in table
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...clientData} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...invoiceData} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...revenueData} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Default;
