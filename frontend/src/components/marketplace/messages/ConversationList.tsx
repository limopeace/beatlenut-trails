'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Define interface for conversation data
interface Participant {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  isSeller: boolean;
  lastRead: string;
  sellerProfile?: {
    _id: string;
    businessName: string;
    logoImage?: string;
  };
}

interface LatestMessage {
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  conversationId: string;
  participants: Participant[];
  subject?: string;
  latestMessage?: LatestMessage;
  messageCount: number;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
}

interface ConversationListProps {
  selectedConversation?: string;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  selectedConversation, 
  onSelectConversation,
  currentUserId
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch(`/api/esm/messages/conversations?${filter === 'unread' ? 'unreadOnly=true' : ''}`);
      // const data = await response.json();
      // setConversations(data.data);
      
      // For demo, we'll use mock data
      setTimeout(() => {
        const mockConversations: Conversation[] = [
          {
            _id: '1',
            conversationId: 'conv_123_456',
            participants: [
              {
                user: {
                  _id: currentUserId,
                  firstName: 'Current',
                  lastName: 'User',
                  email: 'current.user@example.com'
                },
                isSeller: false,
                lastRead: new Date().toISOString()
              },
              {
                user: {
                  _id: '456',
                  firstName: 'John',
                  lastName: 'Seller',
                  email: 'john.seller@example.com',
                  profileImage: '/images/logo/beatlenut-logo.svg'
                },
                isSeller: true,
                lastRead: new Date(Date.now() - 3600000).toISOString(),
                sellerProfile: {
                  _id: 'seller_1',
                  businessName: 'Adventure Gear Co.',
                  logoImage: '/images/logo/beatlenut-logo.svg'
                }
              }
            ],
            subject: 'Premium Hiking Backpack Inquiry',
            latestMessage: {
              sender: {
                _id: '456',
                firstName: 'John',
                lastName: 'Seller'
              },
              content: 'Yes, the backpack is waterproof and comes with a 1-year warranty.',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              isRead: false
            },
            messageCount: 5,
            updatedAt: new Date(Date.now() - 1800000).toISOString(),
            status: 'active'
          },
          {
            _id: '2',
            conversationId: 'conv_123_789',
            participants: [
              {
                user: {
                  _id: currentUserId,
                  firstName: 'Current',
                  lastName: 'User',
                  email: 'current.user@example.com'
                },
                isSeller: false,
                lastRead: new Date().toISOString()
              },
              {
                user: {
                  _id: '789',
                  firstName: 'Sarah',
                  lastName: 'Guide',
                  email: 'sarah.guide@example.com'
                },
                isSeller: true,
                lastRead: new Date(Date.now() - 7200000).toISOString(),
                sellerProfile: {
                  _id: 'seller_2',
                  businessName: 'Himalayan Treks',
                  logoImage: '/images/logo/beatlenut-logo.svg'
                }
              }
            ],
            subject: 'Adventure Photography Tour Booking',
            latestMessage: {
              sender: {
                _id: currentUserId,
                firstName: 'Current',
                lastName: 'User'
              },
              content: 'I\'m interested in the photography tour next month. Do you have availability?',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              isRead: true
            },
            messageCount: 3,
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'active'
          },
          {
            _id: '3',
            conversationId: 'conv_123_101',
            participants: [
              {
                user: {
                  _id: currentUserId,
                  firstName: 'Current',
                  lastName: 'User',
                  email: 'current.user@example.com'
                },
                isSeller: false,
                lastRead: new Date(Date.now() - 3600000).toISOString()
              },
              {
                user: {
                  _id: '101',
                  firstName: 'Mike',
                  lastName: 'Equipment',
                  email: 'mike.equipment@example.com'
                },
                isSeller: true,
                lastRead: new Date(Date.now() - 3600000).toISOString(),
                sellerProfile: {
                  _id: 'seller_3',
                  businessName: 'Mountain Gear Specialists',
                  logoImage: '/images/logo/beatlenut-logo.svg'
                }
              }
            ],
            subject: 'Order #ESM2310000123 Support',
            latestMessage: {
              sender: {
                _id: '101',
                firstName: 'Mike',
                lastName: 'Equipment'
              },
              content: 'Your replacement tent poles have been shipped and should arrive in 2-3 days.',
              timestamp: new Date(Date.now() - 43200000).toISOString(),
              isRead: false
            },
            messageCount: 8,
            updatedAt: new Date(Date.now() - 43200000).toISOString(),
            status: 'active'
          }
        ];
        
        // Apply filters
        let filteredConversations = [...mockConversations];
        
        if (filter === 'unread') {
          filteredConversations = filteredConversations.filter(
            conv => conv.latestMessage && 
                    !conv.latestMessage.isRead && 
                    conv.latestMessage.sender._id !== currentUserId
          );
        }
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredConversations = filteredConversations.filter(conv => {
            // Search in subject
            if (conv.subject?.toLowerCase().includes(term)) return true;
            
            // Search in participants
            const otherParticipant = conv.participants.find(p => p.user._id !== currentUserId);
            if (otherParticipant?.user.firstName.toLowerCase().includes(term) ||
                otherParticipant?.user.lastName.toLowerCase().includes(term) ||
                otherParticipant?.sellerProfile?.businessName.toLowerCase().includes(term)) {
              return true;
            }
            
            // Search in latest message
            if (conv.latestMessage?.content.toLowerCase().includes(term)) return true;
            
            return false;
          });
        }
        
        setConversations(filteredConversations);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [currentUserId, filter]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConversations();
  };

  // Get details of the other participant
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.user._id !== currentUserId);
  };

  // Format time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return 'Unknown time';
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchConversations}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
        
        {/* Search & Filters */}
        <div className="mt-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Search
            </button>
          </form>
          
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'unread' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <svg 
              className="w-12 h-12 mb-2 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            <p className="text-sm">No conversations found</p>
            {filter === 'unread' && (
              <button
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setFilter('all')}
              >
                View all conversations
              </button>
            )}
            {searchTerm && (
              <button
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setSearchTerm('');
                  fetchConversations();
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isUnread = conversation.latestMessage && 
                              !conversation.latestMessage.isRead && 
                              conversation.latestMessage.sender._id !== currentUserId;
              
              return (
                <li 
                  key={conversation._id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedConversation === conversation.conversationId 
                      ? 'bg-blue-50' 
                      : isUnread ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.conversationId)}
                >
                  <div className="flex p-4">
                    <div className="flex-shrink-0">
                      {otherParticipant?.isSeller && otherParticipant?.sellerProfile?.logoImage ? (
                        <Image 
                          src={otherParticipant.sellerProfile.logoImage}
                          alt={otherParticipant.sellerProfile.businessName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : otherParticipant?.user.profileImage ? (
                        <Image 
                          src={otherParticipant.user.profileImage}
                          alt={`${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {otherParticipant?.user.firstName.charAt(0)}
                          {otherParticipant?.user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant?.isSeller && otherParticipant?.sellerProfile 
                            ? otherParticipant.sellerProfile.businessName
                            : `${otherParticipant?.user.firstName} ${otherParticipant?.user.lastName}`
                          }
                        </h3>
                        <p className="text-xs text-gray-500">
                          {conversation.latestMessage 
                            ? formatTime(conversation.latestMessage.timestamp)
                            : formatTime(conversation.updatedAt)
                          }
                        </p>
                      </div>
                      
                      {conversation.subject && (
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {conversation.subject}
                        </p>
                      )}
                      
                      <div className="flex items-center">
                        {conversation.latestMessage && (
                          <p className={`text-sm truncate ${
                            isUnread ? 'font-medium text-gray-900' : 'text-gray-500'
                          }`}>
                            {conversation.latestMessage.sender._id === currentUserId && (
                              <span className="text-xs text-gray-500 mr-1">You: </span>
                            )}
                            {conversation.latestMessage.content}
                          </p>
                        )}
                        
                        {isUnread && (
                          <span className="ml-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* New Message Button */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/esm-portal/messages/new"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          New Message
        </Link>
      </div>
    </div>
  );
};

export default ConversationList;