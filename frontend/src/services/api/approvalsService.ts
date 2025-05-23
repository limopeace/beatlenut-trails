import { adminApiClient } from './adminApiClient';

/**
 * Interface for approval filters
 */
export interface ApprovalFilters {
  status?: string;
  type?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Interface for approval document
 */
export interface ApprovalDocument {
  id: string;
  type: string;
  name: string;
  path: string;
  status: 'pending' | 'verified' | 'rejected';
}

/**
 * Interface for approval details
 */
export interface ApprovalDetails {
  sellerId?: string;
  productId?: string;
  serviceId?: string;
  documentId?: string;
  name?: string;
  sellerName?: string;
  businessName?: string;
  category?: string;
  location?: string;
  profileImg?: string;
  serviceRecord?: string;
  productName?: string;
  price?: number;
  documents?: ApprovalDocument[];
  notes?: string;
  [key: string]: any; // For other dynamic properties
}

/**
 * Interface for approval object
 */
export interface Approval {
  id: string;
  type: 'seller_registration' | 'product_listing' | 'document_verification' | 'service_listing';
  status: 'pending' | 'approved' | 'rejected';
  requesterId: string;
  requesterModel: string;
  requesterName: string;
  requesterEmail: string;
  requesterBusinessName?: string;
  requesterProfileImage?: string;
  itemId?: string;
  itemModel?: string;
  itemName?: string;
  itemDetails: ApprovalDetails;
  documents?: ApprovalDocument[];
  adminNotes?: string;
  requesterNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for paginated approval results
 */
export interface PaginatedApprovals {
  approvals: Approval[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
}

/**
 * Interface for approval statistics
 */
export interface ApprovalStats {
  totalPending: number;
  sellerPending: number;
  productPending: number;
  servicePending: number;
  documentPending: number;
}

/**
 * Interface for batch approval item
 */
export interface BatchApprovalItem {
  id: string;
  action: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}

/**
 * Interface for batch approval result
 */
export interface BatchApprovalResult {
  results: {
    successful: Array<{
      id: string;
      action: string;
      type: string;
      item: string;
    }>;
    failed: Array<{
      id: string;
      error: string;
    }>;
  };
  message: string;
}

/**
 * Get approvals with filters and pagination
 * @param filters Filters to apply
 * @param page Page number
 * @param limit Items per page
 * @returns Paginated approvals
 */
export const getApprovals = async (
  filters: ApprovalFilters = {}, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedApprovals> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const response = await adminApiClient.get(`/approvals?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get pending approvals
 * @param filters Additional filters
 * @param page Page number
 * @param limit Items per page
 * @returns Paginated pending approvals
 */
export const getPendingApprovals = async (
  filters: Omit<ApprovalFilters, 'status'> = {}, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedApprovals> => {
  return getApprovals({ ...filters, status: 'pending' }, page, limit);
};

/**
 * Get approval details by ID
 * @param id Approval ID
 * @returns Approval details
 */
export const getApprovalById = async (id: string): Promise<Approval> => {
  const response = await adminApiClient.get(`/approvals/${id}`);
  return response.data.approval;
};

/**
 * Approve an approval request
 * @param id Approval ID
 * @param notes Optional admin notes
 * @returns Result with updated approval
 */
export const approveRequest = async (id: string, notes: string = ''): Promise<{ approval: Approval; message: string }> => {
  const response = await adminApiClient.post(`/approvals/${id}/approve`, { notes });
  return response.data;
};

/**
 * Reject an approval request
 * @param id Approval ID
 * @param reason Rejection reason (required)
 * @param notes Optional admin notes
 * @returns Result with updated approval
 */
export const rejectRequest = async (
  id: string, 
  reason: string, 
  notes: string = ''
): Promise<{ approval: Approval; message: string }> => {
  const response = await adminApiClient.post(`/approvals/${id}/reject`, { reason, notes });
  return response.data;
};

/**
 * Update document status within an approval
 * @param approvalId Approval ID
 * @param documentId Document ID
 * @param status New document status
 * @returns Result with updated approval
 */
export const updateDocumentStatus = async (
  approvalId: string,
  documentId: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<{ approval: Approval; message: string }> => {
  const response = await adminApiClient.patch(`/approvals/${approvalId}/document/${documentId}`, { status });
  return response.data;
};

/**
 * Process multiple approvals in batch
 * @param approvals Array of approval actions
 * @returns Batch processing results
 */
export const processBatchApprovals = async (approvals: BatchApprovalItem[]): Promise<BatchApprovalResult> => {
  const response = await adminApiClient.post('/admin/approvals/batch', { approvals });
  return response.data;
};

/**
 * Get approval statistics
 * @returns Approval statistics
 */
export const getApprovalStats = async (): Promise<ApprovalStats> => {
  const response = await adminApiClient.get('/approvals/stats');
  return response.data.stats;
};

const ApprovalsService = {
  getApprovals,
  getPendingApprovals,
  getApprovalById,
  approveRequest,
  rejectRequest,
  updateDocumentStatus,
  processBatchApprovals,
  getApprovalStats
};

export default ApprovalsService;