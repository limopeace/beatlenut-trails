'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEsmAuth } from '@/hooks/useEsmAuth';
import EsmAuthService from '@/services/api/esmAuthService';

interface Message {
  _id: string;
  conversationId: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedItem?: {
    _id: string;
    name: string;
    price: number;
  };
}

interface Conversation {
  conversationId: string;
  otherParticipant: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isFromMe: boolean;
  };
  unreadCount: number;
  totalMessages: number;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  currentConversation: Message[];
  unreadCount: number;
  isTyping: { [conversationId: string]: string[] };
  
  // Actions
  joinConversation: (otherUserId: string) => void;
  sendMessage: (receiverId: string, content: string, relatedItem?: string) => void;
  getConversationHistory: (otherUserId: string, page?: number) => void;
  getConversations: () => void;
  markAsRead: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useEsmAuth();
  const token = EsmAuthService.getToken();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState<{ [conversationId: string]: string[] }>({});

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const baseUrl = apiUrl.replace('/api', '');
      
      const newSocket = io(baseUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Message event handlers
      newSocket.on('new_message', (message: Message) => {
        console.log('New message received:', message);
        
        // Add to current conversation if it matches
        setCurrentConversation(prev => {
          const isCurrentConversation = prev.length > 0 && 
            prev[0].conversationId === message.conversationId;
          
          if (isCurrentConversation) {
            return [...prev, message];
          }
          return prev;
        });

        // Update conversations list
        setConversations(prev => {
          const existingIndex = prev.findIndex(
            conv => conv.conversationId === message.conversationId
          );
          
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
                isFromMe: message.sender._id === user.id
              },
              unreadCount: message.recipient._id === user.id 
                ? updated[existingIndex].unreadCount + 1 
                : updated[existingIndex].unreadCount
            };
            return updated;
          }
          return prev;
        });

        // Update unread count
        if (message.recipient._id === user.id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      newSocket.on('message_notification', (notification) => {
        console.log('Message notification:', notification);
        // Handle push notifications here if needed
      });

      newSocket.on('user_typing', ({ userId, userName, conversationId }) => {
        setIsTyping(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), userName]
        }));
      });

      newSocket.on('user_stopped_typing', ({ userId, conversationId }) => {
        setIsTyping(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(name => name !== userId)
        }));
      });

      newSocket.on('messages_read', ({ conversationId, readBy }) => {
        if (readBy !== user.id) {
          setCurrentConversation(prev => 
            prev.map(msg => 
              msg.conversationId === conversationId && msg.recipient._id === readBy
                ? { ...msg, isRead: true }
                : msg
            )
          );
        }
      });

      newSocket.on('conversation_history', ({ messages, conversationId, pagination }) => {
        console.log('Conversation history received:', { messages, conversationId });
        setCurrentConversation(messages);
      });

      newSocket.on('conversations_list', (conversationsList) => {
        console.log('Conversations list received:', conversationsList);
        setConversations(conversationsList);
      });

      newSocket.on('joined_conversation', ({ conversationId, otherUserId }) => {
        console.log('Joined conversation:', conversationId);
      });

      newSocket.on('message_sent', ({ messageId, conversationId }) => {
        console.log('Message sent confirmation:', messageId);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  // Socket action methods
  const joinConversation = useCallback((otherUserId: string) => {
    if (socket) {
      socket.emit('join_conversation', { otherUserId });
    }
  }, [socket]);

  const sendMessage = useCallback((receiverId: string, content: string, relatedItem?: string) => {
    if (socket && content.trim()) {
      socket.emit('send_message', {
        receiverId,
        content: content.trim(),
        relatedItem,
        relatedItemType: relatedItem ? 'product' : undefined
      });
    }
  }, [socket]);

  const getConversationHistory = useCallback((otherUserId: string, page: number = 1) => {
    if (socket) {
      socket.emit('get_conversation_history', { otherUserId, page });
    }
  }, [socket]);

  const getConversations = useCallback(() => {
    if (socket) {
      socket.emit('get_conversations');
    }
  }, [socket]);

  const markAsRead = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('mark_as_read', { conversationId });
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.conversationId === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setCurrentConversation(prev => 
        prev.map(msg => 
          msg.conversationId === conversationId && msg.recipient._id === user?.id
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  }, [socket, user]);

  const startTyping = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('typing_start', { conversationId });
    }
  }, [socket]);

  const stopTyping = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('typing_stop', { conversationId });
    }
  }, [socket]);

  // Auto-fetch conversations when connected
  useEffect(() => {
    if (isConnected && socket) {
      getConversations();
    }
  }, [isConnected, socket, getConversations]);

  const value: SocketContextType = {
    socket,
    isConnected,
    conversations,
    currentConversation,
    unreadCount,
    isTyping,
    joinConversation,
    sendMessage,
    getConversationHistory,
    getConversations,
    markAsRead,
    startTyping,
    stopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};