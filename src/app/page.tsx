"use client"
import { useEffect, useState } from "react";
import TimelineMetadataForm from "./components/TimelineMetadatForm";
import Modal from "./components/Modal";
import { PlusIcon } from '@heroicons/react/24/outline';
import { ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Navbar from "./components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/axios";

interface Timeline {
  id: string;
  title: string;
  description: string;
  type: {
    id: string;
    type: string;
  };
  timeUnit: {
    id: string;
    code: string;
  } | null;
  duration: number | null;
  createdAt: string;
  isPublic: boolean;
  enableScheduling: boolean;
  version: string;
  author: {
    id: string;
  };
  isForked: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserTimelines = async () => {
      if (!user?.id) return;
      
      try {
        const response = await api.get(`/timeline/user/${user.id}`);
        setTimelines(response.data.data.timelines);
      } catch (err) {
        setError('Failed to load timelines');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTimelines();
  }, [user?.id]);

  const handleTimelineCreated = (newTimeline: Timeline) => {
    setTimelines([...timelines, newTimeline]);
    setShowTimelineForm(false);
  };

  const handleTimelineClick = (timelineId: string) => {
    window.location.href = `/timeline/${timelineId}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">My Timelines</h1>
              <p className="text-[var(--color-text-secondary)] mt-2">Create and manage your learning timelines</p>
            </div>
            <button
              onClick={() => setShowTimelineForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create New Timeline
            </button>
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

          {timelines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timelines.map((timeline) => (
                <div
                  key={timeline.id}
                  className="bg-white border border-[var(--color-primary-light)] rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer p-0 flex flex-col justify-between min-h-[320px] group"
                >
                  <div className="p-6 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{timeline.title}</h3>
                    </div>
                    <span className="inline-block px-3 py-1 mb-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs font-semibold">
                      {timeline.type.type}
                    </span>
                    <p className="text-[var(--color-text-secondary)] mb-4 text-sm leading-relaxed h-14 md:h-20 overflow-hidden text-ellipsis">
                      {timeline.description}
                    </p>
                    <div className="flex gap-4 mb-2">
                      <div className="flex-1 bg-[var(--color-bg-purple-50)] rounded-lg px-4 py-3 flex flex-col items-center min-h-[64px] justify-center">
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] mb-1">
                          <UserGroupIcon className="h-4 w-4" /> Status
                        </span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">
                          {timeline.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <div className="flex-1 bg-[var(--color-bg-purple-50)] rounded-lg px-4 py-3 flex flex-col items-center min-h-[64px] justify-center">
                        <span className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] mb-1">
                          <ClockIcon className="h-4 w-4" /> Duration
                        </span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">
                          {timeline.duration} {timeline.timeUnit?.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-purple-50)] rounded-b-2xl px-6 py-3 flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-tertiary)]">Created {format(new Date(timeline.createdAt), 'MM/dd/yyyy')}</span>
                    <button
                      onClick={() => handleTimelineClick(timeline.id)}
                      className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 group-hover:text-[var(--color-primary-dark)]"
                    >
                      View Details <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-[var(--color-shadow)]">
              <p className="text-[var(--color-text-secondary)]">No timelines created yet. Click the button above to create one!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
