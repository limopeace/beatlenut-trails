'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ConversationContainer from '@/components/marketplace/messages/ConversationContainer';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;
  
  // In a real app, this would be fetched from auth context
  const currentUserId = 'user-123'; // Mock current user ID
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-0 h-screen">
        <div className="bg-white rounded-lg shadow-sm h-full">
          <ConversationContainer
            conversationId={conversationId}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}