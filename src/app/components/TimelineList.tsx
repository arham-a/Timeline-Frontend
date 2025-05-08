"use client"
import { useState } from 'react';
import SegmentForm from './Segment';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

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
  segments: number;
}

interface Segment {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  references: string[];
  timelineId: string;
}

interface TimelineListProps {
  timeline: Timeline;
}

export default function TimelineList({ timeline }: TimelineListProps) {
  const [showSegmentForm, setShowSegmentForm] = useState(false);

  const handleSegmentCreated = () => {
    // Update the segments count in the timeline
    const updatedTimeline = {
      ...timeline,
      segments: timeline.segments + 1
    };
    // You might want to update the parent component's state here
    // For now, we'll just close the form
    setShowSegmentForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-bg-purple-50)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Timelines
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">{timeline.title}</h1>
              <p className="text-[var(--color-text-secondary)] mb-4">{timeline.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-[var(--color-bg-purple-50)] text-[var(--color-primary)] rounded-full text-sm font-medium flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {timeline.type.type}
                </span>
                {timeline.timeUnit && timeline.duration !== null && (
                  <span className="px-4 py-2 bg-[var(--color-bg-purple-50)] text-[var(--color-primary)] rounded-full text-sm font-medium flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {timeline.duration} {timeline.timeUnit.code}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">{timeline.segments}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Segments</div>
              </div>
              <button
                onClick={() => setShowSegmentForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" />
                Create Segment
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Timeline Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {/* Map through segments and display them */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-40 flex items-center justify-center text-[var(--color-text-secondary)]">
                No segments yet. Create your first segment!
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSegmentForm}
        onClose={() => setShowSegmentForm(false)}
        title="Create New Segment"
      >
        <SegmentForm 
          timelineId={timeline.id} 
          onSegmentCreated={handleSegmentCreated}
        />
      </Modal>
    </div>
  );
} 