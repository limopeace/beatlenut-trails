'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faPlay } from '@fortawesome/free-solid-svg-icons';

interface Reel {
  id: string;
  thumbnailUrl: string;
  permalink: string;
  caption: string;
}

// Mocked reels data (since we can't fetch from Instagram API directly without authentication)
const MOCK_REELS = [
  {
    id: 'reel1',
    thumbnailUrl: '/images/real/pexels-travelerchitect-18736328-min.jpg',
    permalink: 'https://www.instagram.com/p/reel1',
    caption: 'Exploring the serene mountains of Meghalaya. #NortheastIndia #Travel'
  },
  {
    id: 'reel2',
    thumbnailUrl: '/images/real/pexels-harsh-srivastava-1765262842-30264519-min.jpg',
    permalink: 'https://www.instagram.com/p/reel2',
    caption: 'Traditional boat ride through the crystal clear waters of Dawki. #MeghalayaTourism'
  },
  {
    id: 'reel3',
    thumbnailUrl: '/images/real/pexels-shubhendu-singh-1278012-2439742-min.jpg',
    permalink: 'https://www.instagram.com/p/reel3',
    caption: 'Camping under the stars in Dzükou Valley. #Nagaland #Adventure'
  },
  {
    id: 'reel4',
    thumbnailUrl: '/images/real/pexels-kanishka-211910-679492-min.jpg',
    permalink: 'https://www.instagram.com/p/reel4',
    caption: 'Tea gardens of Assam stretching as far as the eye can see. #TeaTourism'
  },
  {
    id: 'reel5',
    thumbnailUrl: '/images/real/pexels-nans1419-20519339-min.jpg',
    permalink: 'https://www.instagram.com/p/reel5',
    caption: 'The living root bridges of Nongriat. A natural wonder! #SustainableTourism'
  },
  {
    id: 'reel6',
    thumbnailUrl: '/images/real/pexels-sajal-devnath-15363403-6418951-min.jpg',
    permalink: 'https://www.instagram.com/p/reel6',
    caption: 'Morning views at Tawang Monastery. #ArunachalPradesh #Spirituality'
  }
];

const InstagramReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // In a real implementation, we would fetch from Instagram API
    // For now, we'll simulate an API call with our mock data
    const fetchReels = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would replace this with an actual API call
        // For example:
        // const response = await fetch('/api/instagram-reels');
        // const data = await response.json();
        
        setReels(MOCK_REELS);
      } catch (err) {
        console.error('Error fetching reels:', err);
        setError('Failed to load Instagram reels');
      } finally {
        setLoading(false);
      }
    };
    
    if (inView) {
      fetchReels();
    }
  }, [inView]);

  // Function to load Instagram embed script
  const loadInstagramEmbedScript = () => {
    if (typeof window !== 'undefined') {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.async = true;
        script.src = '//www.instagram.com/embed.js';
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
        document.body.appendChild(script);
      }
    }
  };

  // Load the script when component mounts
  useEffect(() => {
    loadInstagramEmbedScript();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-green-700 text-lg md:text-xl uppercase font-clash tracking-wider">Experience The Journey</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 font-clash uppercase">Our Instagram Reels</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover breathtaking moments from our travels across Northeast India. 
            Follow us <a 
              href="https://www.instagram.com/beatlenut_trails" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-700 hover:underline"
            >
              @beatlenut_trails
            </a>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin className="text-green-700 text-4xl" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
          </div>
        ) : (
          <>
            {/* Portfolio-style grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reels.map((reel) => (
                <div 
                  key={reel.id} 
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                >
                  {/* Thumbnail with overlay */}
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img 
                      src={reel.thumbnailUrl} 
                      alt={reel.caption.substring(0, 60) + '...'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a 
                        href={reel.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white transform scale-90 group-hover:scale-100 transition-all duration-300"
                        aria-label="Play Instagram Reel"
                      >
                        <FontAwesomeIcon icon={faPlay} className="text-xl" />
                      </a>
                    </div>
                    
                    {/* Instagram badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 rounded-full">
                      <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div className="p-4">
                    <p className="text-gray-800 text-sm line-clamp-2">{reel.caption}</p>
                    <a 
                      href={reel.permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-700 text-sm font-medium mt-2 inline-block hover:underline"
                    >
                      Watch on Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View all button */}
            <div className="text-center mt-12">
              <a 
                href="https://www.instagram.com/beatlenut_trails" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                Follow Us on Instagram
              </a>
            </div>
            
            {/* Note about embedding */}
            <div className="mt-16 text-center text-gray-500 text-xs">
              <p>
                Note: For real implementation, you'll need to use Instagram's Graph API or a service like EmbedSocial to fetch actual reels data.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InstagramReels;