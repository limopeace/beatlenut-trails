import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MessageThread from './MessageThread';
import ComposeMessage from './ComposeMessage';
import messageService, { 
  Conversation as ConversationType, 
  Message as MessageType,
  ConversationResponse
} from '@/services/api/messageService';

interface ConversationContainerProps {
  conversationId: string;
  currentUserId: string;
  onBackClick?: () => void;
}

// Transform backend message to UI message format
const mapMessageToUIFormat = (message: MessageType, currentUserId: string): {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
} => {
  return {
    id: message._id,
    conversationId: message.conversationId,
    sender: {
      id: message.sender._id,
      name: `${message.sender.firstName} ${message.sender.lastName}`,
      avatar: message.sender.profileImage
    },
    content: message.content,
    timestamp: message.createdAt,
    isRead: message.isRead,
    attachments: message.attachments?.map(attachment => ({
      url: attachment.url,
      type: attachment.fileType,
      name: attachment.fileName
    }))
  };
};

const getOtherParticipantName = (conversation: ConversationType, currentUserId: string): string => {
  const otherParticipant = conversation.participants.find(
    p => p.user._id !== currentUserId
  );
  
  if (!otherParticipant) return 'Unknown';
  
  if (otherParticipant.isSeller && otherParticipant.sellerProfile) {
    return otherParticipant.sellerProfile.businessName;
  }
  
  return `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`;
};

const getOtherParticipantAvatar = (conversation: ConversationType, currentUserId: string): string | undefined => {
  const otherParticipant = conversation.participants.find(
    p => p.user._id !== currentUserId
  );
  
  if (!otherParticipant) return undefined;
  
  if (otherParticipant.isSeller && otherParticipant.sellerProfile) {
    return otherParticipant.sellerProfile.logoImage;
  }
  
  return otherParticipant.user.profileImage;
};

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversationId,
  currentUserId,
  onBackClick
}) => {
  const [conversation, setConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<ReturnType<typeof mapMessageToUIFormat>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Fetch conversation details and messages
  useEffect(() => {
    if (!conversationId || !currentUserId) return;
    
    const fetchConversationAndMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data: ConversationResponse = await messageService.getConversationMessages(conversationId);
        
        if (isMounted.current) {
          setConversation(data.conversation);
          setMessages(data.messages.map(msg => mapMessageToUIFormat(msg, currentUserId)));
          
          // Mark conversation as read
          await messageService.markConversationAsRead(conversationId);
        }
      } catch (error) {
        console.error('Error fetching conversation data:', error);
        if (isMounted.current) {
          setError('Failed to load conversation. Please try again.');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchConversationAndMessages();
    
    // Poll for new messages every 10 seconds
    const pollInterval = setInterval(fetchConversationAndMessages, 10000);
    
    return () => {
      clearInterval(pollInterval);
    };
  }, [conversationId, currentUserId]);
  
  // Mark message as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId);
      
      // Update message in state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Send a new message
  const handleSendMessage = async (content: string, attachments: File[]) => {
    if ((!content.trim() && attachments.length === 0) || !conversationId || !conversation) return;
    
    setIsSending(true);
    
    try {
      // Find recipient ID (the other participant)
      const otherParticipant = conversation.participants.find(
        p => p.user._id !== currentUserId
      );
      
      if (!otherParticipant) {
        throw new Error('Could not determine message recipient');
      }
      
      const recipientId = otherParticipant.user._id;
      
      // Send message
      const result = await messageService.sendMessage({
        recipientId,
        content,
        attachments
      });
      
      // Add new message to state
      const newUIMessage = mapMessageToUIFormat(result.message, currentUserId);
      setMessages(prev => [...prev, newUIMessage]);
      
      // Update conversation with latest message
      setConversation(result.conversation);
      
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium mb-2">Error Loading Conversation</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="border-b border-gray-200 p-4 flex items-center">
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="ml-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center">
            {/* Back button (mobile only) */}
            {onBackClick && (
              <button 
                className="md:hidden mr-3 p-1 rounded-full hover:bg-gray-100"
                onClick={onBackClick}
                aria-label="Back to conversations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Participant Avatar */}
            {conversation && (
              <>
                {getOtherParticipantAvatar(conversation, currentUserId) ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden relative">
                    <Image 
                      src={getOtherParticipantAvatar(conversation, currentUserId) || '/images/default-avatar.png'} 
                      alt={getOtherParticipantName(conversation, currentUserId)}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {getOtherParticipantName(conversation, currentUserId).charAt(0)}
                  </div>
                )}
                
                {/* Name and related info */}
                <div className="ml-3">
                  <h3 className="font-medium">{getOtherParticipantName(conversation, currentUserId)}</h3>
                  {conversation.subject && (
                    <p className="text-xs text-gray-500">{conversation.subject}</p>
                  )}
                  {conversation.relatedItem && (
                    <p className="text-xs text-gray-500">
                      {conversation.relatedItemType === 'product' && 'About product: '}
                      {conversation.relatedItemType === 'service' && 'About service: '}
                      {conversation.relatedItem.name}
                    </p>
                  )}
                  {conversation.relatedOrder && (
                    <p className="text-xs text-gray-500">
                      Order #{conversation.relatedOrder.orderNumber}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Message thread */}
      <MessageThread
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
      />
      
      {/* Compose message */}
      <ComposeMessage
        onSendMessage={handleSendMessage}
        isLoading={isSending}
        conversationId={conversationId}
      />
    </div>
  );
};

export default ConversationContainer;