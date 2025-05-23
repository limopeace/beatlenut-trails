import React from 'react';

interface ContactInfoDisplayProps {
  contact: {
    name: string;
    phone?: string;
    email?: string;
    message?: string;
    sharedAt: string;
  };
  type: 'received' | 'sent' | 'request';
  onAccept?: () => Promise<void>;
  onDecline?: () => Promise<void>;
  isProcessing?: boolean;
}

const ContactInfoDisplay: React.FC<ContactInfoDisplayProps> = ({
  contact,
  type,
  onAccept,
  onDecline,
  isProcessing = false
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div 
      className={`p-4 rounded-lg mb-4 ${
        type === 'received' 
          ? 'bg-green-50 border border-green-200' 
          : type === 'sent' 
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'received' && (
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          
          {type === 'sent' && (
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          
          {type === 'request' && (
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${
            type === 'received' 
              ? 'text-green-800' 
              : type === 'sent' 
              ? 'text-blue-800'
              : 'text-yellow-800'
          }`}>
            {type === 'received' 
              ? `${contact.name}'s Contact Information` 
              : type === 'sent' 
              ? 'Your Shared Contact Information'
              : `${contact.name} would like to share contact information`
            }
          </h3>
          
          <div className={`mt-2 text-sm ${
            type === 'received' 
              ? 'text-green-700' 
              : type === 'sent' 
              ? 'text-blue-700'
              : 'text-yellow-700'
          }`}>
            {type === 'request' ? (
              <div>
                <p className="font-medium">Message:</p>
                <p className="italic">"{contact.message}"</p>
              </div>
            ) : (
              <div className="space-y-1">
                {contact.phone && (
                  <div className="flex">
                    <span className="font-medium mr-2">Phone:</span>
                    <a 
                      href={`tel:${contact.phone}`} 
                      className={`${
                        type === 'received' ? 'text-green-800' : 'text-blue-800'
                      } hover:underline`}
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                {contact.email && (
                  <div className="flex">
                    <span className="font-medium mr-2">Email:</span>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className={`${
                        type === 'received' ? 'text-green-800' : 'text-blue-800'
                      } hover:underline`}
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.message && (
                  <div>
                    <span className="font-medium">Message:</span>
                    <p className="italic">"{contact.message}"</p>
                  </div>
                )}
              </div>
            )}
            
            <p className="mt-1 text-xs">
              {type === 'request'
                ? `Received: ${formatDate(contact.sharedAt)}`
                : `Shared: ${formatDate(contact.sharedAt)}`
              }
            </p>
          </div>
          
          {/* Action buttons for request */}
          {type === 'request' && onAccept && onDecline && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onDecline}
                disabled={isProcessing}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                disabled={isProcessing}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Accept & Share Your Contact'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoDisplay;