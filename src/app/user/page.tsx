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
import TimelineCarousel from '../components/TimelineCarousel';

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

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  const handleTimelineCreated = (newTimeline: Timeline) => {
    setTimelines([...timelines, newTimeline]);
    setShowTimelineForm(false);
  };

  const handleTimelineClick = (timelineId: string) => {
    window.location.href = `/timeline/${timelineId}`;
  };

  const createTimelineCondition = metadata && metadata?.timelineTypes.length > 0 && metadata?.timeUnits.length > 0 && user && user.id

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-24">
        <div className="max-w-7xl mx-auto px-6 mt-[26px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">My Timelines</h1>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[var(--color-primary)] rounded-full border border-[var(--color-primary-light)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{user?.credits}</span>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)]">Create and manage your learning timelines</p>
            </div>
            {createTimelineCondition && (
              <Button
                variant="primary"
                onClick={() => setShowTimelineForm(true)}
                icon={<PlusIcon className="h-5 w-5" />}
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
            <TimelineMetadataForm onTimelineCreated={handleTimelineCreated} />
          </Modal>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {timelines?.length > 0 ? (
            <TimelineCarousel timelines={timelines} title="Your Timelines" />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                No Timelines Yet
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                Start creating your first timeline to get started
              </p>
              <button
                onClick={() => router.push('/timeline/new')}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-bg-white)',
                }}
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