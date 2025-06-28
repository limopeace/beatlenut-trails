/**
 * Middleware to transform frontend form data to backend model format
 */

/**
 * Transform seller registration form data from frontend to backend format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const transformSellerRegistration = (req, res, next) => {
  try {
    
    const {
      name,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      phone,
      serviceBackground,
      businessName,
      businessDescription,
      establishmentYear,
      website,
      address,
      city,
      state,
      pincode,
      serviceRadius,
      categories,
      termsAccepted,
      acceptTerms,
      acceptPrivacyPolicy,
      ...otherFields
    } = req.body;

    // Helper function to map frontend categories to backend enum values
    const mapCategoryToEnum = (category) => {
      const categoryMap = {
        'Adventure Tours': 'consulting',
        'Trekking Guide': 'consulting', 
        'Motorcycle Tours': 'consulting',
        'Expedition Planning': 'consulting',
        'Survival Training': 'training',
        'Wildlife Photography': 'consulting',
        'Equipment Rental': 'technical-services',
        'Transport Services': 'technical-services',
        'Accommodation': 'consulting',
        'Local Cuisine': 'food-products',
        'Cultural Experiences': 'consulting',
        'Safety & Rescue': 'security-services',
        'Mountaineering': 'consulting',
        'Skiing/Snowboarding': 'consulting',
        'Water Sports': 'consulting',
        'Camping': 'consulting'
      };
      
      return categoryMap[category] || 'other';
    };

    // Parse categories if it's a JSON string
    let parsedCategories = categories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (e) {
        parsedCategories = [categories]; // Single category as string
      }
    }

    // Transform data to match backend model
    const transformedData = {
      fullName: name || `${firstName || ''} ${lastName || ''}`.trim(),
      email,
      phone: phoneNumber || phone || '',
      password: password || 'TempPass123',
      location: `${address || ''}, ${city || ''}, ${state || ''} - ${pincode || ''}`.replace(/^, , /, ''),
      
      // Service details
      serviceBranch: 'army', // Default, should be extracted from serviceBackground
      rank: 'Ex-Serviceman', // Default, should be extracted from serviceBackground
      serviceNumber: `ESM${Date.now()}`, // Generate temporary number
      serviceYears: {
        from: parseInt(establishmentYear) || 2000,
        to: new Date().getFullYear()
      },
      
      // Business information
      businessName: businessName || `${firstName || ''} ${lastName || ''} Services`.trim(),
      sellerType: {
        products: parsedCategories ? parsedCategories.some(cat => ['Local Cuisine', 'Equipment Rental'].includes(cat)) : false,
        services: true // Default to services if no specific product categories are selected
      },
      category: parsedCategories && parsedCategories.length > 0 ? mapCategoryToEnum(parsedCategories[0]) : 'other',
      description: businessDescription || serviceBackground || 'Professional services by ex-serviceman',
      
      // Validation required field - temporary document reference
      verificationDocument: 'pending-upload',
      
      // Additional data
      website,
      serviceRadius: parseInt(serviceRadius) || 50,
      
      // Include any other fields passed through
      ...otherFields
    };

    
    // Replace req.body with transformed data
    req.body = transformedData;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transformSellerRegistration
};