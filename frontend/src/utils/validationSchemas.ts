import { z } from 'zod';

// Common schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const phoneSchema = z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number').optional();

// ESM Login schema
export const esmLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional()
});

// ESM Registration schema
export const esmRegistrationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['seller', 'buyer']),
  phoneNumber: phoneSchema,
  businessName: z.string().min(3, 'Business name must be at least 3 characters').optional(),
  businessDescription: z.string().min(10, 'Business description must be at least 10 characters').optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ESM Product schema
export const esmProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Product description must be at least 10 characters'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Please select a category'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  availability: z.boolean().optional(),
  units: z.string().optional(),
  minOrderQuantity: z.number().positive().optional(),
  tags: z.array(z.string()).optional()
});

// ESM Service schema
export const esmServiceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Service description must be at least 10 characters'),
  category: z.enum(['adventure', 'cultural', 'nature', 'wellness', 'educational', 'entertainment', 'other']),
  price: z.number().positive('Price must be a positive number'),
  priceType: z.enum(['per_person', 'flat_rate', 'hourly', 'daily']),
  duration: z.number().positive().optional(),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    coordinates: z.tuple([z.number(), z.number()]).optional()
  }),
  availability: z.object({
    days: z.array(z.string()).min(1, 'At least one day must be selected'),
    startDate: z.date().optional(),
    endDate: z.date().optional()
  }),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  maxGroupSize: z.number().positive().optional(),
  equipmentProvided: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  phoneNumber: phoneSchema,
  businessName: z.string().min(3, 'Business name must be at least 3 characters').optional(),
  businessDescription: z.string().min(10, 'Business description must be at least 10 characters').optional(),
  profilePicture: z.string().url('Please enter a valid URL').optional()
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// Type exports
export type EsmLoginData = z.infer<typeof esmLoginSchema>;
export type EsmRegistrationData = z.infer<typeof esmRegistrationSchema>;
export type EsmProductData = z.infer<typeof esmProductSchema>;
export type EsmServiceData = z.infer<typeof esmServiceSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;