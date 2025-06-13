'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPaperPlane, 
  faUserCircle,
  faFilter,
  faEllipsisV,
  faTrash,
  faFlag,
  faArchive,
  faArrowLeft,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { FadeIn } from '@/components/animations';

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    participants: {
      seller: {
        id: 's1',
        name: 'Rajesh Kumar',
        businessName: 'Himalayan Adventures',
        profileImg: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      buyer: {
        id: 'b1',
        name: 'Amit Patel',
        profileImg: 'https://randomuser.me/api/portraits/men/72.jpg'
      }
    },
    lastMessage: {
      text: 'Yes, we offer transport services from the airport to our base camp.',
      timestamp: '2023-11-05T10:15:00Z',
      sender: 's1'
    },
    unreadCount: 0,
    tags: ['active', 'product-inquiry']
  },
  {
    id: 'c2',
    participants: {
      seller: {
        id: 's3',
        name: 'Sanjay Mehta',
        businessName: 'Kerala Backwaters',
        profileImg: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      buyer: {
        id: 'b3',
        name: 'Priya Sharma',
        profileImg: 'https://randomuser.me/api/portraits/women/28.jpg'
      }
    },
    lastMessage: {
      text: 'Do you have availability for a group of 6 people next weekend?',
      timestamp: '2023-11-04T16:30:00Z',
      sender: 'b3'
    },
    unreadCount: 2,
    tags: ['new', 'booking-request']
  },
  {
    id: 'c3',
    participants: {
      seller: {
        id: 's2',
        name: 'Priya Singh',
        businessName: 'Ladakh Expeditions',
        profileImg: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      buyer: {
        id: 'b2',
        name: 'Rahul Verma',
        profileImg: 'https://randomuser.me/api/portraits/men/55.jpg'
      }
    },
    lastMessage: {
      text: 'The trek was absolutely amazing! Thank you for all your help and guidance.',
      timestamp: '2023-11-03T09:45:00Z',
      sender: 'b2'
    },
    unreadCount: 0,
    tags: ['completed', 'post-service']
  },
  {
    id: 'c4',
    participants: {
      seller: {
        id: 's4',
        name: 'Anita Sharma',
        businessName: 'Rajasthan Heritage Tours',
        profileImg: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      buyer: {
        id: 'b4',
        name: 'Suresh Kumar',
        profileImg: 'https://randomuser.me/api/portraits/men/45.jpg'
      }
    },
    lastMessage: {
      text: 'I need more information about your heritage tour packages in Jaipur.',
      timestamp: '2023-11-02T14:20:00Z',
      sender: 'b4'
    },
    unreadCount: 1,
    tags: ['flagged', 'product-inquiry']
  }
];

// Mock messages for each conversation
const MOCK_MESSAGES = {
  'c1': [
    {
      id: 'm1',
      sender: 'b1',
      text: 'Hello, I am interested in booking the Manali to Leh bike tour. Do you provide bike rentals?',
      timestamp: '2023-11-05T09:30:00Z',
      read: true
    },
    {
      id: 'm2',
      sender: 's1',
      text: 'Hello Amit! Yes, we provide Royal Enfield bikes for the Manali to Leh tour. Our package includes bike rental, fuel, mechanic support, and accommodations.',
      timestamp: '2023-11-05T09:45:00Z',
      read: true
    },
    {
      id: 'm3',
      sender: 'b1',
      text: 'That sounds great. How many days is the tour? And do you offer airport pickup in Manali?',
      timestamp: '2023-11-05T10:00:00Z',
      read: true
    },
    {
      id: 'm4',
      sender: 's1',
      text: 'The standard tour is 10 days, but we also have 7-day and 14-day options. Yes, we offer transport services from the airport to our base camp.',
      timestamp: '2023-11-05T10:15:00Z',
      read: false
    }
  ],
  'c2': [
    {
      id: 'm1',
      sender: 'b3',
      text: 'Hi, I am looking for a houseboat experience in Kerala for my family.',
      timestamp: '2023-11-04T15:30:00Z',
      read: true
    },
    {
      id: 'm2',
      sender: 's3',
      text: 'Hello Priya! We offer premium houseboat experiences on the Kerala backwaters. How many people would be in your group and when are you planning to visit?',
      timestamp: '2023-11-04T15:45:00Z',
      read: true
    },
    {
      id: 'm3',
      sender: 'b3',
      text: 'We are a family of 6 (4 adults, 2 children). We\'re planning to visit next weekend. Do you have availability?',
      timestamp: '2023-11-04T16:30:00Z',
      read: false
    }
  ]
};

// Tags for filtering
const CONVERSATION_TAGS = [
  { value: 'all', label: 'All Messages' },
  { value: 'unread', label: 'Unread' },
  { value: 'active', label: 'Active' },
  { value: 'new', label: 'New' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'completed', label: 'Completed' }
];

// Format time helper
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Message item component
const MessageItem = ({
  message,
  currentUser
}: {
  message: any;
  currentUser: string;
}) => {
  const isOwn = message.sender === currentUser;
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && (
        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
          <FontAwesomeIcon icon={faUserCircle} className="h-full w-full text-gray-400" />
        </div>
      )}
      <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
        isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        <p className="text-sm sm:text-base">{message.text}</p>
        <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} block text-right mt-1`}>
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
      {isOwn && (
        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 ml-2">
          <FontAwesomeIcon icon={faUserCircle} className="h-full w-full text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Message dropdown menu
const MessageOptionsMenu = ({
  isOpen,
  onClose,
  onDelete,
  onFlag,
  onArchive
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onFlag: () => void;
  onArchive: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onFlag}
          className="w-full text-left block px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FontAwesomeIcon icon={faFlag} className="mr-2" />
          Flag Conversation
        </button>
        <button
          onClick={onArchive}
          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FontAwesomeIcon icon={faArchive} className="mr-2" />
          Archive
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
          role="menuitem"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

// Main page component
const AdminMessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const isMobile = windowWidth < 768;
  
  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // In a real app, fetch messages from API
      const conversationMessages = MOCK_MESSAGES[selectedConversation as keyof typeof MOCK_MESSAGES] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (conversationMessages.length > 0) {
        // Update the unread count in the conversation list
        setConversations(prevConversations =>
          prevConversations.map(conv => 
            conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    }
  }, [selectedConversation]);
  
  // Filter conversations based on search and tag
  const filteredConversations = conversations.filter(conversation => {
    const seller = conversation.participants.seller;
    const buyer = conversation.participants.buyer;
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTag = 
      tagFilter === 'all' || 
      (tagFilter === 'unread' && conversation.unreadCount > 0) ||
      conversation.tags.includes(tagFilter);
      
    return matchesSearch && matchesTag;
  });
  
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, send message to API
    const message = {
      id: `new-${Date.now()}`,
      sender: 'admin', // Admin is sending the message
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    // Add message to conversation
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Update last message in conversation list
    setConversations(prevConversations =>
      prevConversations.map(conv => 
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: {
                text: newMessage,
                timestamp: new Date().toISOString(),
                sender: 'admin'
              }
            }
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
  };
  
  const handleDeleteConversation = (id: string) => {
    // In a real app, call API to delete conversation
    setConversations(prevConversations => 
      prevConversations.filter(conv => conv.id !== id)
    );
    
    if (selectedConversation === id) {
      setSelectedConversation(null);
      setMessages([]);
    }
    
    setMenuOpen(null);
  };
  
  const handleFlagConversation = (id: string) => {
    // In a real app, call API to flag conversation
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === id
          ? {
              ...conv,
              tags: conv.tags.includes('flagged')
                ? conv.tags.filter(tag => tag !== 'flagged')
                : [...conv.tags, 'flagged']
            }
          : conv
      )
    );
    
    setMenuOpen(null);
  };
  
  const handleArchiveConversation = (id: string) => {
    // In a real app, call API to archive conversation
    console.log(`Archiving conversation: ${id}`);
    setMenuOpen(null);
  };
  
  const handleBackToList = () => {
    setSelectedConversation(null);
  };
  
  // Get current conversation details
  const currentConversation = selectedConversation 
    ? conversations.find(c => c.id === selectedConversation) 
    : null;
    
  return (
    <FadeIn>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Conversation Monitoring</h1>
          <p className="text-gray-600">Review and moderate marketplace conversations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-220px)] max-h-[800px]">
            {/* Conversation list - hide on mobile when conversation is selected */}
            {(!isMobile || !selectedConversation) && (
              <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
                {/* Search and filter */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search conversations..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="flex overflow-x-auto py-1 scrollbar-hide">
                    {CONVERSATION_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => setTagFilter(tag.value)}
                        className={`px-3 py-1 mr-2 text-xs rounded-full whitespace-nowrap ${
                          tagFilter === tag.value
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Conversation list */}
                <div>
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No conversations found matching your criteria.
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const seller = conversation.participants.seller;
                      const buyer = conversation.participants.buyer;
                      const lastMessage = conversation.lastMessage;
                      
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b border-gray-200 cursor-pointer relative ${
                            selectedConversation === conversation.id
                              ? 'bg-blue-50'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-start">
                            <div className="h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src={buyer.profileImg}
                                alt={buyer.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {buyer.name}
                                </h3>
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-500">
                                    {formatMessageTime(lastMessage.timestamp)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMenuOpen(menuOpen === conversation.id ? null : conversation.id);
                                    }}
                                    className="ml-2 p-1 rounded-full hover:bg-gray-200"
                                  >
                                    <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500 text-sm" />
                                  </button>
                                  
                                  {menuOpen === conversation.id && (
                                    <div className="absolute right-2 mt-8 z-10">
                                      <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFlagConversation(conversation.id);
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100"
                                        >
                                          <FontAwesomeIcon icon={faFlag} className="mr-2" />
                                          {conversation.tags.includes('flagged') ? 'Unflag' : 'Flag'}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleArchiveConversation(conversation.id);
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          <FontAwesomeIcon icon={faArchive} className="mr-2" />
                                          Archive
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteConversation(conversation.id);
                                          }}
                                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                        >
                                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mb-1 truncate">
                                {seller.businessName}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {lastMessage.text}
                              </p>
                              <div className="mt-1 flex flex-wrap">
                                {conversation.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`mr-1 mb-1 px-2 py-0.5 text-xs rounded-full ${
                                      tag === 'active' ? 'bg-green-100 text-green-800' :
                                      tag === 'new' ? 'bg-blue-100 text-blue-800' :
                                      tag === 'flagged' ? 'bg-yellow-100 text-yellow-800' :
                                      tag === 'completed' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-auto px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                    {conversation.unreadCount} unread
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            
            {/* Conversation detail - show for desktop or when selected on mobile */}
            {(!isMobile || selectedConversation) && (
              <div className="w-full md:w-2/3 flex flex-col">
                {selectedConversation && currentConversation ? (
                  <>
                    {/* Conversation header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        {/* Back button (mobile only) */}
                        {isMobile && (
                          <button
                            onClick={handleBackToList}
                            className="mr-3 p-1"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-500" />
                          </button>
                        )}
                        
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={currentConversation.participants.buyer.profileImg}
                            alt={currentConversation.participants.buyer.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {currentConversation.participants.buyer.name}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500">
                              Conversation with {currentConversation.participants.seller.businessName}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Options button */}
                      <div className="relative">
                        <button
                          onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500" />
                        </button>
                        
                        <MessageOptionsMenu 
                          isOpen={optionsMenuOpen}
                          onClose={() => setOptionsMenuOpen(false)}
                          onDelete={() => {
                            handleDeleteConversation(currentConversation.id);
                            setOptionsMenuOpen(false);
                          }}
                          onFlag={() => {
                            handleFlagConversation(currentConversation.id);
                            setOptionsMenuOpen(false);
                          }}
                          onArchive={() => {
                            handleArchiveConversation(currentConversation.id);
                            setOptionsMenuOpen(false);
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          No messages yet.
                        </div>
                      ) : (
                        messages.map((message) => (
                          <MessageItem
                            key={message.id}
                            message={message}
                            currentUser="admin" // Admin view
                          />
                        ))
                      )}
                    </div>
                    
                    {/* Message input */}
                    <div className="border-t border-gray-200 p-4">
                      <form onSubmit={handleMessageSubmit} className="flex">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-4xl mb-3 text-gray-300" />
                      <p>Select a conversation to view messages</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default AdminMessagesPage;