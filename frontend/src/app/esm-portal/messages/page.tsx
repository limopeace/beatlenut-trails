'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ConversationList from '@/components/marketplace/messages/ConversationList';
import ConversationContainer from '@/components/marketplace/messages/ConversationContainer';
import messageService, { Conversation } from '@/services/api/messageService';
import Cookies from 'js-cookie';

// Get user info from cookie
const getUserId = (): string => {
  try {
    const userCookie = Cookies.get('esm_user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      return userData._id || '';
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error);
  }
  return '';
};

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    searchParams.get('conversation')
  );
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const currentUserId = getUserId();
  
  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const data = await messageService.getUserConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);
  
  useEffect(() => {
    fetchConversations();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Update URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set('conversation', conversationId);
    window.history.pushState({}, '', url);
  };
  
  // Navigate to new message page
  const handleNewMessage = () => {
    router.push('/esm-portal/messages/new');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-9rem)]">
          {/* Conversations List - shown on larger screens or when no conversation is selected */}
          <div className={`
            ${selectedConversation ? 'hidden md:block' : 'block'} 
            md:w-1/3 bg-white rounded-lg shadow overflow-hidden h-full
          `}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                <button
                  onClick={handleNewMessage}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  New Message
                </button>
              </div>
            </div>
            
            <ConversationList
              selectedConversation={selectedConversation || undefined}
              onSelectConversation={handleSelectConversation}
              currentUserId={currentUserId}
            />
          </div>
          
          {/* Conversation Thread - shown when a conversation is selected */}
          {selectedConversation ? (
            <div className="flex-1 bg-white rounded-lg shadow overflow-hidden h-full">
              <ConversationContainer
                conversationId={selectedConversation}
                currentUserId={currentUserId}
                onBackClick={() => setSelectedConversation(null)}
              />
            </div>
          ) : (
            <div className="hidden md:flex md:flex-1 items-center justify-center bg-white rounded-lg shadow">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.5" 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">Your Messages</h3>
                <p className="text-gray-500">Select a conversation to view messages or start a new one.</p>
                <button
                  onClick={handleNewMessage}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Start a New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}