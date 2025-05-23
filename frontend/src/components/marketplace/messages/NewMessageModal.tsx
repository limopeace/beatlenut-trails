import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ComposeMessage from './ComposeMessage';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  relatedTo?: {
    type: 'product' | 'service' | 'order';
    id: string;
    title: string;
  };
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  relatedTo
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Start a new conversation
  const handleSendMessage = async (content: string, attachments: File[]) => {
    if (!content.trim() && attachments.length === 0) return;
    
    setIsLoading(true);
    try {
      // Create form data for new conversation
      const formData = new FormData();
      formData.append('recipientId', recipientId);
      formData.append('content', content);
      
      if (subject) {
        formData.append('subject', subject);
      }
      
      // Add related item if provided
      if (relatedTo) {
        formData.append('relatedType', relatedTo.type);
        formData.append('relatedId', relatedTo.id);
        formData.append('relatedTitle', relatedTo.title);
      }
      
      // Add each attachment to form data
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
      
      // Create new conversation
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }
      
      const { conversationId } = await response.json();
      
      // Close modal
      onClose();
      
      // Navigate to messages page with the new conversation selected
      router.push(`/esm-portal/messages?conversation=${conversationId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">New Message to {recipientName}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Subject field */}
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject (optional)
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a subject..."
                disabled={isLoading}
              />
            </div>
            
            {/* Related to information */}
            {relatedTo && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">
                    {relatedTo.type === 'product' && 'Regarding product: '}
                    {relatedTo.type === 'service' && 'Regarding service: '}
                    {relatedTo.type === 'order' && 'Regarding order: '}
                  </span>
                  {relatedTo.title}
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              {/* Placeholder for the empty space where ComposeMessage will be */}
              <div className="h-32 border border-gray-300 rounded-md bg-gray-50"></div>
            </div>
          </div>
        </div>
        
        {/* Compose area */}
        <div className="border-t border-gray-200">
          <ComposeMessage
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;