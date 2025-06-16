import { adminApiClient } from './adminApiClient';

/**
 * Interface for dashboard statistics
 */
export interface DashboardStats {
  orderStats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  sellerStats: {
    total: number;
    pending: number;
    active: number;
    rejected: number;
    suspended: number;
  };
  productStats: {
    total: number;
    pending: number;
    active: number;
    inactive: number;
  };
  serviceStats: {
    total: number;
    pending: number;
    active: number;
    inactive: number;
  };
  userStats: {
    total: number;
    buyers: number;
    sellers: number;
    newThisMonth: number;
  };
  approvalStats: {
    totalPending: number;
    sellerPending: number;
    productPending: number;
    servicePending: number;
    documentPending: number;
  };
}

/**
 * Get dashboard statistics
 * @returns Dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await adminApiClient.get('/admin/dashboard');
  return response.data.data || response.data;
};

/**
 * Get monthly sales data
 * @param year Year to get data for
 * @returns Monthly sales data
 */
export const getMonthlySales = async (year: number = new Date().getFullYear()) => {
  const response = await adminApiClient.get(`/admin/analytics/sales?year=${year}`);
  return response.data;
};

/**
 * Get category breakdown
 * @returns Category breakdown data
 */
export const getCategoryBreakdown = async () => {
  const response = await adminApiClient.get('/admin/analytics/categories');
  return response.data;
};

/**
 * Get recent orders
 * @param limit Number of orders to fetch
 * @returns Recent orders
 */
export const getRecentOrders = async (limit: number = 5) => {
  const response = await adminApiClient.get(`/admin/orders/recent?limit=${limit}`);
  return response.data;
};

/**
 * Get pending approvals summary
 * @param limit Number of approvals to fetch
 * @returns Pending approvals
 */
export const getPendingApprovalsSummary = async (limit: number = 5) => {
  const response = await adminApiClient.get(`/admin/approvals/pending?limit=${limit}`);
  return response.data;
};

const DashboardService = {
  getDashboardStats,
  getMonthlySales,
  getCategoryBreakdown,
  getRecentOrders,
  getPendingApprovalsSummary
};

export default DashboardService;