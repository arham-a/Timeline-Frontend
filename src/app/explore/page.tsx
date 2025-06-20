'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { ClockIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimelineCarousel from '../components/ui/TimelineCarousel';
import { Spotlight } from '../components/ui/spotlight-new';
import { motion } from 'framer-motion';

import { mapTimelineTypeToMessage } from '../utils/mapTimelineTypeToMessage';
import { timelineService, Timeline } from '@/lib/timelineService';
import LoadingSpinner from '../components/LoadingSpinner';

interface TimelineSection {
  timelines: Timeline[];
  total: number;
  page: number;
  limit: number;
}

interface ExploreResponse {
  success: boolean;
  message: string;
  data: {
    ROADMAP: TimelineSection;
    CHRONICLE: TimelineSection;
  };
}

const getTypeIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'ROADMAP':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case 'CHRONICLE':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

const getTypeColor = (type: string): { bg: string; text: string; border: string; shadow: string } => {
  switch (type.toUpperCase()) {
    case 'ROADMAP':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        shadow: 'shadow-blue-100'
      };
    case 'CHRONICLE':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        shadow: 'shadow-rose-100'
      };
    default:
      return {
        bg: 'bg-[var(--color-primary-light)]',
        text: 'text-[var(--color-primary)]',
        border: 'border-[var(--color-primary-light)]',
        shadow: 'shadow-[var(--color-primary-light)]'
      };
  }
};

const TimelineCard = ({ timeline }: { timeline: Timeline }) => {
  const router = useRouter();
  const typeColors = getTypeColor(timeline.type.type);

  const handleTimelineClick = (timelineId: string) => {
    router.push(`/timeline/${timelineId}`);
  };

  return (
    <div
      className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden h-[350px] border bg-[linear-gradient(to_bottom_right,white,var(--color-bg-purple-100))] hover:bg-[linear-gradient(to_top_left,white,var(--color-bg-purple-100))]"
      style={{
        borderColor: 'var(--color-bg-purple-100)',
      }}
      onClick={() => handleTimelineClick(timeline.id)}
    >
      <div className="p-6 pb-3 flex-grow overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-bg-white)',
                }}
              >
                {getTypeIcon(timeline.type.type)}
                {timeline.type.type}
              </div>
              <h3 className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-[var(--color-primary)] text-[var(--color-text-primary)]">
                {timeline.title}
              </h3>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed line-clamp-2 text-[var(--color-text-secondary)]">
            {timeline.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div
            className="rounded-lg px-4 py-3 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg-purple-50)' }}
          >
            <span className="flex items-center gap-1 text-xs mb-1 text-[var(--color-text-secondary)]">
              <UserGroupIcon className="h-4 w-4" /> Status
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              {timeline.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
          <div
            className="rounded-lg px-4 py-3 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'var(--color-bg-purple-50)' }}
          >
            {timeline.duration ? (
              <>
                <span className="flex items-center gap-1 text-xs mb-1 text-[var(--color-text-secondary)]">
                  <ClockIcon className="h-4 w-4" /> Duration
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {timeline.duration} {mapTimelineTypeToMessage(timeline.timeUnit?.code || '', timeline.duration > 1)}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 text-xs mb-1 text-[var(--color-text-secondary)]">
                  <ClockIcon className="h-4 w-4" /> Duration
                </span>
                <span className="text-sm font-medium text-[var(--color-text-tertiary)] italic">
                  No duration set
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="rounded-b-2xl px-6 py-3 flex items-center justify-between border-t"
        style={{
          backgroundColor: 'var(--color-bg-purple-50)',
          borderColor: 'var(--color-bg-purple-100)',
        }}
      >
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {format(new Date(timeline.createdAt), 'MMM dd, yyyy')}
        </span>
        <Link
          href="#"
          className="group relative inline-flex items-center gap-1 text-sm font-semibold leading-6 text-[var(--color-text-primary)] cursor-pointer"
        >
          <span className="relative group-hover:font-bold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--color-text-primary)] after:transition-all after:duration-300 group-hover:after:w-full">
            View Details
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>


      </div>
    </div>
  );


};

const TimelineSlider = ({ title, timelines }: { title: string; timelines: Timeline[] }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {timelines.map((timeline) => (
          <TimelineCard key={timeline.id} timeline={timeline} />
        ))}
      </div>
    </div>
  );
};

const SearchResults = ({ timelines }: { timelines: Timeline[] }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {timelines.map((timeline) => (
          <TimelineCard key={timeline.id} timeline={timeline} />
        ))}
      </div>
    </div>
  );
};

export default function Explore() {
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [searchResults, setSearchResults] = useState<Timeline[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await timelineService.getExploreData();
        setData(result);
      } catch (err) {
        console.error('Error fetching explore data:', err);
        setError('Failed to load explore data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await timelineService.searchTimelines(searchQuery);
      setSearchResults(result.data.timelines);
    } catch (error) {
      console.error('Error searching timelines:', error);
      setSearchResults(null);
      setError('Failed to search timelines');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black/[0.96] pt-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black/[0.96] pt-16 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Navbar />
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 100%, 85%, .08) 0, hsla(270, 100%, 55%, .02) 50%, hsla(270, 100%, 45%, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .06) 0, hsla(270, 100%, 55%, .02) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .04) 0, hsla(270, 100%, 45%, .02) 80%, transparent 100%)"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-16 md:pt-0 mt-20">
              <div className="mt-16 sm:mt-24 md:mt-32 lg:mt-40 xl:mt-48 mb-6 md:mb-10">
                <Spotlight
                  gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270, 100%, 85%, .08) 0, hsla(270, 100%, 55%, .02) 50%, hsla(270, 100%, 45%, 0) 80%)"
                  gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .06) 0, hsla(270, 100%, 55%, .02) 80%, transparent 100%)"
                  gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(270, 100%, 85%, .04) 0, hsla(270, 100%, 45%, .02) 80%, transparent 100%)"
                />
                <motion.h1
                  initial={{ opacity: 0.5, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center bg-clip-text text-transparent bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 leading-tight md:leading-tight"
                >
                  EXPLORE TIMELINES
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0.5, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  className="mt-3 sm:mt-4 font-normal text-sm xs:text-base md:text-lg text-neutral-300 max-w-xs xs:max-w-md md:max-w-lg text-center mx-auto"
                >
                  Discover and explore timelines created by the community
                </motion.p>
              </div>
            </div>
          </div>

          <div className="py-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search timelines..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-purple-500/20 bg-black/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <MagnifyingGlassIcon
                  className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400"
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            </form>

            {searchResults ? (
              <TimelineCarousel timelines={searchResults} title="Search Results" />
            ) : (
              data && (
                <>
                  {data.data.ROADMAP.timelines.length > 0 && (
                    <TimelineCarousel timelines={data.data.ROADMAP.timelines} title="Roadmaps" className="mb-12" />
                  )}
                  {data.data.CHRONICLE.timelines.length > 0 && (
                    <TimelineCarousel timelines={data.data.CHRONICLE.timelines} title="Chronicles" className="mb-12" />
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
