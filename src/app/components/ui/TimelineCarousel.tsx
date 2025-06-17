"use client";

import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Timeline } from '@/lib/timelineService';
import TimelineCard from './TimelineCard';

interface TimelineCarouselProps {
  timelines: Timeline[];
  title: string;
  className?: string;
}

export default function TimelineCarousel({ timelines, title, className = '' }: TimelineCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsPerView = 3; // Number of cards visible at once

  const scrollToNext = () => {
    if (currentIndex < timelines.length - cardsPerView) {
      setCurrentIndex(prev => prev + 1);
      scrollContainerRef.current?.scrollBy({
        left: scrollContainerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      scrollContainerRef.current?.scrollBy({
        left: -scrollContainerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!timelines.length) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text uppercase">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={scrollToNext}
            disabled={currentIndex >= timelines.length - cardsPerView}
            className="p-2 rounded-full border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {timelines.map((timeline) => (
          <div key={timeline.id} className="flex-none w-[calc(33.333%-1rem)] min-w-[300px]">
            <TimelineCard timeline={timeline} />
          </div>
        ))}
      </div>
    </div>
  );
} 