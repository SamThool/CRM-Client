import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router';
import * as Yup from 'yup';
import axios from 'axios';
import loginBackground from 'assets/images/bg_login.jpg';
import { useDispatch } from 'react-redux';
import { fetchUserRights } from '../../reduxSlices/authSlice';
import REACT_APP_API_URL from '../../api/api';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  const validationSchema = Yup.object({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      //todo:
      try {
        let response = null;

        // Try admin login
        try {
          const adminRes = await axios.post(`${REACT_APP_API_URL}admin/login`, values, { withCredentials: true });
          if (adminRes.data.role === 'admin') {
            response = adminRes;
            // console.log('✅ Admin login successful:', response);
            localStorage.setItem('companyId', response?.data?.adminId);
          } else {
            throw new Error('Not an admin');
          }
        } catch (adminError) {
          console.warn('❌ Admin login failed or not admin:', adminError.message);

          // Try super admin login
          try {
            const superRes = await axios.post(`${REACT_APP_API_URL}superAdmin/login`, values, { withCredentials: true });
            if (superRes.data.role === 'super-admin') {
              response = superRes;
              // console.log('✅ Super Admin login successful:', response);
            } else {
              throw new Error('Not a super admin');
            }
          } catch (superAdminError) {
            console.warn('❌ Super Admin login failed or not super-admin:', superAdminError.message);

            // Try staff login
            try {
              const staffRes = await axios.post(`${REACT_APP_API_URL}administrative/staff-login`, values, { withCredentials: true });
              if (staffRes.data.role === 'staff') {
                response = staffRes;
                // console.log('✅ Staff login successful:', response);
                localStorage.setItem('companyId', response?.data?.companyId);
                localStorage.setItem('empId', response?.data?.empId);
              } else {
                throw new Error('Not a staff user');
              }
            } catch (staffError) {
              console.error('❌ Staff login failed:', staffError.response?.data || staffError.message);
              throw new Error('Invalid login credentials');
            }
          }
        }

        if (!response) throw new Error('Login failed. Please try again!');
        // console.log(response);
        const data = response.data;
        const role = data.role;
        const token = data.token;

        if (!token || !role) throw new Error('Invalid login response');

        // Store token
        localStorage.setItem('token', token);
        // localStorage.setItem('companyId', data.adminId);
        // when you set the company in localStorage
        localStorage.setItem('company', JSON.stringify(data));

        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        expirationDate.setHours(0, 0, 0, 0);
        // document.cookie = `hmsToken=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
        const secureCookie = location.protocol === 'https:' ? 'Secure; SameSite=None;' : 'SameSite=Lax;';
        document.cookie = `hmsToken=${token}; expires=${expirationDate.toUTCString()}; path=/; ${secureCookie}`;

        // Handle user info
        let loginName = '';
        let loginEmail = '';
        let id = '';
        let refId = '';
        let loginData = {};
        let systemRight = [];

        if (role === 'admin') {
          loginName = data.login?.Name || '';
          loginEmail = data.login?.Email || '';
          id = data.adminId || data.login?._id || '';
          loginData = data.login || {};

          refId = data.login?.refId || ''; // Use adminId as refId
          // console.log('🔍 data.login.refId:', refId);
          localStorage.setItem('refId', JSON.stringify(refId));

          localStorage.setItem('departmentName', data.departmentName || '');
          localStorage.setItem('departmentId', data.departmentId || '');
          localStorage.setItem('empCode', data.empCode || '');
        } else if (role === 'super-admin') {
          loginName = 'Super Admin';
          loginEmail = data.email || '';
          id = data.userId || '';
          loginData = { name: 'Super Admin' };

          // No refId/systemRight needed
        } else if (role === 'staff') {
          loginName = data.name || '';
          loginEmail = data.email || '';
          id = data.staffId || data.login?._id || '';
          loginData = data.login || {};

          // ✅ Handle refId (string or object)
          if (typeof data.login?.refId === 'object') {
            refId = data.login.refId._id || '';
          } else {
            refId = data.login?.refId || '';
          }

          localStorage.setItem('refId', JSON.stringify(refId));
          localStorage.setItem('systemRight', JSON.stringify(data.systemRight || []));
          localStorage.setItem('departmentName', data.departmentName || '');
          localStorage.setItem('departmentId', data.departmentId || '');
          localStorage.setItem('empCode', data.empCode || '');
        }

        localStorage.setItem('loginName', loginName);
        localStorage.setItem('loginEmail', loginEmail);
        localStorage.setItem('Id', id);
        localStorage.setItem('loginRole', role);
        localStorage.setItem('loginData', JSON.stringify(loginData));

        // localStorage.setItem('refId', refId);
        // localStorage.setItem('refId', JSON.stringify(refId));
        const idr = typeof refId === 'object' ? refId._id : refId;
        // localStorage.setItem('refId', idr);
        // localStorage.setItem('refId', typeof idr === 'object' ? JSON.stringify(idr) : idr);
        localStorage.setItem('refId', JSON.stringify(idr)); // ✅ Always save as string

        localStorage.setItem('loginRole', role);
        localStorage.setItem('loginData', JSON.stringify(loginData));

        // console.log('Token:', token);
        // console.log('Role:', role);
        // console.log('ID:', id);
        // console.log('✅ RefID:', refId);
        // console.log('✅ loginData:', loginData);
        // console.log('Cookies after login:', document.cookie);

        // Navigate
        sessionStorage.removeItem('alreadyRedirected');
        if (role === 'admin' || role === 'staff') {
          // console.log('✅ Navigating to change-password for:', role);
          // console.log('✅ About to navigate');
          // console.log('Role:', role);
          // console.log('Current Path:', window.location.pathname);
          // console.log('Login Token in LocalStorage:', localStorage.getItem('token'));
          // console.log('Login Cookie:', document.cookie);

          navigate('/');
        } else {
          // console.log('Cookies:', document.cookie);
          // console.log('LocalStorage token:', localStorage.getItem('token'));
          navigate('/');
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || error.response?.data?.msg || error.message || 'Something went wrong. Please try again later.';
        alert(errorMsg);
      }
    }
  });
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  //todo: new code
  useEffect(() => {
    setChecking(false); // only for initial render
  }, []);

  if (checking) {
    // console.log('⏳ Still checking auth state...');
    return null;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        minHeight: '100vh'
      }}
    >
      <Grid item xs={11} sm={7} md={6} lg={4}>
        <Card
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            maxWidth: '475px',
            margin: '24px auto',
            background: 'transparent',
            backdropFilter: 'blur(50px)'
          }}
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }} style={{ width: '100%' }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container direction="column" spacing={4} justifyContent="center">
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography color="textPrimary" gutterBottom variant="h2">
                    Login
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    To keep connected with us.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button variant="text" color="secondary" size="small" onClick={() => navigate('/forgot-password')}>
                    Forgot Password?
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
