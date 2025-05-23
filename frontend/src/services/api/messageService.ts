import { AxiosResponse } from 'axios';
import { esmApiClient, ApiResponse } from './apiClient';

// Types
export interface Participant {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  isSeller: boolean;
  lastRead: string;
  sellerProfile?: {
    _id: string;
    businessName: string;
    logoImage?: string;
  };
}

export interface LatestMessage {
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  _id: string;
  conversationId: string;
  participants: Participant[];
  subject?: string;
  relatedItem?: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  relatedItemType?: 'product' | 'service' | null;
  relatedOrder?: {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
  };
  latestMessage?: LatestMessage;
  messageCount: number;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  isSenderSeller: boolean;
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  isRecipientSeller: boolean;
  content: string;
  relatedItem?: string;
  relatedItemType?: 'product' | 'service' | null;
  relatedOrder?: string;
  isRead: boolean;
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
  status: 'active' | 'archived' | 'deleted' | 'flagged';
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  messages: Message[];
  conversation: Conversation;
}

export interface MessageParams {
  recipientId: string;
  content: string;
  subject?: string;
  relatedItemId?: string;
  relatedItemType?: 'product' | 'service';
  relatedOrderId?: string;
  attachments?: File[];
}

export interface ConversationQueryParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'archived';
  unreadOnly?: boolean;
}

// Message Service
const MessageService = {
  // Get all conversations for current user
  getUserConversations: async (params?: ConversationQueryParams): Promise<Conversation[]> => {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    
    const url = `/messages/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response: AxiosResponse<ApiResponse<Conversation[]>> = await esmApiClient.get(url);
    return response.data.data;
  },
  
  // Get messages for a specific conversation
  getConversationMessages: async (conversationId: string, params?: { limit?: number; skip?: number }): Promise<ConversationResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    const url = `/messages/conversations/${conversationId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response: AxiosResponse<ApiResponse<ConversationResponse>> = await esmApiClient.get(url);
    return response.data.data;
  },
  
  // Send a new message
  sendMessage: async (messageData: MessageParams): Promise<{ message: Message; conversation: Conversation }> => {
    // If there are attachments, use FormData
    if (messageData.attachments && messageData.attachments.length > 0) {
      const formData = new FormData();
      formData.append('recipientId', messageData.recipientId);
      formData.append('content', messageData.content);
      
      if (messageData.subject) {
        formData.append('subject', messageData.subject);
      }
      
      if (messageData.relatedItemId) {
        formData.append('relatedItemId', messageData.relatedItemId);
      }
      
      if (messageData.relatedItemType) {
        formData.append('relatedItemType', messageData.relatedItemType);
      }
      
      if (messageData.relatedOrderId) {
        formData.append('relatedOrderId', messageData.relatedOrderId);
      }
      
      messageData.attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      const response: AxiosResponse<ApiResponse<{ message: Message; conversation: Conversation }>> = 
        await esmApiClient.post('/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      
      return response.data.data;
    } else {
      // If no attachments, use JSON
      const response: AxiosResponse<ApiResponse<{ message: Message; conversation: Conversation }>> = 
        await esmApiClient.post('/messages', messageData);
      
      return response.data.data;
    }
  },
  
  // Mark a conversation as read
  markConversationAsRead: async (conversationId: string): Promise<{ modifiedCount: number }> => {
    const response: AxiosResponse<ApiResponse<{ modifiedCount: number }>> = 
      await esmApiClient.post(`/messages/conversations/${conversationId}/read`);
    
    return response.data.data;
  },
  
  // Mark a specific message as read
  markMessageAsRead: async (messageId: string): Promise<Message> => {
    const response: AxiosResponse<ApiResponse<Message>> = 
      await esmApiClient.patch(`/messages/${messageId}/read`);
    
    return response.data.data;
  },
  
  // Get the number of unread conversations
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response: AxiosResponse<ApiResponse<{ count: number }>> = 
      await esmApiClient.get('/messages/conversations/unread-count');
    
    return response.data.data;
  },
  
  // Search for conversations
  searchConversations: async (searchTerm: string, params?: { limit?: number; skip?: number }): Promise<Conversation[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', searchTerm);
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    const url = `/messages/conversations/search?${queryParams.toString()}`;
    
    const response: AxiosResponse<ApiResponse<Conversation[]>> = await esmApiClient.get(url);
    return response.data.data;
  },
  
  // Archive a conversation
  archiveConversation: async (conversationId: string): Promise<Conversation> => {
    const response: AxiosResponse<ApiResponse<Conversation>> = 
      await esmApiClient.patch(`/messages/conversations/${conversationId}/archive`);
    
    return response.data.data;
  },
  
  // Delete a message (soft delete)
  deleteMessage: async (messageId: string): Promise<Message> => {
    const response: AxiosResponse<ApiResponse<Message>> = 
      await esmApiClient.delete(`/messages/${messageId}`);
    
    return response.data.data;
  }
};

export default MessageService;