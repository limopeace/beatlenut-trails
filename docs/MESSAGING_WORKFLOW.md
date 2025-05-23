# ESM Portal Messaging Workflow Documentation

## Overview

The ESM Portal provides a comprehensive messaging system that enables secure communication between buyers and sellers, with support for text messages, image sharing, and file attachments. This document outlines the complete workflow for how buyers and sellers connect and exchange information.

## Architecture

### Backend Components

1. **Message Model** (`/src/models/mongoose/messageModel.js`)
   - Stores individual messages with content, attachments, and metadata
   - Supports text content up to 5000 characters
   - Tracks sender/recipient and their roles (buyer/seller)
   - Handles file attachments with URLs and metadata

2. **Conversation Model** (`/src/models/mongoose/conversationModel.js`)
   - Groups messages between participants
   - Tracks conversation metadata and latest message
   - Manages read status and unread counts
   - Links to related products/services/orders

3. **Message Service** (`/src/services/messageService.js`)
   - Handles business logic for messaging
   - Manages conversation creation and updates
   - Sends notifications for new messages
   - Validates permissions and authorization

4. **File Upload Middleware** (`/src/middleware/fileUpload.js`)
   - Handles image and document uploads
   - Validates file types and sizes
   - Stores files securely on the server
   - Supports multiple file uploads (up to 5 per message)

### Frontend Components

1. **ConversationContainer** (`/frontend/src/components/marketplace/messages/ConversationContainer.tsx`)
   - Main container for conversation view
   - Manages message thread display
   - Handles contact sharing workflow
   - Coordinates between message thread and compose components

2. **MessageThread** (`/frontend/src/components/marketplace/messages/MessageThread.tsx`)
   - Displays messages in chronological order
   - Renders attachments (images, videos, documents)
   - Marks messages as read automatically
   - Provides smooth scrolling to latest messages

3. **ComposeMessage** (`/frontend/src/components/marketplace/messages/ComposeMessage.tsx`)
   - Message input with attachment support
   - Preview attachments before sending
   - Auto-resize textarea for better UX
   - File validation and upload progress

## Messaging Workflows

### 1. Buyer-Seller Initial Contact

#### From Product/Service Page

1. **Buyer Action**: Clicks "Contact Seller" on a product/service listing
2. **System Response**: Opens messaging interface
3. **Pre-filled Information**:
   - Subject: "Inquiry about [Product/Service Name]"
   - Related item linked to conversation
   - Seller automatically set as recipient

4. **Buyer Composes Message**:
   ```
   Hi, I'm interested in your [product/service].
   Could you provide more details about:
   - Availability
   - Price negotiation
   - Delivery options
   ```

5. **System Actions**:
   - Creates new conversation if none exists
   - Sends notification to seller
   - Updates conversation list for both parties

#### From Seller Profile

1. **Buyer Action**: Visits seller profile and clicks "Send Message"
2. **System Response**: Opens new message modal
3. **Buyer Input**:
   - Subject (required)
   - Message content
   - Optional attachments

### 2. Message Exchange Flow

#### Sending Messages

1. **Compose Message**:
   - Type text content
   - Add attachments (optional):
     - Images (JPEG, PNG, GIF, WebP)
     - Videos (MP4, WebM)
     - Documents (PDF, Word, Excel)
   - Maximum 5 files, 10MB each

2. **Send Process**:
   ```javascript
   // Frontend sends FormData with message and files
   const formData = new FormData();
   formData.append('content', messageText);
   formData.append('conversationId', conversationId);
   attachments.forEach(file => {
     formData.append('attachments', file);
   });
   ```

3. **Backend Processing**:
   - Validates message content
   - Uploads files to server
   - Creates message record
   - Updates conversation
   - Sends notification

4. **Real-time Update**:
   - Message appears in sender's view
   - Recipient sees notification
   - Conversation list updates

#### Receiving Messages

1. **Notification**:
   - Desktop/mobile notification (if enabled)
   - In-app notification badge
   - Email notification (optional)

2. **Reading Messages**:
   - Click conversation to open
   - Messages automatically marked as read
   - Unread count decreases
   - Typing indicators (future feature)

### 3. Attachment Handling

#### Image Sharing

1. **Upload Process**:
   - Click attachment button
   - Select images (multiple allowed)
   - Preview thumbnails appear
   - Can remove before sending

2. **Display**:
   - Thumbnails in message
   - Click to view full size
   - Download option available

3. **Example Use Cases**:
   - Product detailed images
   - Damage documentation
   - Custom order specifications

#### Document Sharing

1. **Supported Formats**:
   - PDF (contracts, invoices)
   - Word (specifications, agreements)
   - Excel (price lists, inventories)

2. **Security**:
   - Files scanned for malware
   - Access restricted to conversation participants
   - Secure file storage

### 4. Contact Information Exchange

#### Requesting Contact Details

1. **After Initial Conversation**:
   - System suggests sharing contact after 3+ messages
   - "Share Contact" button appears

2. **Request Flow**:
   - Buyer/Seller clicks "Request Contact"
   - Custom message option
   - Request sent to other party

3. **Approval Process**:
   - Recipient sees request
   - Can accept or decline
   - If accepted, both share contacts

#### Sharing Contact Information

1. **Information Shared**:
   - Phone number (optional)
   - Email address (optional)
   - Additional message

2. **Privacy Controls**:
   - Only shared with approval
   - Can revoke access later
   - Tracked in conversation history

### 5. Conversation Management

#### Organizing Conversations

1. **Conversation List**:
   - Sorted by recent activity
   - Unread message indicators
   - Search functionality
   - Filter options:
     - Active conversations
     - Archived
     - By participant type

2. **Conversation Actions**:
   - Archive old conversations
   - Mark all as read
   - Block/report users
   - Export conversation history

#### Search and Filter

1. **Search Features**:
   - Search by participant name
   - Search message content
   - Filter by date range
   - Filter by attachment type

## API Endpoints

### Core Messaging Endpoints

1. **Send Message**
   ```
   POST /api/messages
   Content-Type: multipart/form-data
   
   Body:
   - content: string
   - recipientId: string
   - conversationId: string (optional)
   - attachments: File[] (optional)
   ```

2. **Get Conversations**
   ```
   GET /api/messages/conversations
   
   Query Parameters:
   - limit: number
   - skip: number
   - status: 'active' | 'archived'
   - unreadOnly: boolean
   ```

3. **Get Messages in Conversation**
   ```
   GET /api/messages/conversations/:conversationId
   
   Query Parameters:
   - limit: number
   - skip: number
   - sortOrder: 'asc' | 'desc'
   ```

4. **Mark as Read**
   ```
   POST /api/messages/conversations/:conversationId/read
   ```

5. **Archive Conversation**
   ```
   PATCH /api/messages/conversations/:conversationId/archive
   ```

## Security Considerations

1. **Authentication**:
   - JWT tokens required for all endpoints
   - User must be participant to access conversation

2. **Authorization**:
   - Can only send messages to valid users
   - Can only access own conversations
   - Cannot delete other users' messages

3. **File Security**:
   - File type validation
   - Size limits enforced
   - Virus scanning (recommended)
   - Secure file storage

4. **Privacy**:
   - Contact info requires consent
   - Messages encrypted in transit
   - No message content in notifications

## Implementation Code Examples

### Frontend: Sending a Message with Image

```typescript
// In ComposeMessage component
const handleSendMessage = async () => {
  const formData = new FormData();
  formData.append('content', messageText);
  formData.append('conversationId', conversationId);
  
  // Add images
  selectedImages.forEach(image => {
    formData.append('attachments', image.file);
  });
  
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.json();
    // Update UI with new message
    onMessageSent(result.data.message);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### Backend: Processing Message with Attachments

```javascript
// In messageController.js
async sendMessage(req, res, next) {
  try {
    const { content, recipientId } = req.body;
    const files = req.files || [];
    
    // Process uploaded files
    const attachments = files.map(file => ({
      url: `/uploads/messages/${file.filename}`,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size
    }));
    
    // Create message with attachments
    const message = await messageService.sendMessage({
      content,
      recipientId,
      attachments,
      senderId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    next(error);
  }
}
```

## Testing the Messaging System

### Manual Testing Steps

1. **Basic Message Flow**:
   - Create buyer and seller accounts
   - Send text message from buyer to seller
   - Verify notification received
   - Reply from seller
   - Check read status updates

2. **Image Sharing**:
   - Attach multiple images
   - Send message
   - Verify images display correctly
   - Test download functionality

3. **Contact Sharing**:
   - Exchange 3+ messages
   - Request contact information
   - Accept request
   - Verify contact details shared

### Automated Testing

```javascript
// Example Playwright test
describe('Messaging Workflow', () => {
  test('Buyer can send message with image to seller', async ({ page }) => {
    // Login as buyer
    await page.goto('/esm-portal/login');
    await page.fill('input[name="email"]', 'buyer@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Navigate to product
    await page.goto('/esm-portal/products/123');
    await page.click('button:has-text("Contact Seller")');
    
    // Compose message
    await page.fill('textarea', 'I am interested in this product');
    
    // Attach image
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-image.jpg');
    
    // Send message
    await page.click('button:has-text("Send")');
    
    // Verify message sent
    await expect(page.locator('.message-sent')).toBeVisible();
  });
});
```

## Best Practices

1. **Performance**:
   - Lazy load old messages
   - Compress images before upload
   - Cache conversation lists
   - Use pagination for large threads

2. **User Experience**:
   - Show typing indicators
   - Auto-save draft messages
   - Provide delivery confirmations
   - Enable push notifications

3. **Security**:
   - Validate all inputs
   - Sanitize file uploads
   - Rate limit message sending
   - Log suspicious activity

4. **Scalability**:
   - Use message queues for notifications
   - Implement proper database indexing
   - Consider real-time updates (WebSocket)
   - Archive old conversations

## Future Enhancements

1. **Real-time Messaging**:
   - WebSocket connection
   - Instant message delivery
   - Online/offline status
   - Typing indicators

2. **Rich Media**:
   - Voice messages
   - Video calls
   - Screen sharing
   - Location sharing

3. **Advanced Features**:
   - Message search
   - Translation support
   - Automated responses
   - Chat templates

4. **Business Tools**:
   - Quick replies
   - Saved responses
   - Customer tags
   - Analytics dashboard

## Troubleshooting

### Common Issues

1. **File Upload Failures**:
   - Check file size limits
   - Verify file type allowed
   - Ensure storage permissions
   - Check disk space

2. **Message Not Sending**:
   - Verify authentication
   - Check network connection
   - Validate recipient exists
   - Review error logs

3. **Missing Notifications**:
   - Check notification settings
   - Verify email configuration
   - Test push notification service
   - Review notification logs

## Conclusion

The ESM Portal messaging system provides a robust platform for buyer-seller communication with support for rich media sharing and secure contact exchange. The system is designed to be scalable, secure, and user-friendly, with room for future enhancements as the platform grows.