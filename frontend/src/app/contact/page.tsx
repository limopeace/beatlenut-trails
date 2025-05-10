'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitError('There was a problem submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:py-32 bg-deep-forest-green text-off-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl">
              Have a question or ready to plan your adventure? We're here to help you create unforgettable experiences in Northeast India.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-off-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-deep-forest-green">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-deep-forest-green text-off-white p-3 rounded-full mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest-green mb-1">Our Address</h3>
                    <p className="text-dark-grey">123 Army Road, Shillong, Meghalaya, India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-deep-forest-green text-off-white p-3 rounded-full mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest-green mb-1">Phone</h3>
                    <p className="text-dark-grey">+91 9876543210</p>
                    <p className="text-dark-grey">+91 9876543211</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-deep-forest-green text-off-white p-3 rounded-full mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest-green mb-1">Email</h3>
                    <p className="text-dark-grey">info@beatlenuttrails.com</p>
                    <p className="text-dark-grey">support@beatlenuttrails.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-deep-forest-green text-off-white p-3 rounded-full mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest-green mb-1">Business Hours</h3>
                    <p className="text-dark-grey">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-dark-grey">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-dark-grey">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook" className="bg-deep-forest-green text-off-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="bg-deep-forest-green text-off-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="bg-deep-forest-green text-off-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" aria-label="YouTube" className="bg-deep-forest-green text-off-white p-3 rounded-full hover:bg-sunrise-orange transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-deep-forest-green">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-vibrant-teal/10 border border-vibrant-teal text-vibrant-teal p-4 rounded mb-6">
                  <h3 className="font-semibold text-lg mb-2">Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon.</p>
                  <Button 
                    onClick={() => setSubmitSuccess(false)} 
                    variant="primary"
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
                      {submitError}
                    </div>
                  )}
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-dark-grey font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-deep-forest-green ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-dark-grey font-medium mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-deep-forest-green ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-dark-grey font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-dark-grey font-medium mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-deep-forest-green"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Trip Planning">Trip Planning</option>
                        <option value="Booking Question">Booking Question</option>
                        <option value="ESM Marketplace">ESM Marketplace</option>
                        <option value="Partnership Opportunity">Partnership Opportunity</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-dark-grey font-medium mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-deep-forest-green ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-300 relative">
        {/* This would be replaced with an actual map component in a real implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-deep-forest-green text-xl">Interactive Map Would Be Here</div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-light-grey">
        <div className="container-custom">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our services"
          />
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-3">
                  How do I book a tour with BeatlenutTrails?
                </h3>
                <p>
                  You can book a tour by filling out our contact form, calling us directly, or selecting a package from our Packages page and following the booking process. We'll work with you to customize your itinerary based on your preferences.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-3">
                  What makes your tours unique?
                </h3>
                <p>
                  Our tours are led by ex-Army personnel who bring exceptional knowledge of Northeast India, attention to detail, and a focus on safety. We provide authentic experiences that connect travelers with local communities and highlight the region's natural beauty and cultural heritage.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-3">
                  How do I join the ESM Marketplace as a seller?
                </h3>
                <p>
                  Ex-Servicemen can register through our ESM Portal. You'll need to verify your service status, create a profile, and then you can start listing your products or services. Our team provides support throughout the process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-3">
                  What is the best time to visit Northeast India?
                </h3>
                <p>
                  The best time to visit is during the dry season from October to May. However, each state has its unique climate, and some experiences are seasonal. Contact us with your interests, and we'll recommend the best time for your specific trip.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-deep-forest-green mb-3">
                  Can you arrange custom tours for special interests or groups?
                </h3>
                <p>
                  Absolutely! We specialize in customized tours based on your interests, whether it's adventure, culture, wildlife, or photography. We also arrange tours for corporate groups, families, or special occasions with tailored experiences.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <p className="mb-4">
                Still have questions? We're here to help.
              </p>
              <Button href="tel:+919876543210" variant="secondary">
                Call Us Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}