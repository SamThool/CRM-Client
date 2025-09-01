import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import logo from '../../../assets/images/iqubx_logo.png';
import mirailogo from '../../../assets/images/mirailogo.png';

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
  const dispatch = useDispatch()
  const {hospitalData} = useSelector(state => state.hospitalData)
  const loginData = JSON.parse(localStorage.getItem('loginData')) || {};

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
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
             
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
          <Box sx={{ display: 'flex', backgroundColor: "none"}} mt={0.5}>
            <div style={{ width: '140px', marginLeft: '2rem' }}>
              <img style={{ width: '100%', borderRadius: '6px', height: '40px' }} src={mirailogo} alt={"LOGO"} />
            </div>
            <Box sx={{ display: 'flex', marginLeft: '6rem' }}>
              <Grid item sx={{ display: 'flex' }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  
                  }}
                >
                </div>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      {/* {data?.role === 'Administrative' ? <CurrentDate /> : <SearchSection theme="light" />} */}
      <Box
  sx={{
    display: {  md: 'flex', xs: 'none' }, // Only visible on xs and sm screens
    alignItems: 'center',
    gap: 1,
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontSize: { xs: '12px', sm: '14px' },
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: '1px',
      lineHeight: '1.5',
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
