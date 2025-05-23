import { esmApiClient, ApiResponse } from './apiClient';

export interface EsmService {
  _id: string;
  name: string;
  description: string;
  provider: {
    _id: string;
    name: string;
    businessName?: string;
  };
  category: 'adventure' | 'cultural' | 'nature' | 'wellness' | 'educational' | 'entertainment' | 'other';
  price: number;
  priceType: 'per_person' | 'flat_rate' | 'hourly' | 'daily';
  duration?: number;
  location: {
    city: string;
    state: string;
    coordinates?: [number, number];
  };
  availability: {
    days: string[];
    startDate?: Date;
    endDate?: Date;
  };
  images: string[];
  maxGroupSize?: number;
  equipmentProvided?: string[];
  requirements?: string[];
  tags?: string[];
  ratings?: {
    average: number;
    count: number;
  };
  featured?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  duration?: number;
  location: {
    city: string;
    state: string;
  };
  availability: {
    days: string[];
    startDate?: string;
    endDate?: string;
  };
  images: string[];
  maxGroupSize?: number;
  equipmentProvided?: string[];
  requirements?: string[];
  tags?: string[];
}

export interface ServiceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  location?: string;
  provider?: string;
  active?: boolean;
  featured?: boolean;
  sortBy?: 'price' | 'date' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ServicesResponse {
  services: EsmService[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

class EsmServiceService {
  async getServices(filters?: ServiceFilters): Promise<ServicesResponse> {
    try {
      const response = await esmApiClient.get<ApiResponse<ServicesResponse>>('/esm/services', {
        params: filters
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch services');
    } catch (error: any) {
      console.error('Error fetching services:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch services');
    }
  }
  
  async getService(id: string): Promise<EsmService> {
    try {
      const response = await esmApiClient.get<ApiResponse<EsmService>>(`/esm/services/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Service not found');
    } catch (error: any) {
      console.error(`Error fetching service ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch service');
    }
  }
  
  async createService(data: CreateServiceData): Promise<EsmService> {
    try {
      const response = await esmApiClient.post<ApiResponse<EsmService>>('/esm/services', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create service');
    } catch (error: any) {
      console.error('Error creating service:', error);
      throw new Error(error.response?.data?.message || 'Failed to create service');
    }
  }
  
  async updateService(id: string, data: Partial<CreateServiceData>): Promise<EsmService> {
    try {
      const response = await esmApiClient.put<ApiResponse<EsmService>>(`/esm/services/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update service');
    } catch (error: any) {
      console.error(`Error updating service ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update service');
    }
  }
  
  async deleteService(id: string): Promise<void> {
    try {
      const response = await esmApiClient.delete<ApiResponse<void>>(`/esm/services/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete service');
      }
    } catch (error: any) {
      console.error(`Error deleting service ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete service');
    }
  }
  
  async getProviderServices(providerId: string, filters?: ServiceFilters): Promise<ServicesResponse> {
    try {
      const response = await esmApiClient.get<ApiResponse<ServicesResponse>>(`/esm/sellers/${providerId}/services`, {
        params: filters
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch provider services');
    } catch (error: any) {
      console.error(`Error fetching services for provider ${providerId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch provider services');
    }
  }
  
  async bookService(serviceId: string, bookingData: any): Promise<any> {
    try {
      const response = await esmApiClient.post<ApiResponse<any>>(`/esm/services/${serviceId}/book`, bookingData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to book service');
    } catch (error: any) {
      console.error(`Error booking service ${serviceId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to book service');
    }
  }
  
  async uploadServiceImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await esmApiClient.post<ApiResponse<{ url: string }>>('/esm/services/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data.url;
      }
      
      throw new Error(response.data.message || 'Failed to upload image');
    } catch (error: any) {
      console.error('Error uploading service image:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }
}

export default new EsmServiceService();