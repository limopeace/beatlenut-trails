import { adminApiClient } from './adminApiClient';

/**
 * Interface for order item
 */
export interface OrderItem {
  id: string;
  productId?: string;
  serviceId?: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

/**
 * Interface for order customer details
 */
export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Interface for order seller details
 */
export interface OrderSeller {
  id: string;
  name: string;
  businessName: string;
  email?: string;
}

/**
 * Interface for order details
 */
export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  seller: OrderSeller;
  items: OrderItem[];
  itemsCount?: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  status: 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod?: string;
  shippingAddress?: any;
  billingAddress?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for order filters
 */
export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  sellerId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Interface for paginated order results
 */
export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Interface for order statistics
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

/**
 * Get all orders with filters and pagination
 * @param filters Filters to apply
 * @param page Page number
 * @param limit Items per page
 * @returns Paginated orders
 */
export const getOrders = async (
  filters: OrderFilters = {}, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedOrders> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const response = await adminApiClient.get(`/admin/orders?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get order by ID
 * @param id Order ID
 * @returns Order details
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await adminApiClient.get(`/admin/orders/${id}`);
  return response.data.order;
};

/**
 * Update order status
 * @param id Order ID
 * @param status New status
 * @param notes Optional notes
 * @returns Updated order
 */
export const updateOrderStatus = async (
  id: string, 
  status: Order['status'],
  notes?: string
): Promise<{ order: Order; message: string }> => {
  const response = await adminApiClient.put(`/admin/orders/${id}/status`, { status, notes });
  return response.data;
};

/**
 * Update payment status
 * @param id Order ID
 * @param paymentStatus New payment status
 * @param notes Optional notes
 * @returns Updated order
 */
export const updatePaymentStatus = async (
  id: string, 
  paymentStatus: Order['paymentStatus'],
  notes?: string
): Promise<{ order: Order; message: string }> => {
  const response = await adminApiClient.put(`/admin/orders/${id}/payment-status`, { paymentStatus, notes });
  return response.data;
};

/**
 * Get order statistics
 * @returns Order statistics
 */
export const getOrderStats = async (): Promise<OrderStats> => {
  const response = await adminApiClient.get('/admin/orders/stats');
  return response.data.stats;
};

/**
 * Cancel order
 * @param id Order ID
 * @param reason Cancellation reason
 * @returns Updated order
 */
export const cancelOrder = async (
  id: string,
  reason: string
): Promise<{ order: Order; message: string }> => {
  const response = await adminApiClient.post(`/admin/orders/${id}/cancel`, { reason });
  return response.data;
};

/**
 * Process refund
 * @param id Order ID
 * @param amount Refund amount
 * @param reason Refund reason
 * @returns Updated order
 */
export const processRefund = async (
  id: string,
  amount: number,
  reason: string
): Promise<{ order: Order; message: string }> => {
  const response = await adminApiClient.post(`/admin/orders/${id}/refund`, { amount, reason });
  return response.data;
};

const OrderService = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  cancelOrder,
  processRefund
};

export default OrderService;