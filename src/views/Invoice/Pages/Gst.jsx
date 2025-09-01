import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel
} from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Add, ArrowBack, Save as SaveIcon, Edit, Delete, Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import value from 'assets/scss/_themes-vars.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, FormLabel, FormControl } from '@mui/material';
import { get, post } from 'api/api';
import index from 'layout/MainLayout/HospitalName';
import { currentDate } from 'utils/currentDate';

const Gst = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState());
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState();
  const [discountType, setDiscountType] = useState('');
  const [clientData, setClientData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  function initialFormState() {
    return {
      gstType: 'gst',
      clientId: '',
      clientName: '',
      RecieptNo: '',
      invoiceNumber: '',
      date: null,
      clientGst: '',
      clientEmail: '',
      clientAddress: '',
      clientPincode: '',
      clientState: '',
      clientCity: '',
      clientCountry: '',
      products: [
        {
          product: '',
          description: '',
          quantity: '',
          rate: '',
          productAmount: ''
        }
      ],
      subTotal: '',
      discount: '',
      totalAmount: '',
      roundUp: '',
      igstPercent: '',
      igstAmount: '',
      cgstIgstPercentage: '',
      cgstIgstAmount: '',
      sgstPercentage: '',
      sgstAmount: '',

      // banking details
      selectedBankId: '',
      nameOnBankAccount: '', // Bank holder's name
      bankAccountNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
      panCardNo: ''
    };
  }
  const [errors, setErrors] = useState({});

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success') {
        const { District, State, Country } = data[0].PostOffice[0];
        setForm((prevForm) => ({
          ...prevForm,
          clientCity: District || '',
          clientState: State || '',
          clientCountry: Country || ''
        }));
      } else {
        toast.error('Invalid pincode');
        setForm((prevForm) => ({
          ...prevForm,
          clientCity: '',
          clientState: '',
          clientCountry: ''
        }));
      }
    } catch (error) {
      toast.error('Error fetching pincode details');
      console.error('Error fetching pincode details:', error);
      setForm((prevForm) => ({
        ...prevForm,
        clientCity: '',
        clientState: '',
        clientCountry: ''
      }));
    }
  };

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  // 1️⃣ subtotal (always safe to recompute)
  const calculateSubtotal = (products) => products.reduce((acc, p) => acc + (parseFloat(p.productAmount) || 0), 0);

  // 2️⃣ discount amount (percentage | value)
  const calculateDiscountAmount = (subTotal, discountType, discount) => {
    const d = parseFloat(discount) || 0;
    if (!d) return 0;

    return discountType === 'percentage' ? (subTotal * d) / 100 : d;
  };

  // 3️⃣ called ONLY when discount* changes
  const applyDiscountAndTotal = (draft) => {
    const subTotal = calculateSubtotal(draft.products);
    const discountAmount = calculateDiscountAmount(subTotal, draft.discountType, draft.discount);

    draft.subTotal = subTotal.toFixed(2);
    draft.discountAmount = discountAmount.toFixed(2);
    draft.totalAmount = (subTotal - discountAmount).toFixed(2);
    /* roundUp untouched here */
  };

  // 4️⃣ called ONLY when tax % changes
  const applyTaxAndRound = (draft) => {
    const base = parseFloat(draft.totalAmount) || 0;

    const igst = (base * (parseFloat(draft.igstPercent) || 0)) / 100;
    const cgst = (base * (parseFloat(draft.cgstIgstPercentage) || 0)) / 100;
    const sgst = (base * (parseFloat(draft.sgstPercentage) || 0)) / 100;

    draft.igstAmount = igst.toFixed(2);
    draft.cgstIgstAmount = cgst.toFixed(2);
    draft.sgstAmount = sgst.toFixed(2);

    draft.roundUp = Math.round(base + igst + cgst + sgst);
    /* totalAmount untouched here */
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    // *** 2. PRODUCT-LEVEL fields ***
    if (index !== null) {
      setForm((prev) => {
        // Ensure `products` array exists and the index is valid
        const draft = structuredClone(prev);
        if (!draft.products || !draft.products[index]) {
          console.error(`Invalid product index: ${index}`);
          return prev; // Return previous state if invalid
        }

        draft.products[index][name] = value;

        // Auto-calculate `productAmount` if `quantity` or `rate` changes
        if (name === 'quantity' || name === 'rate') {
          const quantity = parseFloat(draft.products[index].quantity) || 0;
          const rate = parseFloat(draft.products[index].rate) || 0;
          draft.products[index].productAmount = quantity && rate ? (quantity * rate).toFixed(2) : '';
        }

        // Update `subTotal`
        draft.subTotal = calculateSubtotal(draft.products).toFixed(2);
        draft.totalAmount = calculateSubtotal(draft.products).toFixed(2);
        // ✅ Always update roundUp with 18% GST on totalAmount
        const gstPercent = 18;
        const gstAmount = (parseFloat(draft.totalAmount) || 0) * (gstPercent / 100);
        draft.roundUp = (parseFloat(draft.totalAmount) || 0) + gstAmount;
        return draft;
      });
      return;
    }

    // *** 3. TOP-LEVEL fields ***
    setForm((prev) => {
      const draft = { ...prev, [name]: value };

      // a) Discount-related → update `totalAmount`
      if (name === 'discount' || name === 'discountType') {
        if (!draft.discount || draft.discount === '0') {
          // No discount → total = subtotal
          draft.totalAmount = draft.subTotal;
        } else {
          // Discount entered → apply discount logic
          applyDiscountAndTotal(draft);
        }

        // ✅ Always update roundUp with 18% GST on totalAmount
        const gstPercent = 18;
        const gstAmount = (parseFloat(draft.totalAmount) || 0) * (gstPercent / 100);
        draft.roundUp = (parseFloat(draft.totalAmount) || 0) + gstAmount;
      }

      // b) Tax-related → update `roundUp`
      if (name === 'igstPercent' || name === 'cgstIgstPercentage' || name === 'sgstPercentage') {
        // Ensure `totalAmount` exists; if not, compute it once
        if (!draft.totalAmount) {
          if (!draft.discount || draft.discount === '0') {
            draft.totalAmount = draft.subTotal;
          } else {
            applyDiscountAndTotal(draft);
          }
          // ✅ Add 18% GST
          const gstPercent = 18; // fixed 18%
          const gstAmount = (parseFloat(draft.totalAmount) || 0) * (gstPercent / 100);
          draft.roundUp = (parseFloat(draft.totalAmount) || 0) + gstAmount;
        }
        applyTaxAndRound(draft);
      }

      return draft;
    });
  };

  const handleSubmit = async () => {
    console.log('gst form', form);
    const response = await post('invoiceRegistration', form);
    if (response.status === true) {
      console.log('response', response);
      toast.success('GST Invoice created successfully');
    } else {
      console.error(response.message);
      toast.error(response.message);
    }
    setOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.totalAmount) {
      newErrors.totalAmount = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.totalAmount)) {
      newErrors.totalAmount = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.totalAmount <= 0)) {
      newErrors.totalAmount = 'Invalid Amount';
    }

    if (!form.clientName) {
      newErrors.clientName = 'Client name is Required';
    }
    if (!form.date) {
      newErrors.date = 'Date is Required';
    }
    if (!form.clientGst) {
      newErrors.clientGst = 'Gst is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.clientGst)) {
      newErrors.clientGst = 'Please Enter a Proper Number';
    } else if (parseFloat(form.clientGst <= 0)) {
      newErrors.clientGst = 'Enter Positive Values';
    }
    if (!form.clientEmail) {
      newErrors.clientEmail = 'Email is Required';
    } else if (!form.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.clientEmail = 'Email is Invalid';
    }

    if (!form.clientAddress) newErrors.clientAddress = 'Address is Required';
    if (!form.clientPincode) {
      newErrors.clientPincode = 'Pincode is Required';
    } else if (!/^\d{6}$/.test(form.clientPincode)) {
      newErrors.clientPincode = 'Pincode must be a 6-digit number';
    }
    if (!form.clientState) newErrors.clientState = 'State is Required';
    if (!form.clientCity) newErrors.clientCity = 'City is Required';
    if (!form.clientCountry) newErrors.clientCountry = 'Country is Required';
    // check for products
    if (form.products.length === 0) {
      newErrors.products = 'At least one product is required';
    } else {
      form.products.forEach((product, index) => {
        if (!product.product) {
          newErrors[`product_${index}`] = 'Product is Required';
        }
        if (!product.description) {
          newErrors[`description_${index}`] = 'Description is Required';
        }
        if (!product.quantity) {
          newErrors[`quantity_${index}`] = 'Quantity is Required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(product.quantity)) {
          newErrors[`quantity_${index}`] = 'Please Enter a Proper Quantity';
        } else if (parseFloat(product.quantity <= 0)) {
          newErrors[`quantity_${index}`] = 'Invalid Quantity';
        }
        if (!product.rate) {
          newErrors[`rate_${index}`] = 'Rate is Required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(product.rate)) {
          newErrors[`rate_${index}`] = 'Please Enter a Proper Rate';
        } else if (parseFloat(product.rate <= 0)) {
          newErrors[`rate_${index}`] = 'Invalid Rate';
        }
        if (!product.productAmount) {
          newErrors[`productAmount_${index}`] = 'Product Amount is Required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(product.productAmount)) {
          newErrors[`productAmount_${index}`] = 'Please Enter a Proper Amount';
        } else if (parseFloat(product.productAmount <= 0)) {
          newErrors[`productAmount_${index}`] = 'Invalid Amount';
        }
      });
    }
    if (!form.subTotal) {
      newErrors.subTotal = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.subTotal)) {
      newErrors.subTotal = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.subTotal <= 0)) {
      newErrors.subTotal = 'Invalid Amount';
    }
    if (!form.discount) newErrors.discount = 'Required';
    if (!form.totalAmount) newErrors.totalAmount = 'Required';
    if (!form.roundUp) newErrors.roundUp = 'Required';
    // if (!form.igstAmount) newErrors.igstAmount = 'Required';
    // if (!form.igstPercent) newErrors.igstPercent = 'Required';
    // if(!form.cgstIgstAmount) newErrors.cgstIgstAmount ='Required';
    // if(!form.cgstIgstPercentage) newErrors.cgstIgstPercentage ='Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...form.products];
    updatedProducts[index][field] = value;
    setForm({ ...form, products: updatedProducts });
  };

  const handleAddProduct = (index) => {
    const newProduct = {
      product: '',
      description: '',
      quantity: '',
      rate: '',
      gstPercentage: '',
      productAmount: ''
    };

    const updatedProducts = [...form.products];
    updatedProducts.splice(index + 1, 0, newProduct);

    const updatedSubTotal = updatedProducts.reduce((acc, curr) => {
      const amt = parseFloat(curr.productAmount || 0);
      return acc + amt;
    }, 0);

    setForm({
      ...form,
      products: updatedProducts,
      subTotal: updatedSubTotal.toFixed(2),
      discount: '',
      totalAmount: '',
      roundUp: '',
      igstPercent: '',
      igstAmount: '',
      cgstIgstPercentage: '',
      cgstIgstAmount: '',
      sgstPercentage: '',
      sgstAmount: ''
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...form.products];
    updatedProducts.splice(index, 1);

    const updatedSubTotal = updatedProducts.reduce((acc, curr) => {
      const amount = parseFloat(curr.productAmount || 0);
      return acc + amount;
    }, 0);

    setForm({
      ...form,
      products: updatedProducts,
      subTotal: updatedSubTotal || '',
      discount: '',
      totalAmount: '',
      roundUp: '',
      igstPercent: '',
      igstAmount: '',
      cgstIgstPercentage: '',
      cgstIgstAmount: '',
      sgstPercentage: '',
      sgstAmount: ''
    });
  };

  useEffect(() => {
    setForm((pre) => ({ ...pre, date: new Date() }));
    const fetchClientDetails = async () => {
      const response = await get('admin-clientRegistration');
      if (response.status === 'true') {
        const filteredData = response.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
        console.log('gst response client is', filteredData);
        setClientData(filteredData);
      }
    };
    const fetchProductCategory = async () => {
      const response = await get('productOrServiceCategory');
      console.log('product category is', response);
      if (response.status === 'true') {
        setAllProducts(response.data);
      }
    };
    const fetchInvoiceNo = async () => {
      const response = await get('invoiceRegistration');
      if (response.status === true) {
        const GstData = response.invoices.filter((item) => item.gstType === 'gst');
        const all_invoice_no = GstData.map((item) => item.invoiceNumber?.trim());
        const all_reciept_no = GstData.map((item) => item.RecieptNo?.trim());

        // Extract numeric part of valid invoice numbers like #10001
        const validNumbers = all_invoice_no.filter((num) => /^#\d+$/.test(num)).map((num) => parseInt(num.replace('#', '')));

        // Extract numeric part of valid receipt numbers like REC0001
        const validRecieptNo = all_reciept_no
          .filter((num) => /^REC\d{4}$/.test(num)) // Matches "REC0001", "REC0023"
          .map((num) => parseInt(num.replace('REC', '')));

        // Calculate next invoice number
        let nextNumber;
        if (validNumbers.length === 0) {
          nextNumber = `#10001`;
        } else {
          const maxNumber = Math.max(...validNumbers);
          nextNumber = `#${maxNumber + 1}`;
        }

        // Calculate next receipt number
        let nextRecieptNo;
        if (validRecieptNo.length === 0) {
          nextRecieptNo = `REC0001`;
        } else {
          const maxReciept = Math.max(...validRecieptNo);
          const next = (maxReciept + 1).toString().padStart(4, '0'); // e.g., 24 → "0025"
          nextRecieptNo = `REC${next}`;
        }

        console.log('Next invoice number:', nextNumber);
        console.log('Next receipt number:', nextRecieptNo);

        // Update form state
        setForm((p) => ({
          ...p,
          invoiceNumber: nextNumber,
          RecieptNo: nextRecieptNo
        }));
      }
    };

    const fetchBankDetails = async () => {
      try {
        const response = await get('bankDetails');
        console.log('response bank details is', response);
        setBankOptions(response.data);
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchInvoiceNo();
    fetchProductCategory();
    fetchClientDetails();
    fetchBankDetails();
  }, []);

  return (
    <>
      {/* <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Non-GST
        </Typography>
      </Breadcrumb> */}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">GST</Typography>
          </Grid>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Client Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      label="Client Name"
                      name="clientId"
                      value={form.clientId}
                      onChange={(e) => {
                        const selectedClient = clientData.find((c) => c._id === e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          clientId: e.target.value,
                          clientName: selectedClient?.clientName || '',
                          clientGst: selectedClient?.gstNo || '',
                          clientEmail: selectedClient?.officialMailId || '',
                          clientAddress: selectedClient?.officeAddress || '',
                          clientPincode: selectedClient?.pincode || '',
                          clientState: selectedClient?.state || '',
                          clientCity: selectedClient?.city || '',
                          clientCountry: selectedClient?.country || ''
                        }));
                      }}
                      fullWidth
                      required
                      error={!!errors.clientId}
                      helperText={errors.clientId}
                    >
                      {clientData?.map((client, index) => (
                        <MenuItem key={index} value={client._id}>
                          {client.clientName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Invoice Number"
                      name="invoiceNumber"
                      value={form.invoiceNumber}
                      fullWidth
                      onChange={handleChange}
                      InputProps={{ readOnly: true }}
                      // InputLabelProps={{ shrink: true }}
                      // inputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={form.date}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            fullWidth: true
                          }
                        }}
                        renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {[
                    { label: 'GST', name: 'clientGst' },
                    { label: 'Email Id', name: 'clientEmail' },
                    { label: 'Address', name: 'clientAddress' },
                    { label: 'Pincode', name: 'clientPincode' },
                    { label: 'State', name: 'clientState' },
                    { label: 'City', name: 'clientCity' },
                    { label: 'Country', name: 'clientCountry' }
                  ].map((field) => (
                    <Grid item xs={12} md={field.name === 'clientAddress' ? 9 : 3} key={field.name}>
                      <TextField
                        label={field.label}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      Product Details
                    </Typography>
                  </Grid>

                  {form?.products?.map((productItem, index) => (
                    <Box
                      key={index}
                      container
                      margin={2}
                      borderRadius={2}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      sx={{ backgroundColor: '#E1F3F3' }}
                      padding={1}
                    >
                      <Grid key={index} container spacing={gridSpacing}>
                        <Grid item xs={12} md={2}>
                          <TextField
                            select
                            label="Product"
                            name="product"
                            value={form.products[index]?.product || ''}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors.product}
                            helperText={errors.product}
                          >
                            {allProducts.map((p, i) => (
                              <MenuItem key={i} value={p.productName}>
                                {p.productName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Description"
                            name="description"
                            value={form.products[index]?.description || ''}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Qty"
                            name="quantity"
                            value={form.products[index]?.quantity || ''}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Rate"
                            name="rate"
                            value={form.products[index]?.rate || ''}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          ></TextField>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Amount"
                            name="productAmount"
                            value={form.products[index]?.productAmount || ''}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                          <Button
                            size="small"
                            sx={{
                              padding: '3px', // Reduced padding
                              minWidth: '24px', // Set minimum width
                              height: '24px',
                              mr: '10px'
                            }}
                            onClick={() => handleAddProduct(index)}
                          >
                            <IconButton color="inherit">
                              <Add />
                            </IconButton>
                          </Button>
                          {form.products.length > 1 && (
                            <Button
                              size="small"
                              sx={{
                                padding: '3px', // Reduced padding
                                minWidth: '24px', // Set minimum width
                                height: '24px',
                                mr: '10px'
                              }}
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <IconButton color="error">
                                <Delete />
                              </IconButton>
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  ))}

                  {[
                    { label: 'Subtotal', name: 'subTotal' },
                    { label: 'Discount Type', name: 'discountType' },
                    { label: discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)', name: 'discount' },
                    { label: 'Total', name: 'totalAmount' },

                    { label: 'Round Up', name: 'roundUp' }
                  ].map((field) => (
                    <Grid item xs={12} md={2.4} key={field.name}>
                      {field.name === 'discountType' ? (
                        <FormControl fullWidth>
                          <InputLabel>Discount Type</InputLabel>
                          <Select
                            name="discountType"
                            value={discountType}
                            onChange={(e) => {
                              setDiscountType(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                discountType: e.target.value,
                                discount: '' // reset discount field
                              }));
                            }}
                          >
                            <MenuItem value="percentage">Percentage (%)</MenuItem>
                            <MenuItem value="value">Value (₹)</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          label={field.label}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!errors[field.name]}
                          helperText={errors[field.name]}
                        />
                      )}
                    </Grid>
                  ))}

                  <Grid mt={1} ml={3.6} xs={12} md={2}>
                    <RadioGroup row value={form.taxType} onChange={(e) => setSelectedValue(e.target.value)} name="taxType" sx={{ mt: 1 }}>
                      <FormControlLabel value="igst" control={<Radio />} label="IGST" />
                      <FormControlLabel value="sgst_cgst" control={<Radio />} label="SGST/CGST" />
                    </RadioGroup>
                  </Grid>
                  {selectedValue === 'igst' && (
                    <>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="IGST(18%"
                          name="igstPercent"
                          value={form.igstPercent}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={2.6}>
                        <TextField
                          label="IGST Amount"
                          name="igstAmount"
                          value={form.igstAmount}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                    </>
                  )}
                  {selectedValue === 'sgst_cgst' && (
                    <>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="CGST/IGST(9%)"
                          name="cgstIgstPercentage"
                          value={form.cgstIgstPercentage}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={2.6}>
                        <TextField
                          label="CGST/IGST Amount"
                          name="cgstIgstAmount"
                          value={form.cgstIgstAmount}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="SGST(9%)"
                          name="sgstPercentage"
                          value={form.sgstPercentage}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="SGST Amount"
                          name="sgstAmount"
                          value={form.sgstAmount}
                          onChange={handleChange}
                          fullWidth
                          required
                        ></TextField>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      Bank Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Bank</InputLabel>
                      <Select
                        label="Select Bank"
                        onChange={(e) => {
                          const selectedBank = bankOptions.find((bank) => bank._id === e.target.value);
                          if (selectedBank) {
                            setForm((prev) => ({
                              ...prev,
                              selectedBankId: selectedBank._id,
                              nameOnBankAccount: selectedBank.accountName,
                              bankAccountNumber: selectedBank.accountNumber,
                              bankName: selectedBank.bankName,
                              branchName: selectedBank.branchName,
                              ifscCode: selectedBank.IFSCcode,
                              panCardNo: selectedBank.PanNo
                            }));
                          }
                        }}
                      >
                        {bankOptions?.map((bank) => (
                          <MenuItem key={bank._id} value={bank._id}>
                            {bank.accountName} - {bank.bankName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Name on Bank Account"
                      name="nameOnBankAccount"
                      fullWidth
                      value={form.nameOnBankAccount}
                      error={!!errors.nameOnBankAccount}
                      helperText={errors.nameOnBankAccount}
                      placeholder="Bank holder's name"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      value={form.bankAccountNumber}
                      fullWidth
                      error={!!errors.bankAccountNumber}
                      helperText={errors.bankAccountNumber}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Bank Name"
                      name="bankName"
                      value={form.bankName}
                      fullWidth
                      error={!!errors.bankName}
                      helperText={errors.bankName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Branch Name"
                      name="branchName"
                      value={form.branchName}
                      fullWidth
                      error={!!errors.branchName}
                      helperText={errors.branchName}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="IFSC Code"
                      name="ifscCode"
                      value={form.ifscCode}
                      fullWidth
                      error={!!errors.ifscCode}
                      helperText={errors.ifscCode}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="PAN Card Number"
                      name="panCardNo"
                      value={form.panCardNo}
                      fullWidth
                      error={!!errors.panCardNo}
                      helperText={errors.panCardNo}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Gst;
