import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Typography, Card, CardContent, Stack, MenuItem, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { toast, ToastContainer } from 'react-toastify';
import { get, post, remove } from '../../../api/api.js';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Pipeline = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    staffName: '',
    productName: '',
    prospects: '',
    status: ''
  });
  const [draggedLead, setDraggedLead] = useState(null);

  // Fetch statuses
  const fetchLeadStatuses = async () => {
    try {
      const response = await get('leadStatus');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await get('lead');
      setLeads(response.data || []);
      setFilteredData(response.data || []); // Initialize filteredData with all leads
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeadStatuses();
    fetchLeads();
  }, []);

  // Apply filters when "Get" button is clicked
  const applyFilters = () => {
    const { staffName, productName, prospects, status } = filters;

    const filtered = leads.filter((lead) => {
      const leadStaff = `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.toLowerCase();
      const leadProduct = lead.productService?.productName?.toLowerCase() || '';
      const leadProspects = (lead.Client ? 'client' : lead.Prospect ? 'prospect' : 'new lead').toLowerCase();
      const leadStatus = typeof lead.leadstatus === 'object' ? lead.leadstatus?.LeadStatus?.toLowerCase() : lead.leadstatus?.toLowerCase();

      return (
        (!staffName || leadStaff.includes(staffName.toLowerCase())) &&
        (!productName || leadProduct.includes(productName.toLowerCase())) &&
        (!prospects || leadProspects === prospects.toLowerCase()) &&
        (!status || leadStatus === status.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  // Clear filters and reset the filteredData to all leads
  const handleReset = () => {
    setFilters({
      staffName: '',
      productName: '',
      prospects: '',
      status: ''
    });
    setFilteredData(leads);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Group leads by status id for display
  const groupedLeadsByStatus = Object.fromEntries(
    (data || []).map((status) => {
      const statusId = status._id;
      const matchingLeads = (filteredData || []).filter((lead) => {
        const leadStatusId = typeof lead.leadstatus === 'object' ? lead.leadstatus._id : lead.leadstatus;
        return leadStatusId === statusId;
      });
      return [statusId, matchingLeads];
    })
  );

  // Drag logic
  const onDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, statusId) => {
    e.preventDefault();
    if (!draggedLead) return;

    try {
      const newLead = {
        ...draggedLead,
        leadstatus: statusId
      };
      delete newLead._id;

      const response = await post('lead', newLead);
      if (response && response.data) {
        setLeads((prevLeads) => [...prevLeads, response.data]);
        setFilteredData((prevLeads) => [...prevLeads, response.data]);
        toast.success('Lead copied to new status successfully!');
      } else {
        toast.error('No data returned from server');
      }
    } catch (error) {
      toast.error('Failed to copy lead.');
      console.error(error);
    }

    setDraggedLead(null);
  };

  // Delete lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await remove(`lead/${leadId}`);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      setFilteredData((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      toast.success('Lead deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete lead.');
      console.error(error);
    }
  };

  function calculateTotalAmount(arr) {
    if (!Array.isArray(arr)) return 0;

    return arr.reduce((sum, item) => {
      const value = Number(item.projectValue) || 0; // convert string to number, fallback to 0
      return sum + value;
    }, 0);
  }

  return (
    <>
      <Breadcrumb title="Pipeline" className="breadcrumb">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Pipeline
        </Typography>
      </Breadcrumb>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box>
                <Grid container spacing={2}>
                  {/* Staff Name Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Staff Name
                    </Box>
                    <TextField select label="Staff Name" name="staffName" value={filters.staffName} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {[
                        ...new Set(
                          leads.map((lead) =>
                            `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim()
                          )
                        )
                      ]
                        .filter(Boolean)
                        .map((name, idx) => (
                          <MenuItem key={idx} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  {/* Product Name Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Product Name
                    </Box>
                    <TextField
                      select
                      label="Product"
                      name="productName"
                      value={filters.productName}
                      onChange={handleFilterChange}
                      fullWidth
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(leads.map((lead) => lead.productService?.productName).filter(Boolean))].map((product, idx) => (
                        <MenuItem key={idx} value={product}>
                          {product}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Prospects Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Prospects
                    </Box>
                    <TextField select label="Prospects" name="prospects" value={filters.prospects} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {/* Use lowercase values for consistency */}
                      {['client', 'prospect', 'new lead'].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Status Filter */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Box mb={1} fontWeight="bold" textTransform="uppercase">
                      Status
                    </Box>
                    <TextField select label="Status" name="status" value={filters.status} onChange={handleFilterChange} fullWidth>
                      <MenuItem value="">All</MenuItem>
                      {data?.map((s) => (
                        <MenuItem key={s._id} value={s.LeadStatus}>
                          {s.LeadStatus}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Buttons */}
                  <Grid item xs={12} sm={6} md={3} display="flex" alignItems="flex-end" gap={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ width: '60px', height: '40px' }}
                      onClick={applyFilters} // Trigger filtering
                    >
                      Get
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{
                        backgroundColor: 'red',
                        width: '60px',
                        height: '40px',
                        color: 'white',
                        borderColor: 'red',
                        '&:hover': {
                          backgroundColor: '#cc0000',
                          borderColor: '#cc0000'
                        }
                      }}
                      onClick={handleReset} // Reset filters
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ overflowX: 'auto', mt: 2 }}>
        <Stack direction="row" spacing={2}>
          {(data ? [...data].reverse() : []).map((status) => (
            <Box
              key={status._id}
              sx={{ minWidth: 340, maxWidth: 340, flexShrink: 0 }}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status._id)}
            >
              <Card sx={{ bgcolor: status.colorCode, display: 'flex', flexDirection: 'column', height: '900px' }}>
                <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderBottom: 1,
                      borderColor: 'divider',
                      color: '#003366',
                      mb: 1
                    }}
                  >
                    {status.LeadStatus} ( {groupedLeadsByStatus[status._id]?.length} Lead | INR{' '}
                    {calculateTotalAmount(groupedLeadsByStatus[status._id])})
                  </Typography>

                  {(groupedLeadsByStatus[status._id] || []).map((lead) => (
                    <Box
                      key={lead._id}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        backgroundColor: '#fff',
                        boxShadow: 2,
                        cursor: 'grab',
                        position: 'relative'
                      }}
                      draggable="true"
                      onDragStart={(e) => onDragStart(e, lead)}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteLead(lead._id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: 'red',
                          zIndex: 10,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)'
                          }
                        }}
                      >
                        {/* Delete icon if needed */}
                      </IconButton>

                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#006400', mb: 1, fontSize: '1.2rem' }}>
                        {lead.firstName} {lead.lastName}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>PRODUCT NAME:</strong> {lead.productService?.productName || 'N/A'}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>STAFF NAME:</strong>{' '}
                        {lead.assignTo?.basicDetails?.firstName || lead.assignTo?.basicDetails?.lastName
                          ? `${lead.assignTo?.basicDetails?.firstName || ''} ${lead.assignTo?.basicDetails?.lastName || ''}`.trim()
                          : 'N/A'}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>STATUS:</strong> {typeof lead.leadstatus === 'object' ? lead.leadstatus.LeadStatus : lead.leadstatus}
                      </Typography>

                      <Typography variant="body2" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MonetizationOnIcon sx={{ fontSize: '1rem', color: '#003366' }} />: ₹{lead.projectValue || 'N/A'}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.75rem' }}>
                        <span>Category : </span>
                        {lead.Client ? 'Client' : lead.Prospect ? 'Prospect' : 'New Lead' || 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>

      <ToastContainer />
    </>
  );
};

export default Pipeline;
