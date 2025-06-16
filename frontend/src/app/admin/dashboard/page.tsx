'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import DashboardService, { type DashboardStats } from '@/services/api/dashboardService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Define types for dashboard data
interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface MonthlySales {
  month: number;
  revenue: number;
  count: number;
}

interface UserStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface SellerStats {
  totalSellers: number;
  pendingVerification: number;
  activeSellers: number;
  suspendedSellers: number;
}

interface ProductStats {
  totalProducts: number;
  totalServices: number;
  pendingApproval: number;
  activeProducts: number;
  soldOutProducts: number;
}

interface DashboardData {
  orders: {
    overall: OrderStats;
    monthlySales: MonthlySales[];
  };
  users: UserStats;
  sellers: SellerStats;
  products: ProductStats;
  categoryBreakdown: {
    name: string;
    count: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState<string>('month'); // 'week', 'month', 'year'
  
  // Check admin authentication
  useEffect(() => {
    const adminToken = Cookies.get('admin_token');
    if (!adminToken) {
      router.push('/admin/login');
    } else {
      fetchDashboardData();
    }
  }, [router]);
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from API
      const stats = await DashboardService.getDashboardStats();
      
      // Transform the data to match our dashboard format
      const dashboardData: DashboardData = {
        orders: {
          overall: {
            totalOrders: stats?.orderStats?.total || 0,
            totalRevenue: stats?.orderStats?.totalRevenue || 0,
            averageOrderValue: stats?.orderStats?.averageOrderValue || 0,
            pendingOrders: stats?.orderStats?.pending || 0,
            processingOrders: stats?.orderStats?.processing || 0,
            completedOrders: stats?.orderStats?.completed || 0,
            cancelledOrders: stats?.orderStats?.cancelled || 0
          },
          monthlySales: [
            // For now, use mock monthly data until API provides it
            { month: 1, revenue: 24500, count: 18 },
            { month: 2, revenue: 29800, count: 22 },
            { month: 3, revenue: 31200, count: 25 },
            { month: 4, revenue: 28700, count: 19 },
            { month: 5, revenue: 32300, count: 24 },
            { month: 6, revenue: 35600, count: 28 },
            { month: 7, revenue: 38200, count: 31 },
            { month: 8, revenue: 35400, count: 26 },
            { month: 9, revenue: 33200, count: 22 },
            { month: 10, revenue: 31800, count: 20 },
            { month: 11, revenue: 0, count: 0 },
            { month: 12, revenue: 0, count: 0 }
          ]
        },
        users: {
          totalUsers: stats?.userStats?.total || 0,
          newUsersThisMonth: stats?.userStats?.newThisMonth || 0,
          activeUsers: stats?.userStats?.buyers || 0,
          inactiveUsers: Math.max(0, (stats?.userStats?.total || 0) - (stats?.userStats?.buyers || 0))
        },
        sellers: {
          totalSellers: stats?.sellerStats?.total || 0,
          pendingVerification: stats?.sellerStats?.pending || 0,
          activeSellers: stats?.sellerStats?.active || 0,
          suspendedSellers: stats?.sellerStats?.suspended || 0
        },
        products: {
          totalProducts: stats?.productStats?.total || 0,
          totalServices: stats?.serviceStats?.total || 0,
          pendingApproval: (stats?.productStats?.pending || 0) + (stats?.serviceStats?.pending || 0),
          activeProducts: (stats?.productStats?.active || 0) + (stats?.serviceStats?.active || 0),
          soldOutProducts: 0 // Not provided by API yet
        },
        categoryBreakdown: [
          // For now, use mock category data until API provides it
          { name: 'Adventure Tours', count: 112 },
          { name: 'Bike Accessories', count: 98 },
          { name: 'Camping Gear', count: 87 },
          { name: 'Maintenance Services', count: 76 },
          { name: 'Guided Trips', count: 54 },
          { name: 'Apparel', count: 47 },
          { name: 'Rentals', count: 38 },
          { name: 'Other', count: 164 }
        ]
      };
      
      setDashboardData(dashboardData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Get month name
  const getMonthName = (monthNumber: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };
  
  // Create monthly sales chart data
  const monthlySalesData = {
    labels: dashboardData?.orders.monthlySales.map(sale => getMonthName(sale.month)) || [],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData?.orders.monthlySales.map(sale => sale.revenue) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Orders',
        data: dashboardData?.orders.monthlySales.map(sale => sale.count) || [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
  
  // Order status chart data
  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          dashboardData?.orders.overall.pendingOrders || 0,
          dashboardData?.orders.overall.processingOrders || 0,
          dashboardData?.orders.overall.completedOrders || 0,
          dashboardData?.orders.overall.cancelledOrders || 0
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Category breakdown chart data
  const categoryBreakdownData = {
    labels: dashboardData?.categoryBreakdown.map(cat => cat.name) || [],
    datasets: [
      {
        data: dashboardData?.categoryBreakdown.map(cat => cat.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // User breakdown chart data
  const userBreakdownData = {
    labels: ['Active Users', 'Inactive Users', 'New Users'],
    datasets: [
      {
        data: [
          dashboardData?.users.activeUsers || 0,
          dashboardData?.users.inactiveUsers || 0,
          dashboardData?.users.newUsersThisMonth || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Seller status chart data
  const sellerStatusData = {
    labels: ['Active', 'Pending Verification', 'Suspended'],
    datasets: [
      {
        data: [
          dashboardData?.sellers.activeSellers || 0,
          dashboardData?.sellers.pendingVerification || 0,
          dashboardData?.sellers.suspendedSellers || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-3xl animate-spin" />
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard bg-gray-100 min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ESM Marketplace Dashboard</h1>
        <p className="text-gray-600">Overview of marketplace performance and metrics</p>
      </header>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(dashboardData?.orders.overall.totalRevenue || 0)}
          </p>
          <div className="mt-2 text-sm text-green-600">
            +12.5% from last month
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardData?.orders.overall.totalOrders || 0}
          </p>
          <div className="mt-2 text-sm text-green-600">
            +8.2% from last month
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800">
            {dashboardData?.users.totalUsers || 0}
          </p>
          <div className="mt-2 text-sm text-green-600">
            +{dashboardData?.users.newUsersThisMonth || 0} new this month
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(dashboardData?.orders.overall.averageOrderValue || 0)}
          </p>
          <div className="mt-2 text-sm text-green-600">
            +3.1% from last month
          </div>
        </div>
      </div>
      
      {/* Date Range Filter */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              dateRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              dateRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              dateRange === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setDateRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Revenue & Orders</h3>
          <div className="h-80">
            <Line 
              data={monthlySalesData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Revenue (₹)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Orders'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Order Status</h3>
          <div className="h-80">
            <Doughnut 
              data={orderStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Category Breakdown</h3>
          <div className="h-80">
            <Pie 
              data={categoryBreakdownData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* User Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">User Breakdown</h3>
          <div className="h-80">
            <Doughnut 
              data={userBreakdownData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Seller Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Seller Status</h3>
          <div className="h-80">
            <Doughnut 
              data={sellerStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
            <a href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample order data */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ESM2310000123
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rahul Sharma
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹12,500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oct 15, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ESM2310000122
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Priya Patel
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹8,750
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Processing
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oct 14, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ESM2310000120
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Amit Singh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹3,200
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oct 12, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ESM2310000118
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Neha Gupta
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹5,800
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oct 10, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ESM2310000116
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rajesh Kumar
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹9,350
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Oct 8, 2023
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Pending Approvals</h3>
            <a href="/admin/approvals" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </a>
          </div>
          
          {/* Seller Verifications */}
          <h4 className="text-md font-medium text-gray-700 mb-2">Seller Verifications ({dashboardData?.sellers.pendingVerification || 0})</h4>
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Vikram Mehta</p>
                <p className="text-sm text-gray-500">Adventure Gear Co. • Ex-Army</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Suresh Reddy</p>
                <p className="text-sm text-gray-500">Mountain Explorers • Ex-Air Force</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Anita Desai</p>
                <p className="text-sm text-gray-500">Himalayan Treks • Ex-Navy</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Approvals */}
          <h4 className="text-md font-medium text-gray-700 mb-2">Product Approvals ({dashboardData?.products.pendingApproval || 0})</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Premium Hiking Backpack</p>
                <p className="text-sm text-gray-500">By Adventure Gear Co. • ₹5,200</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Mountain Bike Maintenance</p>
                <p className="text-sm text-gray-500">By Bike Service Pro • ₹1,800</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">All-Weather Tent</p>
                <p className="text-sm text-gray-500">By Outdoor Essentials • ₹8,500</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-800">Adventure Photography Tour</p>
                <p className="text-sm text-gray-500">By Mountain Explorers • ₹12,000</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;