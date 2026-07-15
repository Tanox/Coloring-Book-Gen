// File: /app/components/PageSkeleton.tsx v1.2.0
'use client';

import React from 'react';

interface PageSkeletonProps {
  count?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded-md w-40 animate-pulse" />
            <div className="h-4 bg-muted rounded-md w-28 animate-pulse" />
          </div>
          <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-card p-4 rounded-xl border border-border"
          >
            <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-muted rounded w-16 animate-pulse" />
              <div className="h-3 bg-muted rounded w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="size-6 bg-muted rounded-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-12 animate-pulse" />
              </div>
              <div className="h-8 w-14 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;