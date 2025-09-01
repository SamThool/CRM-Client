import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { convertToWords } from 'utils/currentDate';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { resetPrintDataForAdvanceOPDReceipt, setCloseBillingModal, setInitialStates } from 'reduxSlices/opdBillingStates';
import { get } from 'api/api';
import mirailogo from '../../assets/images/mirai.png';

const AdvanceReciept = ({ closeModal, invoiceData }) => {
  console.log('Receipt Component Invoice Data:', invoiceData);
  const { billingData } = useSelector((state) => state.opdBilling);
  const { PrintDataForAdvanceOPDReceipt } = useSelector((state) => state.opdBillingStates);
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const dispatch = useDispatch();

  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });
  const { pathname } = useLocation();
  const [clientList, setClientList] = useState([]);

  const navigate = useNavigate();
  const handlePrint = () => {
    reactToPrint();
    setTimeout(() => {
      dispatch(setCloseBillingModal());
    }, 1000);
    // if (pathname !== '/confirm-patientForm') {
    //   navigate('/confirm-patientForm');
    // }
    dispatch(setInitialStates());
  };

  function handleSave() {
    toast.success('Saved Successfully');
    dispatch(setCloseBillingModal());
    dispatch(resetPrintDataForAdvanceOPDReceipt());
    dispatch(setInitialStates());
    closeModal()

    // navigate('/confirm-patientForm');
  }

  // for adding header  and toggling it
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const toggleHeader = () => {
    setIsHeaderOpen(!isHeaderOpen);
  };
  const fetchClient = async () => {
    try {
      console.log('Fetching client data...');
      const id = localStorage.getItem('refId');
      const response = await get(`clientRegistration/${id}`);
      console.log('response is', response);
      if (response.status === 'true' && response.data) {
        setClientList(response.data);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);
  return (
    <>
      <Box>
        <Button
          onClick={toggleHeader}
          color="primary"
          size="small"
          sx={{
            mb: 0,
            mx: 6,
            my: 1,
            border: '1px solid', // Default theme color (primary.main)
            borderColor: 'primary.main'
          }}
        >
          {isHeaderOpen ? 'Hide Header' : 'Show Header'}
        </Button>
        <div
          ref={contentRef}
          style={{
            padding: '0.5rem 4rem', // 2rem top/bottom (y), 4rem left/right (x)
            borderRadius: '0px'
          }}
        >
          {/* header information hospital name,logo and address */}
          {isHeaderOpen && (
            <Grid
              container
              spacing={1}
              sx={{
                marginBottom: 0, // Increased margin
                alignItems: 'center',
                //  paddingX: 2, // Added horizontal padding
                paddingY: 2 // Added horizontal padding
              }}
            >
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {/* Hospital Logo (Top) */}
                  <img
                    src={mirailogo}
                    alt="Hospital Logo"
                    style={{
                      maxHeight: '80px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      marginBottom: '2px' // Space between logo and text
                    }}
                  />

                  {/* Hospital Name (Bottom) */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#126078',
                      fontSize: '1rem'
                    }}
                  >
                    {hospitalData?.hospitalName}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                xs={8}
                sx={{
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5 // Slightly increased gap
                }}
              >
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                  <strong>Address :</strong> {clientList?.officeAddress}, {clientList?.city}, {clientList?.state} -{' '}
                  {clientList?.pincode}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                  <strong>Contact:</strong> {clientList?.officialPhoneNo} | <strong>Email:</strong> {clientList?.officialMailId}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '0.8rem' }}>
                  <strong>Website:</strong> {clientList?.website}
                </Typography>
              </Grid>
            </Grid>
          )}

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.25rem' }}>
              RECEIPT
            </Typography>
            <Box sx={{ backgroundColor: '#126078', paddingX: 1, paddingY: 0.5, borderRadius: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.875rem' }}>
                <strong>Reciept No :</strong> {invoiceData?.RecieptNo || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          <Grid container spacing={1} sx={{ marginBottom: 1 }}>
            {/* Column 1 - Patient Info */}
            <Grid item xs={3}>
              <Typography variant="body2" sx={{ display: 'flex', gap: '4px', color: '#555', fontSize: '0.75rem' }}>
                <strong>Client Name:</strong>
                {invoiceData?.clientName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Product/Service Name : </strong> {invoiceData?.products.map(item => item.product).join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>GST : </strong> {invoiceData?.clientGst || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Qty:</strong> {invoiceData?.products.length || 'N/A'}
              </Typography>

            </Grid>

            {/* Column 2 - Address & OPD Info */}
            <Grid item xs={3}>

              {/* <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Unit Price:</strong> {billingData?.uhid || 'N/A'}
              </Typography> */}
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Email:</strong> {invoiceData?.clientEmail || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Address:</strong> {invoiceData?.clientAddress || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>City:</strong> {invoiceData?.clientCity || 'N/A'}
              </Typography>

            </Grid>
            <Grid item xs={3}>

              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>State:</strong> {invoiceData?.clientState || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Country:</strong> {invoiceData?.clientCountry || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                <strong>Pincode:</strong> {invoiceData?.clientPincode || 'N/A'}
              </Typography>
            </Grid>

            {/* Column 3 - Department & Doctor */}
          </Grid>

          <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

          <TableContainer sx={{ marginBottom: '1rem' }}>
            <Table size="small">
              {' '}
              {/* Reducing table size to shrink spacing */}
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078', height: '30px' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Products</TableCell>
                  {/* <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Qty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Rate</TableCell> */}
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData?.products.length > 0 ? (
                  <>

                    <TableRow>
                      <TableCell sx={{ padding: '4px' }}>
                        {invoiceData?.products.map(item => item.product).join(', ')}
                      </TableCell>
                      {/* <TableCell sx={{ padding: '4px' }}>{item.description || '-'}</TableCell>
                        <TableCell sx={{ padding: '4px' }}>{item.quantity || 1}</TableCell>
                        <TableCell sx={{ padding: '4px' }}>{item.rate || 'N/A'}</TableCell> */}
                      <TableCell sx={{ padding: '4px' }}>
                        {invoiceData?.totalAmount || 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '8px' }}>
                        <Typography fontWeight={'bold'}>Payment Received: Rs {invoiceData?.status === 'paid' ? invoiceData?.paymentDetails?.paidAmount : 'N/A'}</Typography>
                        <Typography fontWeight={'bold'}>
                          In Words: {invoiceData.status === 'paid' ? convertToWords(invoiceData?.paymentDetails?.paidAmount) : 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ padding: '1rem' }}>
                      <Typography variant="body1" color="textSecondary">
                        No services selected to display.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ marginTop: '2rem', paddingTop: '1.5rem', width: '48%' }}>
                {/* <Typography variant="body1">
                  <strong>Authorized Signatury:</strong>
                </Typography> */}
                <Typography variant="body1">
                  <strong>Prepared By:</strong> {clientList?.clientName}
                </Typography>
                <Typography variant="body1">
                  <strong>Employee ID:</strong>{invoiceData?.clientId || 'N/A'}
                </Typography>

              </Box>

              <Box sx={{ marginTop: '0.5rem', width: '35%' }}>
                {' '}
                {/* Reduced width */}
                <Table size="small" sx={{ border: '1px solid #ddd', borderCollapse: 'collapse' }}>
                  <TableHead>
                    <TableRow sx={{ height: '28px' }}>
                      {' '}
                      {/* Reduced header row height */}
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Payment Mode
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 'bold', textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.9rem' }}
                      >
                        Transaction ID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ height: '25px' }}>
                      {' '}
                      {/* Reduced row height */}
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {invoiceData?.paymentDetails?.paymentMode || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', border: '1px solid #ddd', padding: '4px', fontSize: '0.85rem' }}>
                        {invoiceData?.paymentDetails?.transactionId || 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Box>

      <Box sx={{ marginTop: '2rem', padding: '30px' }}>
        <Button
          variant="contained"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            backgroundColor: '#126078',
            color: 'white',
            mr: 2
          }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            backgroundColor: '#126078',
            color: 'white',
            mr: 2
          }}
          onClick={handlePrint}
        >
          Save & Print
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            backgroundColor: '#126078',
            color: 'white'
          }}
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default AdvanceReciept;
