const express = require('express');
const router = express.Router();
const Message = require('../models/mongoose/messageModel');
const { authenticate } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../utils/errors');

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get user's conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of conversations per page
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Unauthorized
 */
router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Aggregate to get latest message for each conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id || req.user.id },
            { recipient: req.user._id || req.user.id }
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
                    { $eq: ['$recipient', req.user._id || req.user.id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalMessages: { $sum: 1 }
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
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    // Process conversations to determine the other participant
    const processedConversations = conversations.map(conv => {
      const senderInfo = conv.senderInfo[0];
      const recipientInfo = conv.recipientInfo[0];
      
      // Determine who is the other participant
      const otherParticipant = senderInfo._id.toString() === userId.toString() 
        ? recipientInfo 
        : senderInfo;

      return {
        conversationId: conv._id,
        otherParticipant: {
          _id: otherParticipant._id,
          name: otherParticipant.name,
          email: otherParticipant.email,
          role: otherParticipant.role
        },
        lastMessage: {
          content: conv.lastMessage.content,
          createdAt: conv.lastMessage.createdAt,
          isFromMe: conv.lastMessage.sender.toString() === userId.toString()
        },
        unreadCount: conv.unreadCount,
        totalMessages: conv.totalMessages
      };
    });

    res.json({
      success: true,
      data: {
        conversations: processedConversations,
        pagination: {
          page,
          limit,
          hasMore: conversations.length === limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/conversation/{otherUserId}:
 *   get:
 *     summary: Get conversation messages with another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Other user's ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: Conversation messages
 *       404:
 *         description: User not found
 */
router.get('/conversation/:otherUserId', authenticate, async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const conversationId = Message.generateConversationId(userId, otherUserId);
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

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({
      success: true,
      data: {
        conversationId,
        messages: messages.reverse(), // Oldest first
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: Recipient user ID
 *               content:
 *                 type: string
 *                 description: Message content
 *               relatedItem:
 *                 type: string
 *                 description: Related product/service ID
 *               relatedItemType:
 *                 type: string
 *                 enum: [product, service]
 *                 description: Type of related item
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/send', authenticate, async (req, res, next) => {
  try {
    const { receiverId, content, relatedItem, relatedItemType } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content?.trim()) {
      throw new BadRequestError('Receiver ID and content are required');
    }

    // Create conversation ID
    const conversationId = Message.generateConversationId(senderId, receiverId);

    // Create message data
    const messageData = {
      conversationId,
      sender: senderId,
      recipient: receiverId,
      content: content.trim(),
      isSenderSeller: ['seller'].includes(req.user.role),
      isRecipientSeller: false // Will be updated after fetching receiver info
    };

    if (relatedItem) {
      messageData.relatedItem = relatedItem;
      messageData.relatedItemType = relatedItemType;
    }

    // Create and save message
    const message = new Message(messageData);
    await message.save();

    // Populate related data
    await message.populate('sender', 'name email role');
    await message.populate('recipient', 'name email role');
    if (relatedItem) {
      await message.populate('relatedItem', 'name price');
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/mark-read/{conversationId}:
 *   post:
 *     summary: Mark conversation messages as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Messages marked as read
 */
router.post('/mark-read/:conversationId', authenticate, async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const result = await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount
      },
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/unread-count:
 *   get:
 *     summary: Get unread messages count
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread messages count
 */
router.get('/unread-count', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await Message.countDocuments({
      recipient: userId,
      isRead: false,
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message (soft delete)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       403:
 *         description: Not authorized to delete this message
 *       404:
 *         description: Message not found
 */
router.delete('/:messageId', authenticate, async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Only sender can delete their message
    if (message.sender.toString() !== userId) {
      throw new BadRequestError('You can only delete your own messages');
    }

    message.status = 'deleted';
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;