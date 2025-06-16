'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { formatDistanceToNow } from 'date-fns';

interface MessagingInterfaceProps {
  otherUserId?: string;
  otherUserName?: string;
  className?: string;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  otherUserId,
  otherUserName,
  className = ''
}) => {
  const {
    socket,
    isConnected,
    conversations,
    currentConversation,
    unreadCount,
    joinConversation,
    sendMessage,
    getConversationHistory,
    markAsRead,
    startTyping,
    stopTyping
  } = useSocket();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  // Auto-join conversation if otherUserId is provided
  useEffect(() => {
    if (otherUserId && isConnected) {
      joinConversation(otherUserId);
      getConversationHistory(otherUserId);
      setSelectedConversation(otherUserId);
    }
  }, [otherUserId, isConnected, joinConversation, getConversationHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;

    sendMessage(selectedConversation, messageInput);
    setMessageInput('');
    handleStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    if (!isTyping && selectedConversation) {
      setIsTyping(true);
      // Use socket to emit typing event - we'll need to get conversationId
      // startTyping(conversationId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (isTyping && selectedConversation) {
      setIsTyping(false);
      // stopTyping(conversationId);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const selectConversation = (conversation: any) => {
    setSelectedConversation(conversation.otherParticipant._id);
    markAsRead(conversation.conversationId);
    getConversationHistory(conversation.otherParticipant._id);
  };

  const renderMessage = (message: any, index: number) => {
    const isFromMe = message.sender._id === socket?.id; // This needs to be fixed - should compare with current user ID
    const messageTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    return (
      <div
        key={message._id}
        className={`flex mb-4 ${isFromMe ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isFromMe
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isFromMe ? 'text-blue-100' : 'text-gray-500'}`}>
            {messageTime}
          </p>
          {message.relatedItem && (
            <div className={`mt-2 p-2 rounded ${isFromMe ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <p className="text-xs font-semibold">Related Product:</p>
              <p className="text-xs">{message.relatedItem.name}</p>
              <p className="text-xs">₹{message.relatedItem.price}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Connecting to messaging...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-96 bg-white rounded-lg shadow-lg ${className}`}>
      {/* Conversations List */}
      {!otherUserId && (
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            {unreadCount > 0 && (
              <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                onClick={() => selectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.otherParticipant._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {conversation.otherParticipant.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={`${otherUserId ? 'w-full' : 'w-2/3'} flex flex-col`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {otherUserName || (selectedConversation ? 'Chat' : 'Select a conversation')}
          </h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedConversation || otherUserId ? (
            <>
              {currentConversation.map((message, index) => renderMessage(message, index))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>

        {/* Message Input */}
        {(selectedConversation || otherUserId) && (
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex">
              <textarea
                value={messageInput}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
            {isTyping && (
              <p className="text-xs text-gray-500 mt-1">Typing...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;