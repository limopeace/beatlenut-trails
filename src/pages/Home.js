import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero section will go here */}
      <section className="hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>Adventure Awaits in Northeast India</h1>
            <p>Discover the untamed beauty of Northeast India with curated travel experiences</p>
            <button className="btn btn-primary">Explore Services</button>
          </motion.div>
        </div>
      </section>
      
      {/* Featured services section placeholder */}
      <section className="featured-services">
        <div className="container">
          <h2>Our Featured Services</h2>
          <div className="services-grid">
            {/* Service cards will go here */}
            <p>Coming Soon</p>
          </div>
        </div>
      </section>

      {/* Destinations section placeholder */}
      <section className="destinations">
        <div className="container">
          <h2>Explore Destinations</h2>
          <div className="destinations-grid">
            {/* Destination cards will go here */}
            <p>Coming Soon</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;