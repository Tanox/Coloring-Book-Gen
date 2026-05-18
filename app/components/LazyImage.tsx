// app/components/LazyImage.tsx v1.1.3
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
    <div ref={imgRef} className="relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br from-slate-100 via-orange-50 to-slate-100 animate-pulse-soft ${fill ? '' : 'w-full h-full'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={`${className} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} transition-all duration-700 ease-out`}
          referrerPolicy={referrerPolicy}
          onLoad={handleLoad}
          onError={handleError}
          priority={false}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-slate-500 text-sm font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;