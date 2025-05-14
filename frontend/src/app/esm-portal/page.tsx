import React from 'react';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBriefcase, faUtensils, faShield, faChartPie, faBullseye, faSeedling,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

// Sample featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Handcrafted Bamboo Art',
    price: '₹1,200',
    seller: 'Capt. Rajesh Singh (Retd.)',
    image: 'https://picsum.photos/id/119/800/500', // Bamboo-like image
  },
  {
    id: 2,
    name: 'Organic Tea Collection',
    price: '₹850',
    seller: 'Maj. Anand Kumar (Retd.)',
    image: 'https://picsum.photos/id/431/800/500', // Tea/plants like image
  },
  {
    id: 3,
    name: 'Traditional Handloom Textiles',
    price: '₹2,500',
    seller: 'Lt. Col. Vijay Sharma (Retd.)',
    image: 'https://picsum.photos/id/104/800/500', // Textile-like pattern
  },
  {
    id: 4,
    name: 'Security Consultation Services',
    price: 'Contact for pricing',
    seller: 'Col. Amar Joshi (Retd.)',
    image: 'https://picsum.photos/id/686/800/500', // Office/business like image
  },
];

// Sample service categories
const serviceCategories = [
  {
    id: 1,
    name: 'Handicrafts',
    count: 45,
    icon: faBriefcase,
  },
  {
    id: 2,
    name: 'Food Products',
    count: 32,
    icon: faUtensils,
  },
  {
    id: 3,
    name: 'Security Services',
    count: 28,
    icon: faShield,
  },
  {
    id: 4,
    name: 'Consulting',
    count: 24,
    icon: faChartPie,
  },
  {
    id: 5,
    name: 'Training',
    count: 20,
    icon: faBullseye,
  },
  {
    id: 6,
    name: 'Agriculture',
    count: 18,
    icon: faSeedling,
  },
];

export default function ESMPortal() {
  return (
    <>
      {/* Hero Section - Expanded Vertically with Full Background Image */}
      <section className="relative bg-deep-forest min-h-screen flex items-center pt-36 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0">
          <img 
            src="/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg" 
            alt="ESM Portal Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-forest/90 via-deep-forest/75 to-deep-forest/90"></div>
          <div className="absolute inset-0 bg-deep-forest/30 backdrop-blur-sm"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto text-pale-straw mb-16">
            <span className="inline-block border-2 border-pale-straw/60 px-4 py-1 rounded-full text-sm font-medium mb-6">Empowering Our Heroes</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-clash leading-tight">
              Ex-Servicemen Marketplace
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Supporting our heroes through a platform that connects skilled Ex-Servicemen with customers looking for quality products and services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/esm-portal/products" variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all px-8 py-3 text-lg">
                Browse Products
              </Button>
              <Button href="/esm-portal/services" variant="primary" className="bg-pale-straw text-deep-forest hover:bg-pale-straw/90 transition-all font-medium px-8 py-3 text-lg">
                Find Services
              </Button>
              <Button href="/esm-portal/register" variant="secondary" className="bg-transparent border-2 border-pale-straw text-pale-straw hover:bg-pale-straw/20 transition-all px-8 py-3 text-lg">
                Register as ESM
              </Button>
            </div>
          </div>
          
          {/* Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-pale-straw/10 backdrop-blur-sm rounded-lg p-6 text-center border border-pale-straw/20">
              <div className="text-3xl md:text-4xl font-bold text-pale-straw mb-2">500+</div>
              <div className="text-pale-straw/80">Ex-Servicemen</div>
            </div>
            <div className="bg-pale-straw/10 backdrop-blur-sm rounded-lg p-6 text-center border border-pale-straw/20">
              <div className="text-3xl md:text-4xl font-bold text-pale-straw mb-2">1,200+</div>
              <div className="text-pale-straw/80">Products & Services</div>
            </div>
            <div className="bg-pale-straw/10 backdrop-blur-sm rounded-lg p-6 text-center border border-pale-straw/20">
              <div className="text-3xl md:text-4xl font-bold text-pale-straw mb-2">30+</div>
              <div className="text-pale-straw/80">Categories</div>
            </div>
            <div className="bg-pale-straw/10 backdrop-blur-sm rounded-lg p-6 text-center border border-pale-straw/20">
              <div className="text-3xl md:text-4xl font-bold text-pale-straw mb-2">4,500+</div>
              <div className="text-pale-straw/80">Happy Customers</div>
            </div>
          </div>
          
          {/* Badge overlay */}
          <div className="absolute bottom-4 right-4 bg-pale-straw/90 text-deep-forest px-4 py-2 rounded-md text-sm font-medium shadow-lg">
            Proudly Supporting Our Veterans
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-pale-straw py-16">
        <div className="container-custom">
          <SectionTitle
            title="Featured Products & Services"
            subtitle="Discover high-quality offerings from our Ex-Servicemen community"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group h-full flex flex-col shadow-md transition-all hover:shadow-lg">
                <div className="relative h-52 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Badge for hot items */}
                  {(product.id === 2 || product.id === 4) && (
                    <div className="absolute top-3 right-3 bg-sunrise-orange text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      Hot
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="inline-block bg-moss-green/20 text-forest-green text-xs px-2 py-1 rounded-full mb-2">
                      {product.id % 2 === 0 ? 'Product' : 'Service'}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">{product.seller}</p>
                    <h3 className="font-semibold text-lg mb-2 text-deep-forest">{product.name}</h3>
                    <p className="font-bold text-forest-green">{product.price}</p>
                  </div>
                  <Button
                    href={`/esm-portal/products/${product.id}`}
                    variant="primary"
                    className="mt-4 bg-forest-green text-pale-straw hover:bg-moss-green transition-all py-2"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button href="/esm-portal/products" variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-white shadow-sm py-16">
        <div className="container-custom">
          <SectionTitle
            title="Browse Categories"
            subtitle="Find exactly what you're looking for from our diverse range of offerings"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {serviceCategories.slice(0, 3).map((category) => (
              <a
                key={category.id}
                href={`/esm-portal/category/${category.id}`}
                className="group p-8 bg-moss-green/20 rounded-lg text-center transition-all hover:bg-deep-forest hover:text-pale-straw flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-moss-green/30 rounded-full flex items-center justify-center mb-5 text-forest-green group-hover:bg-pale-straw/20 group-hover:text-pale-straw transition-all">
                  <FontAwesomeIcon icon={category.icon} className="text-3xl" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-lg mb-2">{category.name}</h3>
                  <div className="inline-block bg-forest-green text-pale-straw text-sm px-3 py-1 rounded-full group-hover:bg-pale-straw/30">
                    {category.count} listings
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {serviceCategories.slice(3, 6).map((category) => (
              <a
                key={category.id}
                href={`/esm-portal/category/${category.id}`}
                className="group p-8 bg-moss-green/20 rounded-lg text-center transition-all hover:bg-deep-forest hover:text-pale-straw flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-moss-green/30 rounded-full flex items-center justify-center mb-5 text-forest-green group-hover:bg-pale-straw/20 group-hover:text-pale-straw transition-all">
                  <FontAwesomeIcon icon={category.icon} className="text-3xl" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-lg mb-2">{category.name}</h3>
                  <div className="inline-block bg-forest-green text-pale-straw text-sm px-3 py-1 rounded-full group-hover:bg-pale-straw/30">
                    {category.count} listings
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-moss-green/30 py-16">
        <div className="container-custom">
          <SectionTitle
            title="How It Works"
            subtitle="Simple steps to start buying or selling on our ESM marketplace"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            {/* For Buyers */}
            <div className="card p-8 pt-16 flex flex-col h-full relative border-t-4 border-forest-green">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-forest-green text-pale-straw flex items-center justify-center text-2xl font-bold shadow-md">
                1
              </div>
              <h3 className="text-xl font-semibold mb-6 text-center text-deep-forest">For Buyers</h3>
              <ul className="space-y-5 mb-8 flex-grow">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Browse products and services offered by Ex-Servicemen</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Contact sellers directly through our messaging system</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Purchase with confidence knowing you're supporting veterans</span>
                </li>
              </ul>
              <div className="text-center">
                <Button href="/esm-portal/products" variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all">
                  Start Shopping
                </Button>
              </div>
            </div>

            {/* For Sellers */}
            <div className="card p-8 pt-16 flex flex-col h-full relative border-t-4 border-forest-green">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-forest-green text-pale-straw flex items-center justify-center text-2xl font-bold shadow-md">
                2
              </div>
              <h3 className="text-xl font-semibold mb-6 text-center text-deep-forest">For Sellers</h3>
              <ul className="space-y-5 mb-8 flex-grow">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Register and verify your Ex-Servicemen status</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Create detailed listings for your products or services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Connect with customers and grow your business</span>
                </li>
              </ul>
              <div className="text-center">
                <Button href="/esm-portal/register" variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all">
                  Register Now
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="card p-8 pt-16 flex flex-col h-full relative border-t-4 border-forest-green">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-forest-green text-pale-straw flex items-center justify-center text-2xl font-bold shadow-md">
                3
              </div>
              <h3 className="text-xl font-semibold mb-6 text-center text-deep-forest">Our Support</h3>
              <ul className="space-y-5 mb-8 flex-grow">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Dedicated support team to help with any questions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Training and resources for sellers to succeed</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-moss-green/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className="text-xs text-forest-green" 
                    />
                  </div>
                  <span className="text-gray-700">Community events and networking opportunities</span>
                </li>
              </ul>
              <div className="text-center">
                <Button href="/esm-portal/support" variant="primary" className="bg-forest-green text-pale-straw hover:bg-moss-green transition-all">
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-deep-forest py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-green/20 to-deep-forest/80 z-0"></div>
        <div className="container-custom relative z-10">
          <SectionTitle
            title="Success Stories"
            subtitle="Hear from Ex-Servicemen who have transformed their lives through our marketplace"
            className="text-pale-straw"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Testimonial 1 */}
            <div className="bg-pale-straw p-8 rounded-lg shadow-lg border border-moss-green/30 h-full flex flex-col">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-moss-green shadow-lg">
                  <img 
                    src="https://picsum.photos/id/1012/200/200" 
                    alt="Major Ravi Kumar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-deep-forest">Major Ravi Kumar (Retd.)</h4>
                  <p className="text-sm text-forest-green font-medium">Handcraft Artisan</p>
                </div>
              </div>
              <div className="flex-grow flex items-center">
                <blockquote className="italic text-gray-700 text-center relative px-6">
                  <span className="text-4xl absolute top-0 left-0 text-moss-green">"</span>
                  After 20 years in the Army, I was unsure about my second career. The ESM Marketplace helped me turn my bamboo craft hobby into a thriving business, connecting me with customers nationwide.
                  <span className="text-4xl absolute bottom-0 right-0 text-moss-green">"</span>
                </blockquote>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-pale-straw p-8 rounded-lg shadow-lg border border-moss-green/30 h-full flex flex-col">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-moss-green shadow-lg">
                  <img 
                    src="https://picsum.photos/id/1027/200/200" 
                    alt="Lt. Col. Pradeep Singh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-deep-forest">Lt. Col. Pradeep Singh (Retd.)</h4>
                  <p className="text-sm text-forest-green font-medium">Security Consultant</p>
                </div>
              </div>
              <div className="flex-grow flex items-center">
                <blockquote className="italic text-gray-700 text-center relative px-6">
                  <span className="text-4xl absolute top-0 left-0 text-moss-green">"</span>
                  The platform gave me visibility to showcase my security expertise. Within months, I secured contracts with multiple businesses and now employ five other veterans in my growing company.
                  <span className="text-4xl absolute bottom-0 right-0 text-moss-green">"</span>
                </blockquote>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-pale-straw p-8 rounded-lg shadow-lg border border-moss-green/30 h-full flex flex-col">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-moss-green shadow-lg">
                  <img 
                    src="https://picsum.photos/id/177/200/200" 
                    alt="Capt. Anita Desai"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-deep-forest">Capt. Anita Desai (Retd.)</h4>
                  <p className="text-sm text-forest-green font-medium">Organic Tea Producer</p>
                </div>
              </div>
              <div className="flex-grow flex items-center">
                <blockquote className="italic text-gray-700 text-center relative px-6">
                  <span className="text-4xl absolute top-0 left-0 text-moss-green">"</span>
                  Transitioning to agriculture was challenging, but the ESM Marketplace provided not just a platform to sell my organic teas, but also a community of fellow veterans who offered support and guidance.
                  <span className="text-4xl absolute bottom-0 right-0 text-moss-green">"</span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-forest-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-moss-green rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pale-straw rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-clash text-pale-straw">
              Join Our Community Today
            </h2>
            <p className="text-xl text-pale-straw/90 mb-10 leading-relaxed">
              Whether you're looking to support our veterans or you're an Ex-Serviceman ready to showcase your products and services, we welcome you to our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                href="/esm-portal/register"
                variant="secondary"
                className="border-2 border-pale-straw text-pale-straw hover:bg-pale-straw hover:text-deep-forest shadow-lg px-8 py-3 transition-all"
              >
                Register as ESM
              </Button>
              <Button
                href="/esm-portal/products"
                variant="primary"
                className="bg-forest-green hover:bg-forest-green/90 text-pale-straw shadow-lg px-8 py-3 transition-all"
              >
                Browse Products
              </Button>
              <Button
                href="/esm-portal/services"
                variant="primary"
                className="bg-pale-straw text-deep-forest hover:bg-pale-straw/90 shadow-lg px-8 py-3 transition-all font-medium"
              >
                Find Services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}