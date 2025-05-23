import apiClient, { esmApiClient } from './apiClient';
import { adminApiClient } from './adminApiClient';
import AuthService from './authService';
import ApprovalsService from './approvalsService';
import SellersService from './sellersService';
import DashboardService from './dashboardService';
import EsmAuthService from './esmAuthService';
import EsmProductService from './esmProductService';
import EsmServiceService from './esmServiceService';
import OrderService from './orderService';

// Export all services from a single point
export {
  apiClient,
  adminApiClient,
  esmApiClient,
  AuthService,
  ApprovalsService,
  SellersService,
  DashboardService,
  EsmAuthService,
  EsmProductService,
  EsmServiceService,
  OrderService
};

// Default export
const services = {
  apiClient,
  adminApiClient,
  esmApiClient,
  auth: AuthService,
  approvals: ApprovalsService,
  sellers: SellersService,
  dashboard: DashboardService,
  esmAuth: EsmAuthService,
  esmProducts: EsmProductService,
  esmServices: EsmServiceService,
  orders: OrderService
};

export default services;