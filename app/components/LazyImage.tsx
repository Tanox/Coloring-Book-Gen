'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  referrerPolicy?: ImageProps['referrerPolicy'];
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', fill = false, referrerPolicy = 'no-referrer' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {!isLoaded && (
        <div className={`absolute inset-0 bg-slate-100 animate-pulse ${fill ? '' : 'w-full h-full'}`} />
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          referrerPolicy={referrerPolicy}
          onLoad={handleLoad}
          onError={handleError}
          priority={false}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <span className="text-slate-400 text-sm font-medium">Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;