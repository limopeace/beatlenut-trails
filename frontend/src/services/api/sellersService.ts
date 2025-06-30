import { adminApiClient } from './adminApiClient';

/**
 * Interface for seller filters
 */
export interface SellerFilters {
  status?: 'pending' | 'active' | 'suspended' | 'rejected';
  category?: string;
  serviceBranch?: string;
  isVerified?: boolean;
  search?: string;
}

/**
 * Interface for verification document
 */
export interface VerificationDocument {
  id: string;
  type: string;
  name: string;
  verified: boolean;
  uploadDate: string;
  notes?: string;
}

/**
 * Interface for seller's product
 */
export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  rating?: number;
  sales?: number;
}

/**
 * Interface for seller details
 */
export interface Seller {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  serviceBranch: string;
  rank: string;
  serviceNumber: string;
  serviceYears: {
    from: number;
    to: number;
  };
  businessName?: string;
  sellerType: {
    products: boolean;
    services: boolean;
  };
  category: string;
  description: string;
  isVerified: boolean;
  verificationDocument: string;
  verificationNotes?: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  profileImg?: string; // Added for UI compatibility
  documents?: VerificationDocument[]; // Added for UI compatibility
  products?: SellerProduct[]; // Added for UI compatibility
}

/**
 * Interface for paginated seller results
 */
export interface PaginatedSellers {
  sellers: Seller[];
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
 * Interface for seller statistics
 */
export interface SellerStats {
  total: number;
  pending: number;
  active: number;
  rejected: number;
  suspended?: number;
}

/**
 * Interface for seller verification data
 */
export interface SellerVerificationData {
  isVerified: boolean;
  notes?: string;
  status?: 'pending' | 'active' | 'suspended' | 'rejected';
}

/**
 * Get all sellers with admin-level details
 * @param filters Filters to apply
 * @param page Page number
 * @param limit Items per page
 * @returns Paginated sellers
 */
export const getSellers = async (
  filters: SellerFilters = {}, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedSellers> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  try {
    const response = await adminApiClient.get(`/admin/sellers?${queryParams.toString()}`);
    
    // Handle different response structures
    if (response.data.sellers) {
      return response.data;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      // Fallback for empty or malformed responses
      return {
        sellers: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  } catch (error) {
    console.error('Error fetching sellers:', error);
    // Return empty result on error
    return {
      sellers: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
};

/**
 * Get seller by ID
 * @param id Seller ID
 * @returns Seller details
 */
export const getSellerById = async (id: string): Promise<Seller> => {
  try {
    // Handle invalid IDs like 'pending-upload'
    if (!id || id === 'pending-upload' || id === 'undefined' || id === 'null') {
      throw new Error(`Invalid seller ID: ${id}`);
    }
    
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error(`Invalid seller ID format: ${id}`);
    }
    
    const response = await adminApiClient.get(`/esm/sellers/${id}`);
    return response.data.seller;
  } catch (error: any) {
    console.error(`Error fetching seller ${id}:`, error);
    
    // Provide more helpful error messages
    if (error.message.includes('Invalid seller ID')) {
      throw new Error(error.message);
    }
    
    // Handle network/API errors
    if (error.response?.status === 400) {
      throw new Error(`Invalid seller ID: ${id}. Please check the URL and try again.`);
    } else if (error.response?.status === 404) {
      throw new Error(`Seller not found with ID: ${id}`);
    }
    
    throw error;
  }
};

/**
 * Update seller verification status
 * @param id Seller ID
 * @param data Verification data
 * @returns Updated seller
 */
export const updateSellerVerification = async (
  id: string, 
  data: SellerVerificationData
): Promise<{ seller: Seller; message: string }> => {
  const response = await adminApiClient.put(`/admin/sellers/${id}/verification`, data);
  return response.data;
};

/**
 * Get seller statistics
 * @returns Seller statistics
 */
export const getSellerStats = async (): Promise<SellerStats> => {
  try {
    const response = await adminApiClient.get('/admin/dashboard');
    return response.data.sellerStats || {
      total: 0,
      pending: 0,
      active: 0,
      rejected: 0,
      suspended: 0
    };
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return {
      total: 0,
      pending: 0,
      active: 0,
      rejected: 0,
      suspended: 0
    };
  }
};

/**
 * Create a seller approval request
 * @param sellerId Seller ID
 * @returns Created approval
 */
export const createSellerApproval = async (sellerId: string): Promise<{ approval: any; message: string }> => {
  const response = await adminApiClient.post('/approvals/seller', { sellerId });
  return response.data;
};

const SellersService = {
  getSellers,
  getSellerById,
  updateSellerVerification,
  getSellerStats,
  createSellerApproval
};

export default SellersService;