'use client';

import { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Timeline, TimelineMetadata, timelineService } from '@/lib/timelineService';
import Navbar from '@/app/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightIcon, ClockIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import TimelineMetadataForm from '../components/TimelineMetadatForm';
import { mapTimelineTypeToMessage } from '../utils/mapTimelineTypeToMessage';
import { Button } from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import TimelineCarousel from '../components/ui/TimelineCarousel';

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
    case 'COURSE':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'PROJECT':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'STUDY_PLAN':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
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
    case 'COURSE':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        shadow: 'shadow-purple-100'
      };
    case 'PROJECT':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        shadow: 'shadow-green-100'
      };
    case 'STUDY_PLAN':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        shadow: 'shadow-indigo-100'
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

export default function UserPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<TimelineMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        setLoading(true);
        const metadataResponse = await timelineService.getMetadata();
        setMetadata(metadataResponse);
        const data = await timelineService.getUserTimelines(user?.id || '');
        setTimelines(data);
      } catch (err) {
        console.error('Error fetching timelines:', err);
        setError('Failed to load timelines');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchTimelines();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth');
    }
  }, [user, authLoading, router]);

  if (!authLoading && !user) {
    return null;
  }

  if (loading || authLoading) {
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
          <div className="text-red-400">{error}</div>
        </div>
      </>
    );
  }

  const handleTimelineCreated = (newTimeline: Timeline) => {
    if (!newTimeline.author && user) {
      newTimeline.author = { id: user.id, username: user.username };
    }
    setTimelines([...timelines, newTimeline]);
    setShowTimelineForm(false);
  };

  const handleTimelineClick = (timelineId: string) => {
    window.location.href = `/timeline/${timelineId}`;
  };

  const createTimelineCondition = metadata && metadata?.timelineTypes.length > 0 && metadata?.timeUnits.length > 0 && user && user.id

  return (
    <>
      <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  My Timelines
                </h1>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-300 rounded-lg border border-purple-500/30">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold">{user?.credits}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Create and manage your learning timelines</p>
            </div>
            {createTimelineCondition && (
              <Button
                variant="gradient"
                onClick={() => setShowTimelineForm(true)}
                icon={<PlusIcon className="h-5 w-5" />}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Create New Timeline
              </Button>
            )}
          </div>

          <Modal
            isOpen={showTimelineForm}
            onClose={() => setShowTimelineForm(false)}
            title="Create New Timeline"
          >
            <div className="text-white">
              <TimelineMetadataForm onTimelineCreated={handleTimelineCreated} />
            </div>
          </Modal>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {timelines?.length > 0 ? (
            <TimelineCarousel timelines={timelines} title="Your Timelines" />
          ) : (
            <div className="text-center py-16 sm:py-24">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
                No Timelines Yet
              </h2>
              <p className="text-gray-400 mb-8 text-sm sm:text-base">
                Start creating your first timeline to get started
              </p>
              <button
                onClick={() => setShowTimelineForm(true)}
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Create Timeline
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 