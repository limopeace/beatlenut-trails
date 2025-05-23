'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEnvelope, faPhone, faUserFriends, faUtensils, faBed, faCar, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const BookingOption = ({ icon, title, description, price, recommended = false, onClick }) => {
  return (
    <motion.div
      className={`relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border ${
        recommended ? 'border-green-500' : 'border-transparent'
      } h-full`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -5 }}
    >
      {recommended && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 font-medium">
          RECOMMENDED
        </div>
      )}
      
      <div className="p-6">
        <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-green-700 mb-5">
          <FontAwesomeIcon icon={icon} className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{description}</p>
        
        <div className="flex justify-between items-end">
          <div>
            <span className="block text-xs text-gray-500 mb-1">Starting from</span>
            <span className="text-2xl font-medium text-green-700">₹{price}</span>
            <span className="text-sm text-gray-500">/person</span>
          </div>
          
          <button
            onClick={onClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VaaniBookingCTA = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    message: ''
  });
  
  const packages = [
    {
      id: 'day-visit',
      title: 'Day Visit',
      description: 'Spend a day at our estate with guided tea tours, tea tasting session, and a garden lunch.',
      price: 1500,
      icon: faLeaf
    },
    {
      id: 'tea-weekend',
      title: 'Tea Weekend Package',
      description: 'Two nights stay in our plantation bungalow with all meals, tea tours, and cultural experiences.',
      price: 7500,
      icon: faBed,
      recommended: true
    },
    {
      id: 'culinary',
      title: 'Culinary Experience',
      description: 'Tea-infused gourmet meals prepared by our chef, paired with our premium teas.',
      price: 2500,
      icon: faUtensils
    },
    {
      id: 'private-tour',
      title: 'Private Estate Tour',
      description: 'Exclusive behind-the-scenes tour of our production facilities with the estate manager.',
      price: 3500,
      icon: faCar
    }
  ];
  
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would process the form data here
    console.log('Booking submitted:', { package: selectedPackage, ...formData });
    setShowModal(false);
    alert('Thank you for your booking request! We will contact you shortly to confirm your reservation.');
  };

  return (
    <div>
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/id/1067/1920/1080"
            alt="Tea Estate View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16">
            <motion.h2 
              className="text-4xl font-serif font-medium text-white mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Experience Vaani Greens
            </motion.h2>
            <div className="w-24 h-0.5 bg-green-400 mb-6"></div>
            <p className="text-center text-white text-lg max-w-3xl mx-auto opacity-90">
              Immerse yourself in the world of premium tea with our curated experiences,
              from day visits to extended stays in our heritage bungalows.
            </p>
          </div>
          
          {/* Booking Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {packages.map(pkg => (
              <BookingOption 
                key={pkg.id}
                icon={pkg.icon}
                title={pkg.title}
                description={pkg.description}
                price={pkg.price}
                recommended={pkg.recommended}
                onClick={() => handlePackageSelect(pkg)}
              />
            ))}
          </div>
          
          {/* Alternative Contact Methods */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium text-white mb-2">Need More Information?</h3>
              <p className="text-white text-opacity-80">
                Contact our reservation team directly through any of these channels
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="tel:+919876543210"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-4 rounded-lg flex flex-col items-center text-center"
              >
                <FontAwesomeIcon icon={faPhone} className="text-white w-6 h-6 mb-3" />
                <span className="text-white font-medium mb-1">Call Us</span>
                <span className="text-white text-opacity-80 text-sm">+91 98765 43210</span>
              </a>
              
              <a
                href="mailto:bookings@vaanigreens.com"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-4 rounded-lg flex flex-col items-center text-center"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-white w-6 h-6 mb-3" />
                <span className="text-white font-medium mb-1">Email Us</span>
                <span className="text-white text-opacity-80 text-sm">bookings@vaanigreens.com</span>
              </a>
              
              <a
                href="https://wa.me/919876543210?text=I'm%20interested%20in%20booking%20a%20visit%20to%20Vaani%20Greens%20Tea%20Estate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-4 rounded-lg flex flex-col items-center text-center"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-white w-6 h-6 mb-3" />
                <span className="text-white font-medium mb-1">WhatsApp</span>
                <span className="text-white text-opacity-80 text-sm">Chat with us instantly</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-medium text-gray-900">
                Book {selectedPackage?.title}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={selectedPackage?.icon} className="text-green-700 w-8 h-8 mr-4" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{selectedPackage?.title}</h4>
                    <p className="text-gray-600 text-sm">{selectedPackage?.description}</p>
                    <div className="text-green-700 mt-1">
                      <span className="font-medium">₹{selectedPackage?.price}</span> per person
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                    <option value="more">More than 10</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us about any special requirements or questions..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VaaniBookingCTA;