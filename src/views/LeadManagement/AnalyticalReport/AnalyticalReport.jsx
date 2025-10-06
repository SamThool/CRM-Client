import React, { useState, useEffect } from 'react';
import { Card, Grid, MenuItem, Select, Typography } from '@mui/material';
import { gridSpacing } from 'config';
import ReusableBarChart from 'views/Dashboard/Charts/BarCharts/ReusbaleBarChart';
import DepartmentOpdPieChart from 'views/Dashboard/Charts/PieChart/DepartmentOPD';
import REACT_APP_API_URL, { get, post } from 'api/api';
import axios from 'axios';

const AnalyticalReport = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const staffNames = ['John', 'Emma', 'Raj', 'Priya', 'Alex', 'Sara'];

  const companyId = localStorage.getItem('companyId');

  const generateRandomData = (count = 12, max = 250) => Array.from({ length: count }, () => Math.floor(Math.random() * max) + 10);
  // 1️⃣ Daily Lead Graph (connected to backend)
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth1, setSelectedMonth1] = useState(null);
  const [selectedYear1, setSelectedYear1] = useState(null);

  const [dailyLeadData, setDailyLeadData] = useState({
    title: 'Daily Leads',
    xLabels: [],
    seriesData: [[]],
    seriesLabelMap: { 'Daily Leads': 'Daily Leads' },
    colors: ['#36A2EB']
  });

  // Fetch available months for dropdown
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const res = await post('lead/analytics/daily-leads'); // your API
        // Check actual data
        console.log('Response:', res);

        if (res?.success) {
          const months = res.months || [];
          setAvailableMonths(months);

          const latest = months[0];
          if (latest?.value) {
            setSelectedMonth1(latest.value.month);
            setSelectedYear1(latest.value.year);
          }
        }
      } catch (err) {
        console.error('Error fetching months:', err);
      }
    };
    fetchMonths();
  }, []);

  // Fetch chart data for selected month

  useEffect(() => {
    const fetchDailyLeads = async () => {
      if (!selectedMonth1 || !selectedYear1 || !companyId) return;
      try {
        const res = await post('lead/analytics/daily-leads', {
          month: selectedMonth1,
          year: selectedYear1,
          companyId
        });

        if (res.success) {
          const chartData = res.chartData;
          setDailyLeadData({
            title: `Daily Leads - ${res.months.find((m) => m.value.month === selectedMonth1 && m.value.year === selectedYear1)?.label}`,
            xLabels: chartData.map((d) => d.day),
            seriesData: [chartData.map((d) => d.totalLeads)],
            seriesLabelMap: { 'Daily Leads': 'Daily Leads' },
            colors: ['#36A2EB']
          });
        }
      } catch (err) {
        console.error('Error fetching daily leads:', err);
      }
    };
    fetchDailyLeads();
  }, [selectedMonth1, selectedYear1, companyId]);

  // 2️⃣ Monthly Lead Graph (connected to backend)
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyLeadData, setMonthlyLeadData] = useState({
    title: `Monthly Leads - ${currentYear}`,
    xLabels: months, // Jan to Dec
    seriesData: [Array(12).fill(0)], // initial empty data
    seriesLabelMap: { 'Monthly Leads': 'Monthly Leads' },
    colors: ['#FF6384']
  });

  // Fetch monthly leads when selectedYear or companyId changes
  useEffect(() => {
    const fetchMonthlyLeads = async () => {
      if (!companyId) return;

      try {
        const res = await post(
          'lead/analytics/monthly-leads',
          {
            year: selectedYear
          },
          {
            params: { companyId }
          }
        );

        if (res.success) {
          setMonthlyLeadData({
            title: `Monthly Leads - ${selectedYear}`,
            xLabels: months,
            seriesData: [res.chartData], // chartData should be array of 12 months
            seriesLabelMap: { 'Monthly Leads': 'Monthly Leads' },
            colors: ['#FF6384']
          });
        }
      } catch (err) {
        console.error('Error fetching monthly leads:', err);
      }
    };

    fetchMonthlyLeads();
  }, [selectedYear, companyId]);

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
  // 6️⃣ Product-wise Leads (dynamic, from backend)
  const [selectedProductMonth, setSelectedProductMonth] = useState(null);
  const [selectedProductYear, setSelectedProductYear] = useState(null);

  const [productWiseData, setProductWiseData] = useState({
    title: 'Product-wise Leads',
    xLabels: [], // will be sub-product names
    seriesData: [[]], // number of leads for each sub-product
    seriesLabelMap: { 'Product Leads': 'Product Leads' },
    colors: ['#9C27B0']
  });

  // Fetch all months/years for dropdown based on leads
  const [productAvailableMonths, setProductAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchProductMonths = async () => {
      if (!companyId) return;

      try {
        const res = await post(
          'lead/analytics/product-leads-months',
          {},
          {
            params: { companyId }
          }
        );

        if (res.success) {
          setProductAvailableMonths(res.months || []);
          const latest = res.months[0];
          if (latest?.value) {
            setSelectedProductMonth(latest.value.month);
            setSelectedProductYear(latest.value.year);
          }
        }
      } catch (err) {
        console.error('Error fetching product months:', err);
      }
    };
    fetchProductMonths();
  }, [companyId]);

  // Fetch product-wise leads for selected month/year
  useEffect(() => {
    const fetchProductLeads = async () => {
      if (!selectedProductMonth || !selectedProductYear || !companyId) return;

      try {
        const res = await post(
          'lead/analytics/product-leads',
          {
            month: selectedProductMonth,
            year: selectedProductYear
          },
          {
            params: { companyId }
          }
        );

        if (res.success) {
          setProductWiseData({
            title: `Product-wise Leads - ${res.monthLabel}`,
            xLabels: res.subProducts, // array of sub-product names
            seriesData: [res.leadsCount], // number of leads per sub-product
            seriesLabelMap: { 'Product Leads': 'Product Leads' },
            colors: ['#9C27B0']
          });
        }
      } catch (err) {
        console.error('Error fetching product-wise leads:', err);
      }
    };

    fetchProductLeads();
  }, [selectedProductMonth, selectedProductYear, companyId]);

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
          <Select
            value={`${selectedMonth1 || ''}-${selectedYear1 || ''}`}
            onChange={(e) => {
              const [m, y] = e.target.value.split('-');
              setSelectedMonth1(Number(m));
              setSelectedYear1(Number(y));
            }}
            sx={{ mb: 2, minWidth: 220 }}
          >
            {availableMonths.map((m) => (
              <MenuItem key={`${m.value.month}-${m.value.year}`} value={`${m.value.month}-${m.value.year}`}>
                {m.label}
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
          <Select
            value={`${selectedProductMonth || ''}-${selectedProductYear || ''}`}
            onChange={(e) => {
              const [m, y] = e.target.value.split('-');
              setSelectedProductMonth(Number(m));
              setSelectedProductYear(Number(y));
            }}
            sx={{ mb: 2, minWidth: 220 }}
          >
            {productAvailableMonths.map((m) => (
              <MenuItem key={`${m.value.month}-${m.value.year}`} value={`${m.value.month}-${m.value.year}`}>
                {m.label}
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
