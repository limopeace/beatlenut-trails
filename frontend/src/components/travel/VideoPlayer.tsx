'use client';

import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface VideoPlayerProps {
  src: string;
  posterImage?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  title?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  posterImage,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  title = "",
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  // Control video playback based on visibility
  useEffect(() => {
    if (!videoRef.current) return;

    if (inView && autoplay) {
      videoRef.current.play().catch((error) => {
        console.error('Video autoplay failed:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [inView, autoplay]);

  // Handle video errors
  const handleVideoError = () => {
    console.error('Video playback error occurred');
  };

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="w-full aspect-w-16 aspect-h-9">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay={autoplay && inView}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          poster={posterImage}
          onError={handleVideoError}
          title={title}
        >
          <source src={src} type="video/mp4" />
          <p>Your browser does not support HTML5 video.</p>
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;