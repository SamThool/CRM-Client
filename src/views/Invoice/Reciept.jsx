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
    closeModal();

    // navigate('/confirm-patientForm');
  }

  // for adding header  and toggling it
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const toggleHeader = () => {
    setIsHeaderOpen(!isHeaderOpen);
  };

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
            border: '1px solid',
            borderColor: 'primary.main'
          }}
        >
          {isHeaderOpen ? 'Hide Header' : 'Show Header'}
        </Button>

        {/* Loop over history and render one receipt for each */}
        {invoiceData?.history?.length > 0 ? (
          invoiceData.history.map((payment, index) => (
            <div
              key={index}
              ref={contentRef}
              style={{
                padding: '0.5rem 4rem',
                borderRadius: '0px',
                marginBottom: '3rem', // space between receipts
                border: '1px dashed #ccc'
              }}
            >
              {/* Header Section */}
              {isHeaderOpen && (
                <Grid container spacing={1} sx={{ marginBottom: 0, alignItems: 'center', paddingY: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <img
                        src={mirailogo}
                        alt="Hospital Logo"
                        style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', marginBottom: '2px' }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#126078', fontSize: '1rem' }}>
                        {hospitalData?.hospitalName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={8} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                    <strong>Receipt No :</strong> {invoiceData?.RecieptNo || 'N/A'}-{index + 1}
                  </Typography>
                </Box>
              </Box>

              <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

              {/* Client Info */}
              <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                <Grid item xs={3}>
                  <Typography variant="body2" sx={{ display: 'flex', gap: '4px', color: '#555', fontSize: '0.75rem' }}>
                    <strong>Client Name:</strong> {invoiceData?.clientName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                    <strong>Product/Service:</strong> {invoiceData?.products.map((item) => item.product).join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                    <strong>GST:</strong> {invoiceData?.clientGst || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                    <strong>Email:</strong> {invoiceData?.clientEmail || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontSize: '0.75rem' }}>
                    <strong>Address:</strong> {invoiceData?.clientAddress || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <hr style={{ borderColor: '#ddd', marginBottom: '0.5rem' }} />

              {/* Payment Details */}
              <TableContainer sx={{ marginBottom: '1rem' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#126078', height: '30px' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Products</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', padding: '5px' }}>Paid Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ padding: '4px' }}>{invoiceData?.products.map((item) => item.product).join(', ')}</TableCell>
                      <TableCell sx={{ padding: '4px' }}>Rs {payment?.paidAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '8px' }}>
                        <Typography fontWeight={'bold'}>In Words: {convertToWords(payment?.paidAmount)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Payment Mode */}
              <Table size="small" sx={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '50%', marginTop: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Payment Mode</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Transaction ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }}>{payment?.paymentMode || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{payment?.transactionId || 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 3 }}>No Payment History Available</Typography>
        )}
      </Box>

      <Box sx={{ marginTop: '2rem', padding: '30px' }}>
        <Button
          variant="contained"
          sx={{ fontSize: '16px', fontWeight: 'bold', boxShadow: 2, backgroundColor: '#126078', color: 'white', mr: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          sx={{ fontSize: '16px', fontWeight: 'bold', boxShadow: 2, backgroundColor: '#126078', color: 'white', mr: 2 }}
          onClick={handlePrint}
        >
          Save & Print
        </Button>
        <Button
          variant="contained"
          sx={{ fontSize: '16px', fontWeight: 'bold', boxShadow: 2, backgroundColor: '#126078', color: 'white' }}
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default AdvanceReciept;
