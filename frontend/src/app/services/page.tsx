import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SectionTitle from '@/components/common/SectionTitle';

// Sample services data (to be replaced with API calls in the future)
const services = [
  {
    id: 1,
    title: 'Guided Tours',
    description: 'Expert-led adventures through ancient trails and hidden gems of Northeast India. Our experienced guides share deep knowledge of local history, ecology, and culture while ensuring your safety and comfort throughout the journey.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Expert local guides with extensive regional knowledge',
      'Customizable itineraries based on preferences',
      'Small group sizes for personalized experiences',
      'Access to off-the-beaten-path locations',
      'Cultural insights and interaction opportunities'
    ],
    href: '/services/guided-tours',
  },
  {
    id: 2,
    title: 'Cultural Experiences',
    description: 'Immerse yourself in the rich cultural heritage of diverse ethnic communities. From traditional dance performances to hands-on craft workshops, these experiences provide authentic connections with local traditions.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Traditional dance and music performances',
      'Cooking classes featuring local cuisine',
      'Craft workshops with master artisans',
      'Homestays with indigenous families',
      'Participation in seasonal festivals and ceremonies'
    ],
    href: '/services/cultural-experiences',
  },
  {
    id: 3,
    title: 'Wildlife Safaris',
    description: 'Explore the diverse wildlife and natural habitats of the region with our expertly guided safaris. Northeast India is home to numerous rare and endangered species in pristine natural environments.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Jeep safaris in national parks and wildlife sanctuaries',
      'Bird watching expeditions with experienced naturalists',
      'Boat safaris through riverine habitats',
      'Conservation-focused educational components',
      'Photography guidance for wildlife enthusiasts'
    ],
    href: '/services/wildlife-safaris',
  },
  {
    id: 4,
    title: 'Adventure Activities',
    description: 'Experience thrilling adventures from trekking to river rafting and more. Our adventure activities cater to various skill levels and are led by certified professionals with safety as the top priority.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Trekking expeditions through varied terrains',
      'White water rafting on pristine rivers',
      'Rock climbing and rappelling',
      'Mountain biking through scenic routes',
      'Camping in wilderness locations'
    ],
    href: '/services/adventure-activities',
  },
  {
    id: 5,
    title: 'Spiritual Journeys',
    description: 'Discover the spiritual heritage of Northeast India through visits to ancient monasteries, temples, and sacred sites. These journeys provide opportunities for reflection, meditation, and understanding of the diverse religious practices.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Guided tours of ancient monasteries and temples',
      'Meditation sessions with spiritual practitioners',
      'Participation in traditional ceremonies',
      'Pilgrimages to sacred mountains and lakes',
      'Learning about indigenous belief systems'
    ],
    href: '/services/spiritual-journeys',
  },
  {
    id: 6,
    title: 'Culinary Tours',
    description: 'Savor the distinctive flavors of Northeast Indian cuisine with our guided culinary tours. Explore local markets, participate in cooking classes, and enjoy meals prepared with traditional ingredients and techniques.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Market tours with local food experts',
      'Hands-on cooking classes with traditional recipes',
      'Meals in authentic local settings',
      'Foraging expeditions for indigenous ingredients',
      'Food and beverage tastings (including local teas and rice wines)'
    ],
    href: '/services/culinary-tours',
  },
  {
    id: 7,
    title: 'Photography Expeditions',
    description: 'Capture the breathtaking landscapes, vibrant cultures, and unique wildlife of Northeast India with our photography-focused expeditions. Suitable for photographers of all skill levels.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Expert photography guides and instructors',
      'Access to scenic locations at optimal times',
      'Technical assistance and composition tips',
      'Post-processing workshops',
      'Small groups to ensure individual attention'
    ],
    href: '/services/photography-expeditions',
  },
  {
    id: 8,
    title: 'Wellness Retreats',
    description: 'Rejuvenate your mind, body, and spirit with our wellness retreats set in the serene natural environments of Northeast India. Combine traditional healing practices with modern wellness approaches.',
    imageSrc: '/images/hero-placeholder.jpg',
    features: [
      'Yoga and meditation sessions in natural settings',
      'Traditional herbal treatments and therapies',
      'Healthy cuisine using local organic ingredients',
      'Nature walks and forest bathing experiences',
      'Stress reduction and mindfulness practices'
    ],
    href: '/services/wellness-retreats',
  },
];

// Service categories for filtering
const categories = [
  'All Services',
  'Adventure',
  'Cultural',
  'Nature',
  'Wellness',
  'Photography',
  'Spiritual',
  'Culinary'
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-deep-forest-green pt-32 pb-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-off-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services & Experiences
            </h1>
            <p className="text-xl mb-8">
              Discover the best of Northeast India through our curated services and experiences designed to create unforgettable memories
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  index === 0
                    ? 'bg-deep-forest-green text-off-white'
                    : 'bg-light-grey text-dark-grey hover:bg-deep-forest-green hover:text-off-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="space-y-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex-row`}
              >
                {/* Image */}
                <div className="relative h-64 md:h-auto md:w-2/5">
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-8 md:w-3/5">
                  <h2 className="text-2xl font-bold text-deep-forest-green mb-3">{service.title}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <h3 className="font-semibold text-lg mb-3 text-sunrise-orange">Key Features:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-vibrant-teal mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button href={service.href} variant="primary">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Experience Section */}
      <section className="py-16 bg-light-grey">
        <div className="container-custom">
          <SectionTitle
            title="Custom Experiences"
            subtitle="Don't see exactly what you're looking for? We specialize in creating personalized experiences"
          />
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Tailored Just for You</h3>
              <p className="text-gray-600">
                We understand that every traveler is unique. Our team of experienced travel designers can create custom itineraries that perfectly match your interests, preferences, and schedule. Whether you're planning a family vacation, a solo adventure, or a group retreat, we'll craft an experience that exceeds your expectations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="text-4xl text-vibrant-teal mb-3">🧩</div>
                <h4 className="font-semibold mb-2">Personalized Itineraries</h4>
                <p className="text-sm text-gray-600">
                  Custom-designed journeys based on your specific interests and preferences
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl text-vibrant-teal mb-3">🔍</div>
                <h4 className="font-semibold mb-2">Expert Consultation</h4>
                <p className="text-sm text-gray-600">
                  One-on-one planning sessions with our experienced travel designers
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl text-vibrant-teal mb-3">🛎️</div>
                <h4 className="font-semibold mb-2">Concierge Service</h4>
                <p className="text-sm text-gray-600">
                  Dedicated support throughout your journey for a seamless experience
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                href="/contact"
                variant="primary"
                className="px-8"
              >
                Request Custom Itinerary
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-deep-forest-green text-off-white">
        <div className="container-custom">
          <SectionTitle
            title="What Our Guests Say"
            subtitle="Hear from travelers who have experienced our services"
            className="text-off-white"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center font-bold mr-3">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sanjay Kapoor</h4>
                  <p className="text-sm text-light-grey">Cultural Experience</p>
                </div>
              </div>
              <p className="italic">
                "The cultural tour exceeded all my expectations. Our guide had incredible knowledge of local traditions, and the homestay experience gave us genuine insights into the lifestyle of indigenous communities."
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center font-bold mr-3">
                  A
                </div>
                <div>
                  <h4 className="font-semibold">Anita Desai</h4>
                  <p className="text-sm text-light-grey">Wildlife Safari</p>
                </div>
              </div>
              <p className="italic">
                "The wildlife safari was the highlight of our trip. We spotted numerous rare species including the one-horned rhinoceros. The naturalist guide was incredibly knowledgeable and passionate about conservation."
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-sunrise-orange text-off-white flex items-center justify-center font-bold mr-3">
                  R
                </div>
                <div>
                  <h4 className="font-semibold">Rahul Sharma</h4>
                  <p className="text-sm text-light-grey">Adventure Activities</p>
                </div>
              </div>
              <p className="italic">
                "The trekking expedition was challenging yet incredibly rewarding. The views were spectacular, and the guides ensured everyone's safety while sharing fascinating information about the local ecosystem."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sunrise-orange text-off-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Northeast Adventure?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Start planning your unforgettable journey with BeatlenutTrails today. Our team is ready to help you create the perfect travel experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="secondary"
              className="border-2 border-off-white text-off-white hover:bg-off-white hover:text-sunrise-orange"
            >
              Contact Us
            </Button>
            <Button
              href="/"
              variant="primary"
              className="bg-deep-forest-green hover:bg-vibrant-teal"
            >
              Explore More
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}