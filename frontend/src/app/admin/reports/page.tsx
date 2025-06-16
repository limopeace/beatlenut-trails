'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar,
  faChartLine,
  faChartPie,
  faDownload,
  faCalendar,
  faFilter,
  faSpinner,
  faFileAlt,
  faDollarSign,
  faUsers,
  faBox
} from '@fortawesome/free-solid-svg-icons';

const AdminReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Revenue and sales analytics',
      icon: faDollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'users',
      title: 'User Analytics',
      description: 'User registration and activity metrics',
      icon: faUsers,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'products',
      title: 'Product Performance',
      description: 'Product and service performance metrics',
      icon: faBox,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'sellers',
      title: 'Seller Performance',
      description: 'Seller activity and performance data',
      icon: faChartBar,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const mockReportData = {
    sales: {
      totalRevenue: 450000,
      totalOrders: 1234,
      averageOrderValue: 365,
      growth: '+12.5%'
    },
    users: {
      totalUsers: 5678,
      newUsers: 234,
      activeUsers: 4321,
      growth: '+8.2%'
    },
    products: {
      totalProducts: 456,
      activeProducts: 398,
      totalServices: 123,
      growth: '+15.3%'
    },
    sellers: {
      totalSellers: 89,
      activeSellers: 76,
      pendingSellers: 13,
      growth: '+6.7%'
    }
  };

  const generateReport = async () => {
    setLoading(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // In real implementation, this would trigger a download
    alert(`${reportTypes.find(r => r.id === selectedReport)?.title} for ${dateRange} generated successfully!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and download comprehensive business reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedReport === report.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-lg ${report.color} mr-3`}>
                <FontAwesomeIcon icon={report.icon} className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {reportTypes.find(r => r.id === selectedReport)?.title} Preview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(mockReportData[selectedReport as keyof typeof mockReportData] || {}).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' && key.includes('Revenue') ? formatCurrency(value) : value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FontAwesomeIcon icon={faChartLine} className="text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Chart Visualization</h3>
          <p className="text-gray-500">
            Interactive charts and graphs will be displayed here based on the selected report type.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Export PDF
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export CSV
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;