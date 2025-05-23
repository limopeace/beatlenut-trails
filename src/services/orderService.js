const orderRepository = require('../repositories/orderRepository');
const esmProductRepository = require('../repositories/esmProductRepository');
const userRepository = require('../repositories/userRepository');
const esmSellerRepository = require('../repositories/esmSellerRepository');
const { NotFoundError, ValidationError, AuthorizationError } = require('../utils/errors');
const emailService = require('./emailService');
const notificationService = require('./notificationService');

/**
 * Order Service
 * Handles business logic for order operations
 */
class OrderService {
  /**
   * Create a new order
   * @param {Object} orderData Order data
   * @param {string} userId User ID of the buyer
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData, userId) {
    // Validate buyer exists
    const buyer = await userRepository.getUserById(userId);
    if (!buyer) {
      throw new ValidationError('Invalid buyer');
    }
    
    // Validate seller exists
    const seller = await esmSellerRepository.getSellerById(orderData.seller);
    if (!seller) {
      throw new ValidationError('Invalid seller');
    }
    
    // Check seller is active
    if (seller.status !== 'active') {
      throw new ValidationError('Seller is not active');
    }
    
    // Validate products/services and calculate prices
    const processedItems = [];
    let subtotal = 0;
    let hasPhysicalProduct = false;
    
    for (const item of orderData.items) {
      let product;
      
      if (item.product) {
        product = await esmProductRepository.getProductById(item.product);
        if (!product) {
          throw new ValidationError(`Product with ID ${item.product} not found`);
        }
        
        // Check if this is a physical product
        if (product.type === 'physical') {
          hasPhysicalProduct = true;
        }
      } else if (item.service) {
        product = await esmProductRepository.getProductById(item.service);
        if (!product) {
          throw new ValidationError(`Service with ID ${item.service} not found`);
        }
      } else {
        throw new ValidationError('Each item must have either product or service');
      }
      
      // Check seller matches the product seller
      if (product.seller.toString() !== orderData.seller.toString()) {
        throw new ValidationError('Product/service does not belong to the specified seller');
      }
      
      // Check product is active
      if (product.status !== 'active') {
        throw new ValidationError(`${product.name} is not available for purchase`);
      }
      
      // Check inventory for physical products
      if (product.type === 'physical' && (product.inventory < item.quantity)) {
        throw new ValidationError(`Insufficient inventory for ${product.name}`);
      }
      
      // Calculate item price
      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;
      
      // Add processed item
      processedItems.push({
        product: item.product || null,
        service: item.service || null,
        quantity: item.quantity,
        price: itemPrice,
        options: item.options || {},
        notes: item.notes || ''
      });
    }
    
    // Check if shipping address is provided for physical products
    if (hasPhysicalProduct && !orderData.shippingAddress) {
      throw new ValidationError('Shipping address is required for physical products');
    }
    
    // Calculate tax, commission, etc.
    const taxRate = 0.18; // 18% GST
    const tax = Math.round(subtotal * taxRate * 100) / 100; // Round to 2 decimal places
    
    // Platform fee calculation (5% of subtotal)
    const platformFeeRate = 0.05;
    const platformFee = Math.round(subtotal * platformFeeRate * 100) / 100;
    
    // Seller payout
    const sellerPayout = subtotal - platformFee;
    
    // Prepare order data
    const newOrder = {
      buyer: userId,
      seller: orderData.seller,
      items: processedItems,
      status: 'pending',
      billingAddress: orderData.billingAddress,
      shippingAddress: orderData.shippingAddress || null,
      payment: {
        method: orderData.paymentMethod,
        amount: subtotal + tax + (orderData.shippingFee || 0) - (orderData.discount || 0),
        currency: 'INR',
        status: 'pending'
      },
      subtotal,
      tax,
      shippingFee: orderData.shippingFee || 0,
      discount: orderData.discount || 0,
      total: subtotal + tax + (orderData.shippingFee || 0) - (orderData.discount || 0),
      couponCode: orderData.couponCode || null,
      notes: orderData.notes || '',
      isServiceOrder: !hasPhysicalProduct,
      serviceSchedule: orderData.serviceSchedule || null,
      platformFee,
      sellerPayout
    };
    
    // Create order
    const order = await orderRepository.createOrder(newOrder);
    
    // Update inventory for physical products
    if (hasPhysicalProduct) {
      for (const item of orderData.items) {
        if (item.product) {
          await esmProductRepository.updateProductInventory(
            item.product,
            -item.quantity
          );
        }
      }
    }
    
    // Send notifications
    await this._sendOrderNotifications(order, 'created');
    
    return order;
  }

  /**
   * Get order by ID
   * @param {string} orderId Order ID
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Order object
   */
  async getOrderById(orderId, userId, isAdmin = false) {
    const order = await orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check authorization
    if (!isAdmin && order.buyer.toString() !== userId && order.seller.toString() !== userId) {
      throw new AuthorizationError('Not authorized to view this order');
    }
    
    return order;
  }

  /**
   * Get order by order number
   * @param {string} orderNumber Order number
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Order object
   */
  async getOrderByNumber(orderNumber, userId, isAdmin = false) {
    const order = await orderRepository.getOrderByNumber(orderNumber);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check authorization
    if (!isAdmin && order.buyer.toString() !== userId && order.seller.toString() !== userId) {
      throw new AuthorizationError('Not authorized to view this order');
    }
    
    return order;
  }

  /**
   * Get orders by buyer ID
   * @param {string} buyerId Buyer ID
   * @param {Object} options Query options
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrdersByBuyer(buyerId, options, userId, isAdmin = false) {
    // Check authorization
    if (!isAdmin && buyerId !== userId) {
      throw new AuthorizationError('Not authorized to view these orders');
    }
    
    return await orderRepository.getOrdersByBuyer(buyerId, options);
  }

  /**
   * Get orders by seller ID
   * @param {string} sellerId Seller ID
   * @param {Object} options Query options
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Array>} Array of order objects
   */
  async getOrdersBySeller(sellerId, options, userId, isAdmin = false) {
    if (!isAdmin) {
      // Get seller info to check if user is the owner
      const seller = await esmSellerRepository.getSellerById(sellerId);
      
      if (!seller || seller.user.toString() !== userId) {
        throw new AuthorizationError('Not authorized to view these orders');
      }
    }
    
    return await orderRepository.getOrdersBySeller(sellerId, options);
  }

  /**
   * Update order status
   * @param {string} orderId Order ID
   * @param {string} status New status
   * @param {string} note Optional note about status change
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status, note, userId, isAdmin = false) {
    const order = await orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check authorization
    if (!isAdmin) {
      // Sellers can only update certain statuses
      if (order.seller.toString() === userId) {
        const allowedSellerStatusUpdates = {
          processing: ['confirmed'],
          confirmed: ['shipped', 'completed'],
          shipped: ['delivered']
        };
        
        if (!allowedSellerStatusUpdates[order.status] || 
            !allowedSellerStatusUpdates[order.status].includes(status)) {
          throw new AuthorizationError(`Cannot update order from ${order.status} to ${status}`);
        }
      } 
      // Buyers can only cancel pending orders
      else if (order.buyer.toString() === userId) {
        if (status !== 'cancelled' || order.status !== 'pending') {
          throw new AuthorizationError('Buyers can only cancel pending orders');
        }
      } else {
        throw new AuthorizationError('Not authorized to update this order');
      }
    }
    
    // Validate status transition
    await this._validateStatusTransition(order, status);
    
    // Update order status
    const updatedOrder = await orderRepository.updateOrderStatus(
      orderId,
      status,
      note,
      userId
    );
    
    // Handle side effects based on new status
    await this._handleStatusSideEffects(updatedOrder, order.status);
    
    // Send notifications
    await this._sendOrderNotifications(updatedOrder, 'status_updated');
    
    return updatedOrder;
  }

  /**
   * Update payment information
   * @param {string} orderId Order ID
   * @param {Object} paymentData Payment data
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Updated order
   */
  async updatePayment(orderId, paymentData, userId, isAdmin = false) {
    const order = await orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check authorization
    if (!isAdmin && order.buyer.toString() !== userId) {
      throw new AuthorizationError('Not authorized to update payment');
    }
    
    // Update payment
    const updatedOrder = await orderRepository.updatePayment(orderId, paymentData);
    
    // Send notifications
    if (paymentData.status === 'completed') {
      await this._sendOrderNotifications(updatedOrder, 'payment_completed');
    }
    
    return updatedOrder;
  }

  /**
   * Cancel an order
   * @param {string} orderId Order ID
   * @param {string} reason Cancellation reason
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Updated order
   */
  async cancelOrder(orderId, reason, userId, isAdmin = false) {
    const order = await orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Check authorization
    if (!isAdmin) {
      // Sellers can cancel unshipped orders
      if (order.seller.toString() === userId) {
        const cancelableStatuses = ['pending', 'processing', 'confirmed'];
        if (!cancelableStatuses.includes(order.status)) {
          throw new AuthorizationError(`Cannot cancel order in ${order.status} status`);
        }
      } 
      // Buyers can only cancel pending orders
      else if (order.buyer.toString() === userId) {
        if (order.status !== 'pending') {
          throw new AuthorizationError('Buyers can only cancel pending orders');
        }
      } else {
        throw new AuthorizationError('Not authorized to cancel this order');
      }
    }
    
    if (!order.canBeCancelled()) {
      throw new ValidationError(`Cannot cancel order in ${order.status} status`);
    }
    
    // Cancel order
    const updatedOrder = await orderRepository.cancelOrder(orderId, reason);
    
    // Restore inventory for physical products
    for (const item of order.items) {
      if (item.product) {
        await esmProductRepository.updateProductInventory(
          item.product,
          item.quantity
        );
      }
    }
    
    // Send notifications
    await this._sendOrderNotifications(updatedOrder, 'cancelled');
    
    return updatedOrder;
  }

  /**
   * Process refund for an order
   * @param {string} orderId Order ID
   * @param {number} amount Refund amount
   * @param {string} reason Refund reason
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Updated order
   */
  async refundOrder(orderId, amount, reason, userId, isAdmin = false) {
    const order = await orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    
    // Only admins and sellers can process refunds
    if (!isAdmin && order.seller.toString() !== userId) {
      throw new AuthorizationError('Not authorized to process refund');
    }
    
    if (!order.canBeRefunded()) {
      throw new ValidationError('Order is not eligible for refund');
    }
    
    // Process refund
    const updatedOrder = await orderRepository.refundOrder(orderId, amount, reason);
    
    // Send notifications
    await this._sendOrderNotifications(updatedOrder, 'refunded');
    
    return updatedOrder;
  }

  /**
   * Get order statistics
   * @param {string} sellerId Optional seller ID to filter statistics
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Order statistics
   */
  async getOrderStatistics(sellerId, userId, isAdmin = false) {
    // If seller ID is provided, check authorization
    if (sellerId && !isAdmin) {
      const seller = await esmSellerRepository.getSellerById(sellerId);
      
      if (!seller || seller.user.toString() !== userId) {
        throw new AuthorizationError('Not authorized to view these statistics');
      }
    } else if (!isAdmin) {
      // Non-admins can only view their own statistics
      const seller = await esmSellerRepository.getSellerByUserId(userId);
      
      if (!seller) {
        throw new AuthorizationError('User is not a seller');
      }
      
      sellerId = seller._id;
    }
    
    return await orderRepository.getOrderStatistics(sellerId);
  }

  /**
   * Search orders
   * @param {Object} searchParams Search parameters
   * @param {Object} options Query options
   * @param {string} userId User ID (for authorization)
   * @param {boolean} isAdmin Is admin request
   * @returns {Promise<Object>} Orders and total count
   */
  async searchOrders(searchParams, options, userId, isAdmin = false) {
    // Non-admins can only search their own orders
    if (!isAdmin) {
      const seller = await esmSellerRepository.getSellerByUserId(userId);
      
      if (seller) {
        // User is a seller, can only view their orders
        searchParams.seller = seller._id;
      } else {
        // User is a buyer, can only view their orders
        searchParams.buyer = userId;
      }
    }
    
    const orders = await orderRepository.searchOrders(searchParams, options);
    const totalCount = await orderRepository.countOrders(searchParams);
    
    return {
      orders,
      totalCount
    };
  }

  /**
   * Get recent orders for admin dashboard
   * @param {number} limit Number of orders to return
   * @returns {Promise<Array>} Array of recent orders
   */
  async getRecentOrders(limit = 10) {
    return await orderRepository.getRecentOrders(limit);
  }

  /**
   * Validate status transition
   * @private
   * @param {Object} order Current order
   * @param {string} newStatus New status
   */
  async _validateStatusTransition(order, newStatus) {
    const currentStatus = order.status;
    
    // Define valid transitions
    const validTransitions = {
      pending: ['processing', 'confirmed', 'cancelled'],
      processing: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'completed', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['completed', 'refunded'],
      completed: ['refunded'],
      cancelled: [],
      refunded: []
    };
    
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new ValidationError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  /**
   * Handle side effects of status changes
   * @private
   * @param {Object} order Updated order
   * @param {string} previousStatus Previous status
   */
  async _handleStatusSideEffects(order, previousStatus) {
    // Mark service orders as completed if confirmed
    if (order.isServiceOrder && order.status === 'confirmed' && previousStatus !== 'confirmed') {
      await orderRepository.updateOrderStatus(
        order._id,
        'completed',
        'Service order automatically completed upon confirmation',
        order.seller
      );
    }
    
    // Update seller payout status when order is completed
    if (order.status === 'completed' && previousStatus !== 'completed') {
      // In a real implementation, this would trigger payout processing
      // For now, we'll just mark it as pending
      await orderRepository.updatePayment(order._id, {
        payoutStatus: 'pending'
      });
    }
  }

  /**
   * Send order notifications
   * @private
   * @param {Object} order Order object
   * @param {string} event Event type
   */
  async _sendOrderNotifications(order, event) {
    try {
      // Get user and seller details
      const buyer = await userRepository.getUserById(order.buyer);
      const seller = await esmSellerRepository.getSellerById(order.seller);
      
      // Create notifications based on event type
      switch (event) {
        case 'created':
          // Notify buyer
          await notificationService.createNotification({
            recipient: order.buyer,
            type: 'order',
            title: 'Order Placed',
            message: `Your order #${order.orderNumber} has been placed successfully.`,
            data: { orderId: order._id },
            priority: 'medium'
          });
          
          // Notify seller
          await notificationService.createNotification({
            recipient: seller.user,
            type: 'order',
            title: 'New Order Received',
            message: `You have received a new order #${order.orderNumber}.`,
            data: { orderId: order._id },
            priority: 'high'
          });
          
          // Send emails
          await emailService.sendEmail({
            to: buyer.email,
            subject: `Order Confirmation - #${order.orderNumber}`,
            template: 'order-confirmation',
            data: {
              order,
              buyer
            }
          });
          
          await emailService.sendEmail({
            to: seller.contactEmail,
            subject: `New Order Received - #${order.orderNumber}`,
            template: 'new-order',
            data: {
              order,
              seller
            }
          });
          break;
          
        case 'status_updated':
          // Notify buyer
          await notificationService.createNotification({
            recipient: order.buyer,
            type: 'order',
            title: 'Order Status Updated',
            message: `Your order #${order.orderNumber} has been updated to ${order.status}.`,
            data: { orderId: order._id },
            priority: 'medium'
          });
          
          // For specific status changes, send additional notifications
          if (['shipped', 'delivered', 'completed'].includes(order.status)) {
            await emailService.sendEmail({
              to: buyer.email,
              subject: `Order #${order.orderNumber} ${order.status}`,
              template: `order-${order.status}`,
              data: {
                order,
                buyer
              }
            });
          }
          break;
          
        case 'payment_completed':
          // Notify buyer
          await notificationService.createNotification({
            recipient: order.buyer,
            type: 'payment',
            title: 'Payment Successful',
            message: `Your payment for order #${order.orderNumber} has been processed successfully.`,
            data: { orderId: order._id },
            priority: 'medium'
          });
          
          // Notify seller
          await notificationService.createNotification({
            recipient: seller.user,
            type: 'payment',
            title: 'Payment Received',
            message: `Payment received for order #${order.orderNumber}.`,
            data: { orderId: order._id },
            priority: 'medium'
          });
          break;
          
        case 'cancelled':
          // Notify buyer if seller cancelled
          if (order.statusHistory[order.statusHistory.length - 1].updatedBy.toString() === seller.user.toString()) {
            await notificationService.createNotification({
              recipient: order.buyer,
              type: 'order',
              title: 'Order Cancelled',
              message: `Your order #${order.orderNumber} has been cancelled by the seller.`,
              data: { orderId: order._id },
              priority: 'high'
            });
            
            await emailService.sendEmail({
              to: buyer.email,
              subject: `Order #${order.orderNumber} Cancelled`,
              template: 'order-cancelled',
              data: {
                order,
                buyer,
                seller
              }
            });
          }
          
          // Notify seller if buyer cancelled
          if (order.statusHistory[order.statusHistory.length - 1].updatedBy.toString() === order.buyer.toString()) {
            await notificationService.createNotification({
              recipient: seller.user,
              type: 'order',
              title: 'Order Cancelled',
              message: `Order #${order.orderNumber} has been cancelled by the buyer.`,
              data: { orderId: order._id },
              priority: 'high'
            });
            
            await emailService.sendEmail({
              to: seller.contactEmail,
              subject: `Order #${order.orderNumber} Cancelled`,
              template: 'order-cancelled-seller',
              data: {
                order,
                buyer,
                seller
              }
            });
          }
          break;
          
        case 'refunded':
          // Notify buyer
          await notificationService.createNotification({
            recipient: order.buyer,
            type: 'payment',
            title: 'Order Refunded',
            message: `Your order #${order.orderNumber} has been refunded.`,
            data: { orderId: order._id },
            priority: 'high'
          });
          
          await emailService.sendEmail({
            to: buyer.email,
            subject: `Refund Issued for Order #${order.orderNumber}`,
            template: 'order-refunded',
            data: {
              order,
              buyer
            }
          });
          break;
      }
    } catch (error) {
      // Log error but don't stop the process
      console.error('Error sending order notifications:', error);
    }
  }
}

module.exports = new OrderService();