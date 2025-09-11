import { Card, Grid } from '@mui/material';
import { gridSpacing } from 'config';
import React from 'react';
import ReusableBarChart from 'views/Dashboard/Charts/BarCharts/ReusbaleBarChart';
import DepartmentOpdPieChart from 'views/Dashboard/Charts/PieChart/DepartmentOPD';

const AnalyticalReport = () => {
  // Daily Leads
  const dailyLeadData = {
    title: 'Daily Leads',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesData: [
      [5, 8, 12, 7, 9, 10, 6] // data for "Daily Leads"
    ],
    seriesLabelMap: { 'Daily Leads': 'Daily Leads' },
    colors: ['#36A2EB'] // blue
  };

  // Monthly Leads
  const monthlyLeadData = {
    title: 'Monthly Leads',
    xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seriesData: [[120, 150, 130, 180, 200, 170, 190, 210, 230, 220, 200, 250]],
    seriesLabelMap: { 'Monthly Leads': 'Monthly Leads' },
    colors: ['#FF6384'] // pink
  };

  // Team-wise Leads
  const teamWiseLeadData = {
    title: 'Team-Wise Leads',
    xLabels: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta'],
    seriesData: [[30, 45, 25, 50]],
    seriesLabelMap: { 'Leads per Team': 'Leads per Team' },
    colors: ['#FF9F40'] // orange
  };

  // Product-wise Leads
  const productWiseLeadData = {
    type: 'donut',
    head: 'Product-wise Leads',
    height: 320,
    series: [40, 25, 15, 20], // number of leads per product
    options: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      colors: ['#4BC0C0', '#FFCE56', '#FF6384', '#36A2EB'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  // Reference-wise Leads
  const referenceWiseLeadData = {
    type: 'donut',
    head: 'Reference-wise Leads',
    height: 320,
    series: [50, 30, 10, 10], // number of leads per reference
    options: {
      labels: ['Website', 'Referral', 'Ad Campaign', 'Events'],
      colors: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  // Open vs Closed Leads
  const leadOpenCloseData = {
    type: 'donut',
    head: 'Open vs Closed Leads',
    height: 320,
    series: [180, 70], // Open leads, Closed leads
    options: {
      labels: ['Open', 'Closed'],
      colors: ['#F44336', '#4CAF50'],
      legend: { position: 'bottom' },
      tooltip: {
        y: { formatter: (val) => `${val} Leads` }
      }
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...teamWiseLeadData} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...monthlyLeadData} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card spacing={gridSpacing}>
          <ReusableBarChart {...dailyLeadData} />
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
            <DepartmentOpdPieChart chartData={leadOpenCloseData} />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <DepartmentOpdPieChart chartData={referenceWiseLeadData} />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <DepartmentOpdPieChart chartData={productWiseLeadData} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticalReport;
