const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/mongoose/userModel');
const Message = require('../models/mongoose/messageModel');
const { createMessageService } = require('../services/messageService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Store active connections
const activeConnections = new Map();

/**
 * Initialize Socket.IO server
 */
function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.user = user;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} (${socket.userId}) connected`);
    
    // Store active connection
    activeConnections.set(socket.userId, {
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date()
    });

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Handle joining conversation rooms
    socket.on('join_conversation', async (data) => {
      try {
        const { otherUserId } = data;
        const conversationId = Message.generateConversationId(socket.userId, otherUserId);
        
        // Join the conversation room
        socket.join(conversationId);
        
        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            recipient: socket.userId,
            isRead: false
          },
          {
            isRead: true
          }
        );

        socket.emit('joined_conversation', { conversationId, otherUserId });
        console.log(`User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Error joining conversation:', error);
        socket.emit('error', { message: 'Failed to join conversation' });
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, relatedItem, relatedItemType } = data;
        
        if (!receiverId || !content?.trim()) {
          return socket.emit('error', { message: 'Invalid message data' });
        }

        // Create conversation ID
        const conversationId = Message.generateConversationId(socket.userId, receiverId);

        // Create new message
        const messageData = {
          conversationId,
          sender: socket.userId,
          recipient: receiverId,
          content: content.trim(),
          isSenderSeller: ['seller'].includes(socket.userRole),
          isRecipientSeller: false // We'll update this when we get receiver info
        };

        if (relatedItem) {
          messageData.relatedItem = relatedItem;
          messageData.relatedItemType = relatedItemType;
        }

        // Get receiver info to set isRecipientSeller
        const receiver = await User.findById(receiverId).select('role');
        if (receiver) {
          messageData.isRecipientSeller = ['seller'].includes(receiver.role);
        }

        // Save message to database
        const message = new Message(messageData);
        await message.save();

        // Populate sender and recipient data
        await message.populate('sender', 'name email role');
        await message.populate('recipient', 'name email role');

        // Send to conversation room
        io.to(conversationId).emit('new_message', message);

        // Send notification to recipient if they're online
        const recipientConnection = activeConnections.get(receiverId);
        if (recipientConnection) {
          io.to(`user_${receiverId}`).emit('message_notification', {
            from: socket.user.name,
            conversationId,
            content: content.trim(),
            timestamp: message.createdAt
          });
        }

        // Confirm to sender
        socket.emit('message_sent', { messageId: message._id, conversationId });
        
        console.log(`Message sent from ${socket.userId} to ${receiverId} in conversation ${conversationId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name
      });
    });

    socket.on('typing_stop', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user_stopped_typing', {
        userId: socket.userId
      });
    });

    // Handle marking messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { conversationId } = data;
        
        await Message.updateMany(
          {
            conversationId,
            recipient: socket.userId,
            isRead: false
          },
          {
            isRead: true
          }
        );

        // Notify conversation participants
        socket.to(conversationId).emit('messages_read', {
          conversationId,
          readBy: socket.userId
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle getting conversation history
    socket.on('get_conversation_history', async (data) => {
      try {
        const { otherUserId, page = 1, limit = 50 } = data;
        const conversationId = Message.generateConversationId(socket.userId, otherUserId);
        
        const skip = (page - 1) * limit;
        
        const messages = await Message.find({
          conversationId,
          status: 'active'
        })
        .populate('sender', 'name email role')
        .populate('recipient', 'name email role')
        .populate('relatedItem', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Message.countDocuments({
          conversationId,
          status: 'active'
        });

        socket.emit('conversation_history', {
          messages: messages.reverse(), // Reverse to show oldest first
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          },
          conversationId
        });
      } catch (error) {
        console.error('Error getting conversation history:', error);
        socket.emit('error', { message: 'Failed to load conversation history' });
      }
    });

    // Handle getting user's conversations list
    socket.on('get_conversations', async () => {
      try {
        const conversations = await Message.aggregate([
          {
            $match: {
              $or: [
                { sender: socket.user._id },
                { recipient: socket.user._id }
              ],
              status: 'active'
            }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $group: {
              _id: '$conversationId',
              lastMessage: { $first: '$$ROOT' },
              unreadCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$recipient', socket.user._id] },
                        { $eq: ['$isRead', false] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'lastMessage.sender',
              foreignField: '_id',
              as: 'senderInfo'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'lastMessage.recipient',
              foreignField: '_id',
              as: 'recipientInfo'
            }
          },
          {
            $sort: { 'lastMessage.createdAt': -1 }
          }
        ]);

        socket.emit('conversations_list', conversations);
      } catch (error) {
        console.error('Error getting conversations:', error);
        socket.emit('error', { message: 'Failed to load conversations' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} (${socket.userId}) disconnected`);
      activeConnections.delete(socket.userId);
    });
  });

  return io;
}

/**
 * Get active connections count
 */
function getActiveConnectionsCount() {
  return activeConnections.size;
}

/**
 * Get user connection status
 */
function isUserOnline(userId) {
  return activeConnections.has(userId);
}

/**
 * Send notification to user if online
 */
function sendNotificationToUser(userId, notification) {
  const connection = activeConnections.get(userId);
  if (connection) {
    // This would require access to the io instance
    // We can implement this when needed
    return true;
  }
  return false;
}

module.exports = {
  initializeSocket,
  getActiveConnectionsCount,
  isUserOnline,
  sendNotificationToUser
};