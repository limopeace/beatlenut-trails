import React, { useState } from 'react';

interface ContactShareRequestProps {
  onShare: (contactInfo: ContactInfo) => Promise<void>;
  onCancel: () => void;
  contactType: 'phone' | 'email' | 'both';
}

interface ContactInfo {
  phone?: string;
  email?: string;
  message: string;
}

const ContactShareRequest: React.FC<ContactShareRequestProps> = ({
  onShare,
  onCancel,
  contactType
}) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (contactType === 'phone' || contactType === 'both') {
      if (!contactInfo.phone?.trim()) {
        setError('Phone number is required');
        return;
      }
      
      if (!/^\d{10}$/.test(contactInfo.phone.replace(/[^0-9]/g, ''))) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
    }
    
    if (contactType === 'email' || contactType === 'both') {
      if (!contactInfo.email?.trim()) {
        setError('Email address is required');
        return;
      }
      
      if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    if (!contactInfo.message.trim()) {
      setError('Please provide a brief message explaining why you want to share contact information');
      return;
    }
    
    // Submit the form
    setIsSubmitting(true);
    try {
      await onShare(contactInfo);
    } catch (err) {
      console.error('Error sharing contact information:', err);
      setError('Failed to share contact information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">Share Contact Information</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              This will allow you to continue the conversation outside the platform. Your contact information will only be shared if the other party accepts your request.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {(contactType === 'phone' || contactType === 'both') && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={contactInfo.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
            
            {(contactType === 'email' || contactType === 'both') && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message*
              </label>
              <textarea
                name="message"
                id="message"
                value={contactInfo.message}
                onChange={handleChange}
                rows={2}
                placeholder="Briefly explain why you want to share your contact information"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Share Contact Info'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactShareRequest;