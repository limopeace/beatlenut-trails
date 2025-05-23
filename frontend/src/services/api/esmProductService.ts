import { esmApiClient, ApiResponse } from './apiClient';

export interface EsmProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  seller: {
    _id: string;
    name: string;
    businessName?: string;
  };
  category: string;
  images: string[];
  availability: boolean;
  units?: string;
  minOrderQuantity?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  availability?: boolean;
  units?: string;
  minOrderQuantity?: number;
  tags?: string[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  seller?: string;
  availability?: boolean;
  sortBy?: 'price' | 'date' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: EsmProduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

class EsmProductService {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    try {
      const response = await esmApiClient.get<ApiResponse<ProductsResponse>>('/esm/products', {
        params: filters
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch products');
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }
  
  async getProduct(id: string): Promise<EsmProduct> {
    try {
      const response = await esmApiClient.get<ApiResponse<EsmProduct>>(`/esm/products/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Product not found');
    } catch (error: any) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }
  
  async createProduct(data: CreateProductData): Promise<EsmProduct> {
    try {
      const response = await esmApiClient.post<ApiResponse<EsmProduct>>('/esm/products', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create product');
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  }
  
  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<EsmProduct> {
    try {
      const response = await esmApiClient.put<ApiResponse<EsmProduct>>(`/esm/products/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update product');
    } catch (error: any) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }
  
  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await esmApiClient.delete<ApiResponse<void>>(`/esm/products/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error: any) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }
  
  async getSellerProducts(sellerId: string, filters?: ProductFilters): Promise<ProductsResponse> {
    try {
      const response = await esmApiClient.get<ApiResponse<ProductsResponse>>(`/esm/sellers/${sellerId}/products`, {
        params: filters
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch seller products');
    } catch (error: any) {
      console.error(`Error fetching products for seller ${sellerId}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch seller products');
    }
  }
  
  async uploadProductImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await esmApiClient.post<ApiResponse<{ url: string }>>('/esm/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data.url;
      }
      
      throw new Error(response.data.message || 'Failed to upload image');
    } catch (error: any) {
      console.error('Error uploading product image:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }
}

export default new EsmProductService();