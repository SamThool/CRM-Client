import React, { useEffect, useState } from 'react';
import { get } from 'api/api';
import { toast } from 'react-toastify';

import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const columns = [
  'Id',
  'Action',
  'Organization',
  'Product',
  'Status',
  'Lead Type',
  'Last Communication',
  'Follow up date',
  'Phone Number',
  'City',
  'Reference',
  'Assign To',
  'Created Date',
  'Day Count'
];

const formatDate = (d) => {
  if (!d) return 'N/A';
  const date = new Date(d);
  return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
};

const daysSince = (d) => {
  if (!d) return 'N/A';
  const diff = Date.now() - new Date(d).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const ParametricReport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  async function getLeadData() {
    try {
      const loginRole = localStorage.getItem('loginRole');
      const employeeId = localStorage.getItem('empId');

      let url = 'lead';
      if (loginRole === 'staff' && employeeId) {
        url += `/${employeeId}`;
      }

      const response = await get(url);
      console.log(response.data);
      // backend sometimes returns { success, data } or just array — be defensive
      const payload = response?.data?.data ?? response?.data ?? response ?? [];
      setData(Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error('Failed to fetch lead data');
      console.error(error);
    }
  }

  useEffect(() => {
    getLeadData();
  }, []);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const openDetails = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const closeDetails = () => {
    setSelectedRow(null);
    setOpenDialog(false);
  };

  // basic search by full name or product
  const filtered = data.filter((lead) => {
    if (!search) return true;
    const name = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    const product = (lead.productService?.productName || '').toLowerCase();
    return name.includes(search.toLowerCase()) || product.includes(search.toLowerCase());
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item>
                <Typography variant="h6">Parametric Lead Report</Typography>
              </Grid>
              <Grid item>
                <TextField size="small" placeholder="Search name or product" value={search} onChange={(e) => setSearch(e.target.value)} />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            <TableContainer component={Paper} sx={{ maxHeight: '65vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.length > 0 ? (
                    paginated.map((lead, idx) => {
                      const assignName = lead.assignTo
                        ? `${lead.assignTo.basicDetails?.firstName || ''} ${lead.assignTo.basicDetails?.lastName || ''}`.trim()
                        : 'N/A';
                      const lastComm = lead.lastCommunication || (lead.followups?.[0]?.comment ?? 'N/A');
                      const followupDate = lead.followups?.[0]?.followupDate ?? lead.followUpDate ?? null;

                      return (
                        <TableRow key={lead._id || idx} hover>
                          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell>
                            <Button size="small" onClick={() => openDetails(lead)}>
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{lead?.Prospect?.companyName || lead?.Client?.clientName || lead?.newCompanyName || 'N/A'}</TableCell>
                          <TableCell>{lead.productService?.productName || 'N/A'}</TableCell>
                          <TableCell
                            sx={{
                              backgroundColor: lead.leadstatus?.colorCode || 'transparent',
                              color: '#fff',
                              borderRadius: '8px'
                            }}
                          >
                            {lead.leadstatus?.LeadStatus || 'N/A'}
                          </TableCell>

                          <TableCell>{lead.leadType?.LeadType || 'N/A'}</TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 300,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}
                          >
                            {lastComm}
                          </TableCell>

                          <TableCell>{followupDate ? formatDate(followupDate) : 'N/A'}</TableCell>
                          <TableCell>{lead.phoneNo || 'N/A'}</TableCell>
                          <TableCell>{lead.city || 'N/A'}</TableCell>
                          <TableCell>{lead.reference?.LeadReference || 'N/A'}</TableCell>
                          <TableCell>{assignName || 'N/A'}</TableCell>
                          <TableCell>{lead.createdAt ? formatDate(lead.createdAt) : 'N/A'}</TableCell>
                          <TableCell>{lead.createdAt ? daysSince(lead.createdAt) : 'N/A'}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={closeDetails}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 6, backgroundColor: '#fafafa' }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          Lead Details
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Email / Phone / Assigned To */}
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1 }}>{selectedRow?.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography sx={{ bgcolor: '#f3e5f5', p: 1, borderRadius: 1 }}>{selectedRow?.phoneNo}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned To
              </Typography>
              <Typography sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 1 }}>
                {selectedRow?.assignTo?.basicDetails?.firstName} {selectedRow?.assignTo?.basicDetails?.lastName}
              </Typography>
            </Grid>

            {/* Company / Product */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Company & Product
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Company
              </Typography>
              <Typography>{selectedRow?.Prospect?.companyName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Product
              </Typography>
              <Typography>{selectedRow?.productService?.productName}</Typography>
            </Grid>

            {/* Lead Info */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Lead Info
              </Typography>
              <Divider sx={{ mb: 1 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography
                sx={{
                  bgcolor: selectedRow?.leadstatus?.colorCode || '#eeeeee',
                  color: 'white',
                  fontWeight: 'bold',
                  p: 1,
                  borderRadius: 1,
                  display: 'inline-block'
                }}
              >
                {selectedRow?.leadstatus?.LeadStatus}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography sx={{ bgcolor: '#ede7f6', p: 1, borderRadius: 1 }}>{selectedRow?.leadType?.LeadType}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
                {`${selectedRow?.address}, ${selectedRow?.city}, ${selectedRow?.state}, ${selectedRow?.country} - ${selectedRow?.pincode}`}
              </Typography>
            </Grid>

            {/* Contacts */}
            {selectedRow?.contact?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Contacts
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Table
                  size="small"
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& td, & th': { border: '1px solid #eee' }
                  }}
                >
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Phone</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRow?.contact.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}

            {/* Followups */}
            {selectedRow?.followups?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Followups
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Table
                  size="small"
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& td, & th': { border: '1px solid #eee' }
                  }}
                >
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRow?.followups.map((f) => (
                      <TableRow key={f._id}>
                        <TableCell>{f.followupDate}</TableCell>
                        <TableCell>{f.followupTime}</TableCell>
                        <TableCell>{f.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
          <Button onClick={closeDetails} variant="contained" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ParametricReport;
