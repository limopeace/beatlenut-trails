'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SectionContainer from '@/components/common/SectionContainer';
import FadeIn from '@/components/animations/FadeIn';

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
      // Call the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact form');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'There was a problem submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-96 md:h-128 overflow-hidden">
        <div className="absolute inset-0 bg-deep-forest/70 z-10"></div>
        <img 
          src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg" 
          alt="Contact us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-pale-straw mb-6 font-clash">Contact Us</h1>
          <p className="text-xl text-pale-straw/90 max-w-2xl">
            Have a question or ready to plan your adventure? We're here to help you create unforgettable experiences in Northeast India.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <SectionContainer
        background="pale-straw"
        className="relative overflow-hidden"
        id="contact-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <FadeIn direction="right">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-deep-forest font-clash">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-forest-green text-pale-straw p-3 rounded-full mr-4 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest mb-1 font-clash">Our Address</h3>
                    <p className="text-deep-forest/80">123 Army Road, Shillong, Meghalaya, India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-forest-green text-pale-straw p-3 rounded-full mr-4 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest mb-1 font-clash">Phone</h3>
                    <p className="text-deep-forest/80">+91 9876543210</p>
                    <p className="text-deep-forest/80">+91 9876543211</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-forest-green text-pale-straw p-3 rounded-full mr-4 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest mb-1 font-clash">Email</h3>
                    <p className="text-deep-forest/80">gurpreet.nijher@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-forest-green text-pale-straw p-3 rounded-full mr-4 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-deep-forest mb-1 font-clash">Business Hours</h3>
                    <p className="text-deep-forest/80">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-deep-forest/80">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-deep-forest/80">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-deep-forest mb-4 font-clash">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook" className="bg-forest-green text-pale-straw p-3 rounded-full hover:bg-moss-green transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="bg-forest-green text-pale-straw p-3 rounded-full hover:bg-moss-green transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="bg-forest-green text-pale-straw p-3 rounded-full hover:bg-moss-green transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" aria-label="YouTube" className="bg-forest-green text-pale-straw p-3 rounded-full hover:bg-moss-green transition-colors shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Contact Form */}
          <FadeIn direction="left">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-moss-green/10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-deep-forest font-clash">Send Us a Message</h2>
              
              {submitSuccess ? (
                <div className="bg-forest-green/10 border border-forest-green text-deep-forest p-4 rounded-md mb-6">
                  <h3 className="font-semibold text-lg mb-2 font-clash">Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)} 
                    className="mt-4 px-6 py-2 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition-colors duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-6">
                      {submitError}
                    </div>
                  )}
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-deep-forest/90 font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 ${
                          formErrors.name ? 'border-red-500' : 'border-moss-green/30'
                        } bg-pale-straw/10`}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-deep-forest/90 font-medium mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 ${
                          formErrors.email ? 'border-red-500' : 'border-moss-green/30'
                        } bg-pale-straw/10`}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-deep-forest/90 font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-pale-straw/10"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-deep-forest/90 font-medium mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-moss-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 bg-pale-straw/10 text-deep-forest"
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
                    <label htmlFor="message" className="block text-deep-forest/90 font-medium mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green/50 ${
                        formErrors.message ? 'border-red-500' : 'border-moss-green/30'
                      } bg-pale-straw/10`}
                      required
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition-colors duration-300 disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Submit Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-moss-green/10 rounded-full -mr-32 -mb-16 -z-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-forest-green/5 rounded-full -ml-16 -mt-16 -z-10"></div>
      </SectionContainer>

      {/* Map Section */}
      <section className="bg-pale-straw relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Map Container */}
            <div className="lg:col-span-2 h-[450px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114417.01168372156!2d91.81154274659902!3d25.575287619436085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37507e8f34c31857%3A0xc46f9df0e46c5eb0!2sShillong%2C%20Meghalaya!5e0!3m2!1sen!2sin!4v1684157862858!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen 
                referrerPolicy="no-referrer-when-downgrade"
                title="BeatlenutTrails Office Location"
                className="z-10"
              ></iframe>
              
              {/* Subtle overlay for branding */}
              <div className="absolute bottom-0 left-0 z-20 bg-deep-forest/80 text-pale-straw py-2 px-4 rounded-tr-md">
                <span className="font-medium">BeatlenutTrails Headquarters</span>
              </div>
            </div>
            
            {/* Location Info Card */}
            <div className="p-10 flex items-center justify-center bg-deep-forest text-pale-straw">
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-forest-green flex items-center justify-center mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold font-clash">Our Location</h3>
                  </div>
                  <p className="text-lg ml-16">123 Army Road, Shillong</p>
                  <p className="text-pale-straw/80 ml-16">Meghalaya, India</p>
                </div>
                
                <div className="ml-16 space-y-4">
                  <div>
                    <h4 className="text-md font-medium mb-1">Directions</h4>
                    <p className="text-pale-straw/80 text-sm">10 minutes from Shillong Airport</p>
                    <p className="text-pale-straw/80 text-sm">5 minutes from City Center</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium mb-1">GPS Coordinates</h4>
                    <p className="text-pale-straw/80 text-sm">25.5788° N, 91.8933° E</p>
                  </div>
                  
                  <a 
                    href="https://goo.gl/maps/YgkJ8LZ7XQ3PYaYH7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 py-2 px-4 bg-forest-green rounded-md hover:bg-moss-green transition-colors text-sm font-medium"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer section to show background before footer */}
      <section className="bg-gradient-to-b from-pale-straw via-moss-green/20 to-deep-forest/80 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-deep-forest mb-4 font-clash">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-deep-forest/80 mb-8">
              Let us help you create unforgettable memories in Northeast India
            </p>
            <a 
              href="/travel-listings" 
              className="inline-block px-8 py-3 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-moss-green transition-colors duration-300"
            >
              Explore Our Tours
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <SectionContainer
        background="moss-green"
        className="relative overflow-hidden"
        id="faq-section"
      >
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-deep-forest font-clash">Frequently Asked Questions</h2>
            <p className="text-deep-forest/80 max-w-3xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <FaqItem 
                question="How do I book a tour with BeatlenutTrails?"
                answer="You can book a tour by filling out our contact form, calling us directly, or selecting a package from our Packages page and following the booking process. We'll work with you to customize your itinerary based on your preferences."
              />
              
              <FaqItem 
                question="What makes your tours unique?"
                answer="Our tours are led by ex-Army personnel who bring exceptional knowledge of Northeast India, attention to detail, and a focus on safety. We provide authentic experiences that connect travelers with local communities and highlight the region's natural beauty and cultural heritage."
              />
              
              <FaqItem 
                question="How do I join the ESM Marketplace as a seller?"
                answer="Ex-Servicemen can register through our ESM Portal. You'll need to verify your service status, create a profile, and then you can start listing your products or services. Our team provides support throughout the process."
              />
              
              <FaqItem 
                question="What is the best time to visit Northeast India?"
                answer="The best time to visit is during the dry season from October to May. However, each state has its unique climate, and some experiences are seasonal. Contact us with your interests, and we'll recommend the best time for your specific trip."
              />
              
              <FaqItem 
                question="Can you arrange custom tours for special interests or groups?"
                answer="Absolutely! We specialize in customized tours based on your interests, whether it's adventure, culture, wildlife, or photography. We also arrange tours for corporate groups, families, or special occasions with tailored experiences."
              />
            </div>
            
            <div className="text-center mt-10">
              <p className="mb-4 text-deep-forest/90">
                Still have questions? We're here to help.
              </p>
              <a
                href="tel:+919876543210"
                className="inline-block px-8 py-3 bg-forest-green text-pale-straw font-medium rounded-md hover:bg-deep-forest transition-colors duration-300"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-forest-green/10 -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pale-straw/5 rounded-full -mr-32 -mt-16 -z-10"></div>
      </SectionContainer>
    </>
  );
}

// FAQ Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-forest-green/20' : 'hover:shadow-md'}`}
    >
      <button
        className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-deep-forest font-clash">
          {question}
        </h3>
        <span className={`text-forest-green transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </button>
      
      <div 
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 pt-0 text-deep-forest/70">
          {answer}
        </div>
      </div>
    </div>
  );
}