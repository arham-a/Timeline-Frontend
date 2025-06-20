import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { HoverBorderGradient } from './hover-border-gradient';
import { BackgroundLines } from './background-lines';
import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { mapTimelineTypeToMessage } from '@/app/utils/mapTimelineTypeToMessage';
import React, { Dispatch, SetStateAction } from 'react';
import { Timeline } from '@/lib/timelineService';
import type { User } from '@/contexts/AuthContext';

interface TimelineInfoCardProps {
  timeline: Timeline;
  user: User | null;
  setIsForkModalOpen: Dispatch<SetStateAction<boolean>>;
  isForkModalOpen: boolean;
  handleFork: () => Promise<void>;
  forkError: string | null;
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

export default function TimelineInfoCard(props: TimelineInfoCardProps) {
  const { timeline, user, setIsForkModalOpen, isForkModalOpen, handleFork, forkError } = props;

  return (
    <HoverBorderGradient containerClassName="rounded-3xl w-full" as="div" className="w-full">
      <BackgroundLines className="rounded-3xl bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 p-0 overflow-hidden">
        <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 py-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent leading-tight tracking-tight text-center mb-4">
            {timeline.title}
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-gray-200 max-w-2xl font-light mt-2 text-center mb-4">
            {timeline.description}
          </p>
          {timeline.isForked && timeline.forkDetails && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] mb-2">
              <span>Forked from timeline</span>
              <Link href={`/timeline/${timeline.forkDetails.originalTimelineId}`} className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:underline">
                {timeline.forkDetails.originalTimelineId}
              </Link>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-cyan-400 text-neutral-900/80 shadow-lg">
              {getTypeIcon(timeline.type.type)}
              {timeline.type.type}
            </span>
            {user && user.id !== timeline.author.id && timeline.isPublic && (
              <button
                onClick={() => setIsForkModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-colors w-full sm:w-auto justify-center font-semibold shadow-md"
              >
                Fork Timeline
              </button>
            )}
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 w-full">
            {timeline.duration ? (
              <div className="bg-white/10 rounded-lg px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-200">Duration</span>
                </div>
                <p className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                  {timeline.duration} {mapTimelineTypeToMessage(timeline.timeUnit?.code || '', timeline.duration > 1)}
                </p>
              </div>
            ) : null}
            <div className="bg-white/10 rounded-lg px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <UserGroupIcon className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-200">Visibility</span>
              </div>
              <p className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {timeline.isPublic ? 'Public' : 'Private'}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-200">Author</span>
              </div>
              <p className="text-base xs:text-lg sm:text-xl font-semibold text-white">
                {timeline?.author?.username}
              </p>
            </div>
          </div>
          {/* Footer Section */}
          <div className="border-t border-white/20 pt-4 mt-8 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-400 gap-2">
              <div className="space-y-1">
                <p>Created: {format(new Date(timeline.createdAt), 'MMM dd, yyyy')}</p>
                <p>Last Updated: {format(new Date(timeline.updatedAt), 'MMM dd, yyyy')}</p>
              </div>
              <div className="text-left sm:text-right space-y-1">
                <p>Version: {timeline.version}</p>
                {timeline.isForked ? (
                  <div className="flex items-center gap-1 text-gray-300">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Forked Timeline</span>
                  </div>
                ) : (
                  <p>Original Timeline</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </BackgroundLines>
      {/* Fork Modal */}
      <Dialog open={isForkModalOpen} onClose={() => setIsForkModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-2xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-[var(--color-text-primary)]">
              Fork Timeline
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Are you sure you want to fork this timeline? You'll be able to modify your copy while keeping the original intact.
            </Dialog.Description>
            {forkError && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {forkError}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-purple-50)] transition-colors"
                onClick={() => setIsForkModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                onClick={handleFork}
              >
                Fork
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </HoverBorderGradient>
  );
} 