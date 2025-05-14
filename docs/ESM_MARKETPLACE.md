# ESM Marketplace Documentation

## Overview

The Ex-Servicemen (ESM) Marketplace is a platform designed to support veterans by providing them with a channel to sell products and offer services. The marketplace connects ex-servicemen sellers with customers looking for quality products and professional services.

## Features

### For Sellers

- **Seller Registration**: Ex-servicemen can register with their service details and verification documents
- **Verification Process**: Admin verification of military service credentials
- **Product/Service Management**: Add, edit, and remove products or services
- **Profile Management**: Maintain seller profile and contact information
- **Order Management**: View and process customer orders (future implementation)
- **Analytics**: Basic statistics on product views and sales (future implementation)

### For Customers

- **Browse Products/Services**: Search and filter products by categories, price, etc.
- **Seller Information**: View seller profiles with service backgrounds
- **Reviews**: Read and write product and seller reviews (future implementation)
- **Order Management**: Track orders and communicate with sellers (future implementation)

### For Administrators

- **Seller Verification**: Review and verify ex-servicemen credentials
- **Content Moderation**: Approve products and services
- **User Management**: Manage seller and customer accounts
- **Analytics Dashboard**: Monitor marketplace activity and performance (future implementation)

## Technical Architecture

### Data Models

#### ESM Seller Model
```javascript
{
  fullName: String,
  email: String,
  password: String (hashed),
  phone: String,
  location: String,
  serviceBranch: Enum['army', 'navy', 'airforce', 'coast-guard', 'other'],
  rank: String,
  serviceNumber: String,
  serviceYears: {
    from: Number,
    to: Number
  },
  businessName: String,
  sellerType: {
    products: Boolean,
    services: Boolean
  },
  category: String,
  description: String,
  verificationDocument: String,
  isVerified: Boolean,
  status: Enum['pending', 'active', 'suspended', 'rejected'],
  ratings: {
    average: Number,
    count: Number
  }
}
```

#### ESM Product Model
```javascript
{
  name: String,
  seller: ObjectId (ref: 'ESMSeller'),
  category: String,
  type: Enum['product', 'service'],
  description: String,
  shortDescription: String,
  price: {
    amount: Number,
    currency: String,
    unit: String,
    isNegotiable: Boolean
  },
  images: [{
    url: String,
    alt: String,
    isMain: Boolean
  }],
  stock: {
    available: Number,
    isLimited: Boolean
  },
  availability: {
    inPerson: Boolean,
    remote: Boolean,
    locations: [String]
  },
  features: [String],
  status: Enum['draft', 'active', 'inactive', 'rejected'],
  isApproved: Boolean,
  views: Number,
  ratings: {
    average: Number,
    count: Number
  }
}
```

#### ESM Review Model
```javascript
{
  product: ObjectId (ref: 'ESMProduct'),
  seller: ObjectId (ref: 'ESMSeller'),
  user: ObjectId (ref: 'User'),
  rating: Number,
  title: String,
  comment: String,
  pros: [String],
  cons: [String],
  images: [{
    url: String,
    caption: String
  }],
  isVerifiedPurchase: Boolean,
  isApproved: Boolean,
  isHidden: Boolean,
  sellerResponse: {
    content: String,
    createdAt: Date
  },
  helpfulness: {
    helpful: Number,
    notHelpful: Number,
    voters: [{
      user: ObjectId (ref: 'User'),
      vote: Enum['helpful', 'not_helpful']
    }]
  }
}
```

### API Endpoints

#### Seller Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /api/esm/sellers/register | Register a new seller | Public |
| POST | /api/esm/sellers/login | Login as a seller | Public |
| GET | /api/esm/sellers/profile | Get seller's own profile | Seller |
| PUT | /api/esm/sellers/profile | Update seller profile | Seller |
| PUT | /api/esm/sellers/change-password | Change seller password | Seller |
| GET | /api/esm/sellers | Get all sellers (admin) | Admin |
| GET | /api/esm/sellers/directory | Get public seller directory | Public |
| GET | /api/esm/sellers/:id | Get seller by ID | Public |
| PUT | /api/esm/sellers/:id/verify | Verify seller status | Admin |

#### Product Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /api/esm/products | Create a new product | Seller |
| GET | /api/esm/products | Get all products | Public |
| GET | /api/esm/products/featured | Get featured products | Public |
| GET | /api/esm/products/admin | Get all products (admin) | Admin |
| GET | /api/esm/products/seller | Get current seller's products | Seller |
| GET | /api/esm/products/seller/:sellerId | Get products by seller ID | Public |
| GET | /api/esm/products/:id | Get product by ID | Public |
| PUT | /api/esm/products/:id | Update a product | Seller |
| DELETE | /api/esm/products/:id | Delete a product | Seller |
| PUT | /api/esm/products/:id/approve | Approve a product | Admin |

#### Review Endpoints (Future Implementation)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /api/esm/reviews | Create a new review | User |
| GET | /api/esm/reviews/product/:productId | Get reviews for a product | Public |
| GET | /api/esm/reviews/seller/:sellerId | Get reviews for a seller | Public |
| PUT | /api/esm/reviews/:id | Update a review | User |
| DELETE | /api/esm/reviews/:id | Delete a review | User |
| POST | /api/esm/reviews/:id/response | Add seller response | Seller |

## Frontend Components

### ESM Portal Pages

1. **Main Marketplace Page**
   - Featured products and services
   - Category browsing
   - Seller spotlights
   - Success stories from veterans

2. **Products Page**
   - Product listings with filtering and search
   - Category navigation
   - Sort options (newest, price, rating)
   - Responsive product cards with images

3. **Services Page**
   - Service listings with filtering and search
   - Category navigation
   - Location-based filtering

4. **Seller Registration Page**
   - Registration form with military service details
   - Document upload for verification
   - Terms and conditions acceptance

5. **Seller Dashboard** (Future Implementation)
   - Product/service management
   - Order processing
   - Analytics and reporting

### Image Configuration

The ESM Marketplace uses Next.js Image component which requires external domains to be explicitly configured. This has been set up in `next.config.js`:

```js
images: {
  domains: [
    'localhost', 
    'beatlenut-trails.com', 
    'picsum.photos', 
    'randomuser.me',
    'sample-videos.com',
    'example.com',
    'placehold.it',
    'placekitten.com',
    'place-hold.it',
    'placeimg.com',
    'ui-avatars.com',
    'source.unsplash.com'
  ],
},
```

This configuration allows using external images in Next.js Image components, which is particularly important for:
- Product images from picsum.photos during development
- User avatars for seller profiles from services like randomuser.me
- Placeholder content during development

For more details on image handling, see the [Image Handling documentation](./IMAGE_HANDLING.md).

## Workflows

### Seller Registration and Verification

1. Ex-serviceman submits registration form with service details
2. Admin reviews verification documents and service information
3. Admin approves or rejects the seller
4. Seller receives notification of verification status
5. If approved, seller can login and start listing products/services

### Product/Service Listing

1. Verified seller creates a new product/service listing
2. Admin reviews and approves/rejects the listing
3. If approved, listing appears in the marketplace
4. Customers can view and purchase the product or service

## Implementation Progress

### Completed

- Data models and schemas (Mongoose)
- API routes and controllers
- Validation schemas
- Frontend pages for marketplace browsing
- Seller registration system
- Next.js Image configuration for external domains

### In Progress

- Authentication system integration
- Admin dashboard for seller verification
- Image handling and configuration

### Pending

- Order management system
- Review and rating system
- Payment processing integration
- Analytics dashboard

## Future Enhancements

1. **Mobile Application**: Develop native mobile apps for Android and iOS
2. **Chat System**: Real-time messaging between buyers and sellers
3. **Group Buying**: Enable group purchases with special discounts
4. **Veteran Community Features**: Forums, events, and resources for ex-servicemen
5. **Logistics Integration**: Connect with shipping providers for seamless delivery