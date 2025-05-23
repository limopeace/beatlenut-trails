'use client';

import React, { useState, useEffect } from 'react';

interface Participant {
  id: string;
  name: string;
  role: 'buyer' | 'seller';
  email: string;
  avatar?: string;
}

interface Related {
  type: 'product' | 'service' | 'order';
  id: string;
  title: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  hasAttachments: boolean;
  isRead: boolean;
  flagged: boolean;
}

interface Conversation {
  id: string;
  participants: Participant[];
  subject?: string;
  lastActivity: string;
  messageCount: number;
  flagged: boolean;
  relatedTo?: Related;
  keywordMatches?: {
    count: number;
    keywords: string[];
  };
  status: 'active' | 'archived' | 'reported';
}

export default function ConversationMonitoringPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'reported'>('all');
  const [interveneModal, setInterveneModal] = useState(false);
  const [interveneMessage, setInterveneMessage] = useState('');
  
  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/admin/conversations');
        // const data = await response.json();
        // setConversations(data);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockConversations: Conversation[] = [
            {
              id: 'conv1',
              participants: [
                {
                  id: 'user1',
                  name: 'John Buyer',
                  role: 'buyer',
                  email: 'john@example.com',
                  avatar: '/images/placeholder.jpg'
                },
                {
                  id: 'user2',
                  name: 'Sarah Seller',
                  role: 'seller',
                  email: 'sarah@example.com',
                  avatar: '/images/placeholder.jpg'
                }
              ],
              subject: 'Trekking Expedition Inquiry',
              lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              messageCount: 8,
              flagged: true,
              relatedTo: {
                type: 'service',
                id: 'serv1',
                title: 'Himalayan Trekking Guide'
              },
              keywordMatches: {
                count: 2,
                keywords: ['whatsapp', 'outside platform']
              },
              status: 'active'
            },
            {
              id: 'conv2',
              participants: [
                {
                  id: 'user3',
                  name: 'Mike Customer',
                  role: 'buyer',
                  email: 'mike@example.com',
                  avatar: '/images/placeholder.jpg'
                },
                {
                  id: 'user4',
                  name: 'Robert Provider',
                  role: 'seller',
                  email: 'robert@example.com',
                  avatar: '/images/placeholder.jpg'
                }
              ],
              subject: 'Equipment Rental Question',
              lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              messageCount: 12,
              flagged: false,
              relatedTo: {
                type: 'product',
                id: 'prod1',
                title: 'Camping Gear Package'
              },
              status: 'active'
            },
            {
              id: 'conv3',
              participants: [
                {
                  id: 'user5',
                  name: 'Lisa Client',
                  role: 'buyer',
                  email: 'lisa@example.com',
                  avatar: '/images/placeholder.jpg'
                },
                {
                  id: 'user6',
                  name: 'David Expert',
                  role: 'seller',
                  email: 'david@example.com',
                  avatar: '/images/placeholder.jpg'
                }
              ],
              subject: 'Photography Tour Scheduling',
              lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              messageCount: 5,
              flagged: false,
              relatedTo: {
                type: 'service',
                id: 'serv2',
                title: 'Wildlife Photography Tour'
              },
              status: 'active'
            },
            {
              id: 'conv4',
              participants: [
                {
                  id: 'user7',
                  name: 'Jennifer User',
                  role: 'buyer',
                  email: 'jennifer@example.com',
                  avatar: '/images/placeholder.jpg'
                },
                {
                  id: 'user8',
                  name: 'Thomas Seller',
                  role: 'seller',
                  email: 'thomas@example.com',
                  avatar: '/images/placeholder.jpg'
                }
              ],
              subject: 'Inappropriate Behavior Report',
              lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              messageCount: 7,
              flagged: true,
              status: 'reported'
            }
          ];
          
          setConversations(mockConversations);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;
    
    const fetchMessages = async () => {
      setIsMessagesLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/admin/conversations/${selectedConversation}/messages`);
        // const data = await response.json();
        // setMessages(data);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockMessages: Message[] = [
            {
              id: 'msg1',
              conversationId: selectedConversation,
              senderId: 'user1',
              content: 'Hello, I\'m interested in your trekking expedition service. What dates do you have available next month?',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg2',
              conversationId: selectedConversation,
              senderId: 'user2',
              content: 'Hi there! Thanks for your interest. We have expeditions starting on the 10th, 15th, and 22nd of next month. Each expedition lasts 7 days. Which one would work best for you?',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg3',
              conversationId: selectedConversation,
              senderId: 'user1',
              content: 'The 15th would be perfect. How many people will be in the group, and what\'s the difficulty level?',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg4',
              conversationId: selectedConversation,
              senderId: 'user2',
              content: 'We keep our groups to a maximum of 8 people for a better experience. The difficulty level is moderate - you should have some hiking experience, but you don\'t need to be an expert. We\'ll provide all the necessary equipment and guidance.',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg5',
              conversationId: selectedConversation,
              senderId: 'user1',
              content: 'That sounds great. What\'s the booking process like? Do you need a deposit?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg6',
              conversationId: selectedConversation,
              senderId: 'user2',
              content: 'Yes, we require a 30% deposit to secure your spot. The remainder is due 1 week before the expedition. I can send you a booking link, or if you prefer, we can continue this conversation on WhatsApp for quicker responses. My number is 9876543210.',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: true
            },
            {
              id: 'msg7',
              conversationId: selectedConversation,
              senderId: 'user1',
              content: 'I\'d actually prefer to keep everything on this platform for now. Can you send the booking link here? Also, do you offer any discounts if I bring a friend?',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            },
            {
              id: 'msg8',
              conversationId: selectedConversation,
              senderId: 'user2',
              content: 'Of course, here\'s the booking link: [Booking Link]. And yes, we offer a 10% discount for each additional person in your group. Let me know if you have any other questions!',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              hasAttachments: false,
              isRead: true,
              flagged: false
            }
          ];
          
          setMessages(mockMessages);
          setIsMessagesLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsMessagesLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedConversation]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };
  
  // Handle admin intervention
  const handleIntervene = async () => {
    if (!selectedConversation || !interveneMessage.trim()) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/conversations/${selectedConversation}/intervene`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: interveneMessage })
      // });
      
      // Mock adding the message to the conversation
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        conversationId: selectedConversation,
        senderId: 'admin',
        content: interveneMessage,
        timestamp: new Date().toISOString(),
        hasAttachments: false,
        isRead: false,
        flagged: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInterveneMessage('');
      setInterveneModal(false);
      
      alert('Intervention message sent successfully');
    } catch (error) {
      console.error('Error sending intervention message:', error);
      alert('Failed to send intervention message');
    }
  };
  
  // Flag a message
  const handleFlagMessage = async (messageId: string, flagged: boolean) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/messages/${messageId}/flag`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ flagged })
      // });
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, flagged } : msg
        )
      );
    } catch (error) {
      console.error('Error flagging message:', error);
      alert('Failed to flag message');
    }
  };
  
  // Handle resolving a reported conversation
  const handleResolveReport = async (conversationId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/conversations/${conversationId}/resolve`, {
      //   method: 'POST'
      // });
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, status: 'active', flagged: false } : conv
        )
      );
      
      alert('Report resolved successfully');
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Failed to resolve report');
    }
  };
  
  // Filter conversations based on search term and filter
  const filteredConversations = conversations.filter(conv => {
    // Apply filter
    if (filter === 'flagged' && !conv.flagged) return false;
    if (filter === 'reported' && conv.status !== 'reported') return false;
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const participantMatches = conv.participants.some(p => 
        p.name.toLowerCase().includes(term) || 
        p.email.toLowerCase().includes(term)
      );
      const subjectMatches = conv.subject?.toLowerCase().includes(term) || false;
      const relatedMatches = conv.relatedTo?.title.toLowerCase().includes(term) || false;
      
      return participantMatches || subjectMatches || relatedMatches;
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  // Get other participant (non-admin) in conversation
  const getOtherParticipants = (conversation: Conversation) => {
    return conversation.participants;
  };
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Conversation Monitoring</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor conversations between buyers and sellers for policy violations and provide assistance.
          </p>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search and filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('flagged')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    filter === 'flagged' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Flagged
                </button>
                <button
                  onClick={() => setFilter('reported')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    filter === 'reported' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Reported
                </button>
              </div>
            </div>
            
            {/* Conversations */}
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mt-2">No conversations found</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => {
                  const participants = getOtherParticipants(conversation);
                  const isSelected = selectedConversation === conversation.id;
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`p-4 border-b border-gray-200 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : conversation.flagged ? 'bg-yellow-50/50' : ''
                      } hover:bg-gray-50`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="flex -space-x-2 mr-2">
                              {participants.map((participant, index) => (
                                <div key={index} className="relative inline-block">
                                  {participant.avatar ? (
                                    <img
                                      src={participant.avatar}
                                      alt={participant.name}
                                      className="h-8 w-8 rounded-full ring-2 ring-white"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center ring-2 ring-white">
                                      <span className="text-xs font-medium text-gray-800">
                                        {participant.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="truncate">
                              <span className="font-medium text-sm text-gray-900">
                                {participants.map(p => p.name).join(', ')}
                              </span>
                            </div>
                          </div>
                          
                          {conversation.subject && (
                            <p className="mt-1 text-sm font-medium text-gray-800 truncate">
                              {conversation.subject}
                            </p>
                          )}
                          
                          {conversation.relatedTo && (
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              Re: {conversation.relatedTo.title}
                            </p>
                          )}
                          
                          {conversation.status === 'reported' && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Reported
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-2 flex flex-col items-end">
                          <p className="text-xs text-gray-500">
                            {formatDate(conversation.lastActivity)}
                          </p>
                          
                          {conversation.flagged && (
                            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
                          )}
                          
                          {conversation.keywordMatches && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {conversation.keywordMatches.count} flags
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Conversation Detail */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.subject || 'Conversation'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.id === selectedConversation)?.participants.map(p => p.name).join(', ')}
                    </p>
                    {conversations.find(c => c.id === selectedConversation)?.relatedTo && (
                      <p className="text-xs text-gray-500">
                        Related to: {conversations.find(c => c.id === selectedConversation)?.relatedTo?.title}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setInterveneModal(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Intervene
                    </button>
                    
                    {conversations.find(c => c.id === selectedConversation)?.status === 'reported' && (
                      <button
                        onClick={() => handleResolveReport(selectedConversation)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Resolve Report
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {isMessagesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      No messages in this conversation
                    </div>
                  ) : (
                    messages.map(message => {
                      const sender = conversations.find(c => c.id === selectedConversation)?.participants.find(p => p.id === message.senderId);
                      const isAdmin = message.senderId === 'admin';
                      
                      return (
                        <div key={message.id} className="flex group">
                          <div className="flex-shrink-0 mr-3">
                            {isAdmin ? (
                              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                                A
                              </div>
                            ) : sender?.avatar ? (
                              <img
                                src={sender.avatar}
                                alt={sender.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-800">
                                  {sender?.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-baseline">
                              <span className="text-sm font-medium text-gray-900 mr-2">
                                {isAdmin ? 'Admin' : sender?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(message.timestamp)}
                              </span>
                              
                              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleFlagMessage(message.id, !message.flagged)}
                                  className={`p-1 rounded-full ${
                                    message.flagged
                                      ? 'text-yellow-500 hover:text-yellow-600'
                                      : 'text-gray-400 hover:text-gray-500'
                                  }`}
                                  title={message.flagged ? 'Remove flag' : 'Flag message'}
                                >
                                  <svg className="h-4 w-4" fill={message.flagged ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className={`mt-1 p-3 rounded-lg ${
                              isAdmin 
                                ? 'bg-purple-100' 
                                : message.flagged
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-white'
                            }`}>
                              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                {message.content}
                              </p>
                              
                              {message.hasAttachments && (
                                <div className="mt-2 flex items-center text-sm text-blue-600">
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  <span>Attachment</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Keyword warning if applicable */}
                {conversations.find(c => c.id === selectedConversation)?.keywordMatches && (
                  <div className="p-3 bg-amber-50 border-t border-amber-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Flagged Keywords Detected</h3>
                        <div className="mt-1 text-sm text-amber-700">
                          <p>
                            This conversation contains {conversations.find(c => c.id === selectedConversation)?.keywordMatches?.count} instances of flagged keywords:
                            {' '}
                            {conversations.find(c => c.id === selectedConversation)?.keywordMatches?.keywords.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mt-2">Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Intervention Modal */}
      {interveneModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Admin Intervention
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your message will be added to the conversation and will be visible to all participants. Use this for policy reminders or assistance.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="intervention-message" className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <textarea
                          id="intervention-message"
                          name="intervention-message"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={interveneMessage}
                          onChange={(e) => setInterveneMessage(e.target.value)}
                          placeholder="Enter your message to the conversation participants..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleIntervene}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setInterveneModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}