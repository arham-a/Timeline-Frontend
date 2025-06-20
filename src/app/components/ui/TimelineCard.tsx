"use client";

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ClockIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import { Timeline } from '@/lib/timelineService';
import { mapTimelineTypeToMessage } from '@/app/utils/mapTimelineTypeToMessage';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

interface TimelineCardProps {
  timeline: Timeline;
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

export default function TimelineCard({ timeline }: TimelineCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleTimelineClick = (timelineId: string) => {
    if (!user) {
      setShowModal(true);
    } else {
      router.push(`/timeline/${timelineId}`);
    }
  };

  return (
    <>
      <div
        onClick={() => handleTimelineClick(timeline.id)}
        className="group relative h-full cursor-pointer transition-all duration-300"
      >
        <div className="relative flex flex-col h-full p-6 bg-gradient-to-b from-purple-950/20 to-black border border-purple-500/20 rounded-2xl transition-all duration-300 group-hover:border-purple-500/40 group-hover:shadow-lg group-hover:shadow-purple-500/10">
          <div className="flex items-start justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {getTypeIcon(timeline.type.type)}
              {timeline.type.type}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-purple-400 transition-colors duration-300">
            {timeline.title}
          </h3>

          <p className="text-gray-400 text-sm mb-6 line-clamp-2">
            {timeline.description}
          </p>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center gap-2 text-sm text-purple-400 mb-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {timeline.isPublic ? 'Public' : 'Private'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-xl border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center gap-2 text-sm text-purple-400 mb-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                {timeline.duration ? (
                  <span className="text-sm font-medium text-gray-200">
                    {timeline.duration} {timeline.timeUnit?.code}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-400 italic">
                    Not set
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/20">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Created by {timeline.author?.username || 'Anonymous'}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(timeline.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-2xl bg-black/90 p-6 border border-cyan-900 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-white mb-2">Please sign in</Dialog.Title>
            <Dialog.Description className="text-gray-300 mb-6">You need to be signed in to view this timeline.</Dialog.Description>
            <button
              onClick={() => router.push('/auth')}
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold py-2 rounded-xl shadow-lg hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
            >
              Go to Sign In
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 