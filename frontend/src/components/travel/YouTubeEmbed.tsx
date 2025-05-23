'use client';

import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  showInfo?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title = "",
  autoplay = true,
  loop = true,
  showControls = false,
  showInfo = false
}) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3
  });

  // Build the YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=1&loop=${loop ? 1 : 0}&controls=${showControls ? 1 : 0}&showinfo=${showInfo ? 1 : 0}&rel=0&modestbranding=1&playlist=${videoId}`;

  return (
    <section ref={ref} className="w-full bg-[#F8F6F2] relative">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="aspect-w-16 aspect-h-9">
          {inView && (
            <iframe
              src={embedUrl}
              title={title || "YouTube video player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
};

export default YouTubeEmbed;