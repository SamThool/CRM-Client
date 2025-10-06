import React, { useState, useEffect } from 'react';
import { Card, Grid, MenuItem, Select, Typography } from '@mui/material';
import { gridSpacing } from 'config';
import ReusableBarChart from 'views/Dashboard/Charts/BarCharts/ReusbaleBarChart';
import DepartmentOpdPieChart from 'views/Dashboard/Charts/PieChart/DepartmentOPD';

const AnalyticalReport = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const staffNames = ['John', 'Emma', 'Raj', 'Priya', 'Alex', 'Sara'];

  const generateRandomData = (count = 12, max = 250) => Array.from({ length: count }, () => Math.floor(Math.random() * max) + 10);

  // 1️⃣ Daily Lead Graph
  const [selectedMonth1, setSelectedMonth1] = useState('January');
  const [dailyLeadData, setDailyLeadData] = useState({
    title: 'Daily Leads - January',
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesData: [generateRandomData(7, 50)],
    seriesLabelMap: { 'Daily Leads': 'Daily Leads' },
    colors: ['#36A2EB']
  });
  useEffect(() => {
    setDailyLeadData((prev) => ({
      ...prev,
      title: `Daily Leads - ${selectedMonth1}`,
      seriesData: [generateRandomData(7, 50)]
    }));
  }, [selectedMonth1]);

  // 2️⃣ Monthly Lead Graph
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyLeadData, setMonthlyLeadData] = useState({
    title: `Monthly Leads - ${currentYear}`,
    xLabels: months,
    seriesData: [generateRandomData()],
    seriesLabelMap: { 'Monthly Leads': 'Monthly Leads' },
    colors: ['#FF6384']
  });
  useEffect(() => {
    setMonthlyLeadData((prev) => ({
      ...prev,
      title: `Monthly Leads - ${selectedYear}`,
      seriesData: [generateRandomData()]
    }));
  }, [selectedYear]);

  // 3️⃣ Another Monthly Graph
  const [selectedMonth2, setSelectedMonth2] = useState('January');
  const [anotherMonthlyData, setAnotherMonthlyData] = useState({
    title: 'Monthly Trend - January',
    xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    seriesData: [generateRandomData(4, 100)],
    seriesLabelMap: { 'Monthly Trend': 'Monthly Trend' },
    colors: ['#FF9F40']
  });
  useEffect(() => {
    setAnotherMonthlyData((prev) => ({
      ...prev,
      title: `Monthly Trend - ${selectedMonth2}`,
      seriesData: [generateRandomData(4, 100)]
    }));
  }, [selectedMonth2]);

  // 4️⃣ Staff-wise Leads
  const [selectedStaff, setSelectedStaff] = useState('John');
  const [staffWiseData, setStaffWiseData] = useState({
    title: 'Staff-wise Leads - John',
    xLabels: staffNames,
    seriesData: [generateRandomData(staffNames.length, 80)],
    seriesLabelMap: { 'Staff Leads': 'Staff Leads' },
    colors: ['#4CAF50']
  });
  useEffect(() => {
    setStaffWiseData((prev) => ({
      ...prev,
      title: `Staff-wise Leads - ${selectedStaff}`,
      seriesData: [generateRandomData(staffNames.length, 80)]
    }));
  }, [selectedStaff]);

  // 5️⃣ Reference-wise Leads
  const [selectedMonth3, setSelectedMonth3] = useState('January');
  const [referenceWiseData, setReferenceWiseData] = useState({
    title: 'Reference-wise Leads - January',
    xLabels: ['Website', 'Referral', 'Ad Campaign', 'Events'],
    seriesData: [generateRandomData(4, 100)],
    seriesLabelMap: { 'Reference Leads': 'Reference Leads' },
    colors: ['#2196F3']
  });
  useEffect(() => {
    setReferenceWiseData((prev) => ({
      ...prev,
      title: `Reference-wise Leads - ${selectedMonth3}`,
      seriesData: [generateRandomData(4, 100)]
    }));
  }, [selectedMonth3]);

  // 6️⃣ Product-wise Leads
  const [selectedMonth4, setSelectedMonth4] = useState('January');
  const [productWiseData, setProductWiseData] = useState({
    title: 'Product-wise Leads - January',
    xLabels: ['Product A', 'Product B', 'Product C', 'Product D'],
    seriesData: [generateRandomData(4, 120)],
    seriesLabelMap: { 'Product Leads': 'Product Leads' },
    colors: ['#9C27B0']
  });
  useEffect(() => {
    setProductWiseData((prev) => ({
      ...prev,
      title: `Product-wise Leads - ${selectedMonth4}`,
      seriesData: [generateRandomData(4, 120)]
    }));
  }, [selectedMonth4]);

  // 7️⃣ Lead Open vs Closed (no dropdown)
  const leadOpenCloseData = {
    title: 'Lead Open vs Closed',
    xLabels: ['Open', 'Closed'],
    seriesData: [[180, 120]],
    seriesLabelMap: { Leads: 'Leads' },
    colors: ['#F44336', '#4CAF50']
  };

  // 8️⃣ Reference Pie Chart
  const referencePieData = {
    type: 'donut',
    head: 'Reference Leads Distribution',
    height: 320,
    series: [40, 30, 20, 10],
    options: {
      labels: ['Website', 'Referral', 'Ad Campaign', 'Events'],
      colors: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      legend: { position: 'bottom' }
    }
  };

  // 9️⃣ Product Pie Chart
  const productPieData = {
    type: 'donut',
    head: 'Product Leads Distribution',
    height: 320,
    series: [35, 25, 25, 15],
    options: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      colors: ['#4BC0C0', '#FFCE56', '#FF6384', '#36A2EB'],
      legend: { position: 'bottom' }
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Each section now independent */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Daily Leads</Typography> */}
          <Select value={selectedMonth1} onChange={(e) => setSelectedMonth1(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {months.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...dailyLeadData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Monthly Leads</Typography> */}
          <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...monthlyLeadData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Monthly Trend</Typography> */}
          <Select value={selectedMonth2} onChange={(e) => setSelectedMonth2(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {months.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...anotherMonthlyData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Staff-wise Leads</Typography> */}
          <Select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {staffNames.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...staffWiseData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Reference-wise Leads</Typography> */}
          <Select value={selectedMonth3} onChange={(e) => setSelectedMonth3(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {months.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...referenceWiseData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Product-wise Leads</Typography> */}
          <Select value={selectedMonth4} onChange={(e) => setSelectedMonth4(e.target.value)} sx={{ mb: 2, minWidth: 200 }}>
            {months.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          <ReusableBarChart {...productWiseData} />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          {/* <Typography variant="h6">Lead Open vs Closed</Typography> */}
          <ReusableBarChart {...leadOpenCloseData} />
        </Card>
      </Grid>

      <Grid item xs={12} container spacing={gridSpacing}>
        <Grid item lg={6} sm={12} xs={12}>
          <DepartmentOpdPieChart chartData={referencePieData} />
        </Grid>
        <Grid item lg={6} sm={12} xs={12}>
          <DepartmentOpdPieChart chartData={productPieData} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticalReport;
