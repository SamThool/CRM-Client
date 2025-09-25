import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// import logo from '../../../assets/images/iqubx_logo.png';
import logo from '../../../assets/images/mirailogo.png';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CurrentDate from './CureentDateSection';
import { get } from 'api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setHospitalData } from 'reduxSlices/hospitalData';
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
import value from 'assets/scss/_themes-vars.module.scss';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { hospitalData } = useSelector((state) => state.hospitalData);
  const loginData = JSON.parse(localStorage.getItem('loginData')) || {};

  const [secondLogo, setSecondLogo] = useState(null);

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;

    // normalize slashes
    const normalized = logoPath.replace(/\\/g, '/');

    // replace public/images with uploads
    const urlPath = normalized.replace('public/images', 'uploads');

    // prepend backend root URL, not /api/
    // console.log(`http://localhost:5050/api/${urlPath}`);

    return `http://localhost:5050/api/${urlPath}`;
  };

  useEffect(() => {
    const fetchSecondLogo = async () => {
      try {
        const rawRefId = localStorage.getItem('refId');

        let parsedRefId;
        try {
          parsedRefId = JSON.parse(rawRefId);
        } catch (e) {
          parsedRefId = rawRefId;
        }

        if (!parsedRefId) return;

        const response = await get(`companySettings/${parsedRefId}/logo`); // your API endpoint
        // console.log('------------------------------------------', response);

        const logoUrl = response?.logo; // adjust based on your API response

        if (logoUrl) {
          setSecondLogo(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching company logo:', error);
      }
    };

    fetchSecondLogo();
  }, []);

  // const fetchHospitalData = async () => {
  //   const response = await get('company-setup');
  //   dispatch(setHospitalData(response.data[0]));
  // };

  useEffect(() => {
    // fetchHospitalData();
  }, []);
  return (
    <>
      <Box width={drawerWidth} sx={{ zIndex: 1201 }}>
        {/* <Grid container justifyContent="space-between" alignItems="center"> */}
        <Grid sx={{ display: 'flex', width: '100%' }}>
          <Grid item>
            <IconButton edge="start" sx={{ mr: theme.spacing(1.25) }} aria-label="open drawer" onClick={drawerToggle} size="large">
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
          <Box sx={{ display: 'flex', backgroundColor: 'none' }} mt={0.5}>
            <Box sx={{ display: 'flex', ml: 2, gap: 2 }}>
              {/* First Logo */}
              <Box
                sx={{
                  width: '140px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',

                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
              >
                <img src={logo} alt="LOGO" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </Box>

              {/* Second Logo */}
              {secondLogo && (
                <Box
                  sx={{
                    width: '140px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <img src={getLogoUrl(secondLogo)} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Box>
              )}
            </Box>
            {/* <Box sx={{ display: 'flex', marginLeft: '6rem' }}>
              <Grid item sx={{ display: 'flex' }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                ></div>
              </Grid>
            </Box> */}
          </Box>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      {/* {data?.role === 'Administrative' ? <CurrentDate /> : <SearchSection theme="light" />} */}
      <Box
        sx={{
          display: { md: 'flex', xs: 'none' }, // Only visible on xs and sm screens
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '12px', sm: '14px' },
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '1px',
            lineHeight: '1.5'
          }}
        >
          {`${loginData?.name || 'N/A'}  `}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        </Typography>
        <CurrentDate />
      </Box>

      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
