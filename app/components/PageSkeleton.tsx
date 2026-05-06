'use client';

import React from 'react';

interface PageSkeletonProps {
  count?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100 border-2 border-orange-50">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-lg w-32 animate-pulse" />
          </div>
          <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2.5rem] shadow-lg shadow-slate-200/50 border-2 border-slate-100"
          >
            <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-shimmer" />
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="h-4 bg-slate-100 rounded-lg w-24 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
            </div>

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-16 animate-pulse" />
              </div>
              <div className="h-10 w-16 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;