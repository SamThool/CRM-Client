import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Box, Typography } from '@mui/material';

export default function CurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  const formattedDate = format(currentDate, "eeee, dd'th' MMM yyyy - hh:mm:ssaaa ");

  return (
    <Box sx={{ textAlign: 'center', marginRight: '2rem !important' }}>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '16px' },
          fontWeight: '400',
          color: '#000',
          letterSpacing: '0.5px',
          lineHeight: '1.5'
        }}
      >
        {formattedDate}
      </Typography>
    </Box>
  );
}
