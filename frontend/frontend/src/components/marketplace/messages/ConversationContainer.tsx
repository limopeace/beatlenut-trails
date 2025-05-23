import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageThread from './MessageThread';
import ComposeMessage from './ComposeMessage';
import ContactShareRequest from './ContactShareRequest';
import ContactInfoDisplay from './ContactInfoDisplay';

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  subject?: string;
  relatedTo?: {
    type: 'product' | 'order' | 'service';
    id: string;
    title: string;
  };
  contactShared?: boolean;
}

interface Message {
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
}

interface ContactInfo {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  sharedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface ConversationContainerProps {
  conversationId: string;
  currentUserId: string;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversationId,
  currentUserId
}) => {
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showContactShareForm, setShowContactShareForm] = useState(false);
  const [contactShares, setContactShares] = useState<{
    sent?: ContactInfo;
    received?: ContactInfo;
    request?: ContactInfo;
  }>({});
  const [isProcessingContactRequest, setIsProcessingContactRequest] = useState(false);
  
  // Fetch conversation details and messages
  useEffect(() => {
    if (!conversationId) return;
    
    const fetchConversationAndMessages = async () => {
      setIsLoading(true);
      try {
        // Fetch conversation details
        const conversationResponse = await fetch(`/api/messages/conversations/${conversationId}`);
        if (!conversationResponse.ok) {
          throw new Error('Failed to fetch conversation');
        }
        const conversationData = await conversationResponse.json();
        setConversation(conversationData);
        
        // Fetch messages for this conversation
        const messagesResponse = await fetch(`/api/messages/conversations/${conversationId}/messages`);
        if (!messagesResponse.ok) {
          throw new Error('Failed to fetch messages');
        }
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
        
        // Fetch contact shares for this conversation
        // In a real app, this would be an API call
        // const contactSharesResponse = await fetch(`/api/messages/conversations/${conversationId}/contact-shares`);
        // if (!contactSharesResponse.ok) {
        //   throw new Error('Failed to fetch contact shares');
        // }
        // const contactSharesData = await contactSharesResponse.json();
        // setContactShares(contactSharesData);
        
        // Mock data for demonstration
        // This would normally come from the backend
        const otherParticipant = conversationData.participants.find(p => p.id !== currentUserId);
        
        // Sample contact shares for demo purposes
        // In a real app, this would be determined by the database
        const hasRequestedContact = Math.random() > 0.7;
        const hasSharedContact = Math.random() > 0.7;
        const hasReceivedContact = Math.random() > 0.7;
        
        const mockContactShares: {
          sent?: ContactInfo;
          received?: ContactInfo;
          request?: ContactInfo;
        } = {};
        
        if (hasSharedContact) {
          mockContactShares.sent = {
            id: 'shared1',
            userId: currentUserId,
            name: 'You',
            phone: '9876543210',
            email: 'you@example.com',
            message: 'Here is my contact information to discuss the details further.',
            sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'accepted'
          };
        }
        
        if (hasReceivedContact) {
          mockContactShares.received = {
            id: 'received1',
            userId: otherParticipant.id,
            name: otherParticipant.name,
            phone: '9876543210',
            email: 'other@example.com',
            message: 'Here is my contact information to discuss the details further.',
            sharedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'accepted'
          };
        }
        
        if (hasRequestedContact) {
          mockContactShares.request = {
            id: 'request1',
            userId: otherParticipant.id,
            name: otherParticipant.name,
            message: 'I would like to discuss the details over phone. Please share your contact information.',
            sharedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          };
        }
        
        setContactShares(mockContactShares);
      } catch (error) {
        console.error('Error fetching conversation data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversationAndMessages();
  }, [conversationId, currentUserId]);
  
  // Mark message as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      
      // Update message in state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      
      // Update unread count in conversation
      if (conversation) {
        setConversation({
          ...conversation,
          unreadCount: Math.max(0, conversation.unreadCount - 1)
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Send a new message
  const handleSendMessage = async (content: string, attachments: File[]) => {
    if ((!content.trim() && attachments.length === 0) || !conversationId) return;
    
    setIsSending(true);
    try {
      // Create form data for message with attachments
      const formData = new FormData();
      formData.append('content', content);
      formData.append('conversationId', conversationId);
      
      // Add each attachment to form data
      attachments.forEach((file) => {
        formData.append(`attachments`, file);
      });
      
      // Send the message
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const newMessage = await response.json();
      
      // Update messages state with new message
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Update conversation last message
      if (conversation) {
        setConversation({
          ...conversation,
          lastMessage: {
            id: newMessage.id,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            senderId: currentUserId
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw to let ComposeMessage component handle it
    } finally {
      setIsSending(false);
    }
  };
  
  // Share contact information
  const handleShareContact = async (contactInfo: { phone?: string; email?: string; message: string }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/messages/conversations/${conversationId}/share-contact`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactInfo)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to share contact information');
      // }
      
      // const data = await response.json();
      
      // Mock successful response
      // This would normally come from the backend
      const mockResponse = {
        id: `shared${Date.now()}`,
        userId: currentUserId,
        name: 'You',
        ...contactInfo,
        sharedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Update state with new contact share
      setContactShares(prev => ({
        ...prev,
        sent: mockResponse
      }));
      
      // Hide the form
      setShowContactShareForm(false);
      
      // Notify user
      alert('Contact information shared successfully! The other party will be notified.');
    } catch (error) {
      console.error('Error sharing contact information:', error);
      throw error;
    }
  };
  
  // Handle accept contact share request
  const handleAcceptContactRequest = async () => {
    if (!contactShares.request) return;
    
    setIsProcessingContactRequest(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/messages/contact-shares/${contactShares.request.id}/accept`, {
      //   method: 'POST'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to accept contact share request');
      // }
      
      // const data = await response.json();
      
      // Mock successful response
      // This would normally come from the backend
      const mockResponse = {
        id: `received${Date.now()}`,
        userId: contactShares.request.userId,
        name: contactShares.request.name,
        phone: '9876543210', // This would be the requester's actual contact info
        email: 'requester@example.com', // This would be the requester's actual contact info
        message: contactShares.request.message,
        sharedAt: new Date().toISOString(),
        status: 'accepted'
      };
      
      // Update state
      setContactShares(prev => ({
        ...prev,
        received: mockResponse,
        request: undefined
      }));
      
      // Show contact share form to share your own info back
      setShowContactShareForm(true);
    } catch (error) {
      console.error('Error accepting contact share request:', error);
      alert('Failed to accept contact share request. Please try again.');
    } finally {
      setIsProcessingContactRequest(false);
    }
  };
  
  // Handle decline contact share request
  const handleDeclineContactRequest = async () => {
    if (!contactShares.request) return;
    
    setIsProcessingContactRequest(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/messages/contact-shares/${contactShares.request.id}/decline`, {
      //   method: 'POST'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to decline contact share request');
      // }
      
      // Update state
      setContactShares(prev => ({
        ...prev,
        request: undefined
      }));
    } catch (error) {
      console.error('Error declining contact share request:', error);
      alert('Failed to decline contact share request. Please try again.');
    } finally {
      setIsProcessingContactRequest(false);
    }
  };
  
  // Get the other participant (for displaying conversation header)
  const getOtherParticipant = () => {
    if (!conversation) return null;
    return conversation.participants.find(p => p.id !== currentUserId) || null;
  };
  
  const otherParticipant = getOtherParticipant();
  
  // Determine if contact sharing is possible
  const canShareContact = !contactShares.sent && messages.length >= 3;
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="ml-3 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              {/* Back button (mobile only) */}
              <button 
                className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                onClick={() => router.back()}
                aria-label="Back to conversations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Avatar */}
              {otherParticipant?.avatar ? (
                <div className="h-10 w-10 rounded-full overflow-hidden relative">
                  <img 
                    src={otherParticipant.avatar} 
                    alt={otherParticipant.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  {otherParticipant?.name.charAt(0) || '?'}
                </div>
              )}
              
              {/* Name and related info */}
              <div className="ml-3">
                <h3 className="font-medium">{otherParticipant?.name || 'Unknown'}</h3>
                {conversation?.relatedTo && (
                  <p className="text-xs text-gray-500">
                    {conversation.relatedTo.type === 'product' && 'About product: '}
                    {conversation.relatedTo.type === 'service' && 'About service: '}
                    {conversation.relatedTo.type === 'order' && 'About order: '}
                    {conversation.relatedTo.title}
                  </p>
                )}
              </div>
            </div>
            
            {/* Share contact button */}
            {canShareContact && (
              <button
                onClick={() => setShowContactShareForm(true)}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Share Contact
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Message thread */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact information displays */}
        {!isLoading && (
          <div className="p-4">
            {/* Contact share request (from other user) */}
            {contactShares.request && (
              <ContactInfoDisplay
                contact={contactShares.request}
                type="request"
                onAccept={handleAcceptContactRequest}
                onDecline={handleDeclineContactRequest}
                isProcessing={isProcessingContactRequest}
              />
            )}
            
            {/* Received contact information */}
            {contactShares.received && (
              <ContactInfoDisplay
                contact={contactShares.received}
                type="received"
              />
            )}
            
            {/* Sent contact information */}
            {contactShares.sent && (
              <ContactInfoDisplay
                contact={contactShares.sent}
                type="sent"
              />
            )}
            
            {/* Contact share form */}
            {showContactShareForm && !contactShares.sent && (
              <ContactShareRequest
                onShare={handleShareContact}
                onCancel={() => setShowContactShareForm(false)}
                contactType="both"
              />
            )}
          </div>
        )}
        
        {/* Message thread */}
        <MessageThread
          messages={messages}
          currentUserId={currentUserId}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
      
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