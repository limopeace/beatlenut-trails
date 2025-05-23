import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

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

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onMarkAsRead?: (messageId: string) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
  isLoading = false,
  onMarkAsRead
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessages]);

  // Update displayed messages and mark unread as read
  useEffect(() => {
    setDisplayedMessages(messages);
    
    // Mark unread messages as read when they are displayed
    messages.forEach(message => {
      if (!message.isRead && message.sender.id !== currentUserId && onMarkAsRead) {
        onMarkAsRead(message.id);
      }
    });
  }, [messages, currentUserId, onMarkAsRead]);

  // Format the timestamp to readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Render attachment based on type
  const renderAttachment = (attachment: { url: string; type: string; name: string }) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden my-2">
          <Image 
            src={attachment.url} 
            alt={attachment.name}
            fill
            className="object-cover"
          />
        </div>
      );
    } else if (attachment.type.startsWith('video/')) {
      return (
        <video 
          src={attachment.url} 
          controls 
          className="max-w-full h-auto rounded-lg my-2"
        />
      );
    } else {
      return (
        <a 
          href={attachment.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-2 bg-gray-100 rounded-md my-2 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">{attachment.name}</span>
        </a>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (displayedMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-4 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-center">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {displayedMessages.map((message, index) => {
        const isSentByCurrentUser = message.sender.id === currentUserId;
        
        return (
          <div 
            key={message.id} 
            className={`mb-4 flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${isSentByCurrentUser ? 'order-2' : 'order-1'}`}>
              {/* Message bubble */}
              <div 
                className={`px-4 py-3 rounded-lg ${
                  isSentByCurrentUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments?.map((attachment, i) => (
                  <div key={i} className="mt-2">
                    {renderAttachment(attachment)}
                  </div>
                ))}
              </div>
              
              {/* Timestamp */}
              <div className={`mt-1 text-xs text-gray-500 ${isSentByCurrentUser ? 'text-right' : 'text-left'}`}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
            
            {/* Avatar */}
            <div className={`flex-shrink-0 h-8 w-8 rounded-full overflow-hidden relative border border-gray-200 ${
              isSentByCurrentUser ? 'order-1 mr-2' : 'order-2 ml-2'
            }`}>
              {message.sender.avatar ? (
                <Image
                  src={message.sender.avatar}
                  alt={message.sender.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                  {message.sender.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageThread;