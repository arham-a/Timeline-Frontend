"use client"
import { useState, useEffect } from "react";
import SegmentForm from "../../components/Segment";
import Modal from "../../components/Modal";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

// Dummy data for a specific timeline
const dummyTimeline: Timeline = {
  id: "1",
  title: "Web Development Bootcamp",
  description: "A comprehensive course covering HTML, CSS, JavaScript, and modern frameworks",
  type: { id: "1", type: "Course" },
  timeUnit: { id: "1", code: "weeks" },
  duration: 12,
  createdAt: "2024-03-15",
  segments: 3
};

export default function TimelinePage({ params }: { params: { id: string } }) {
  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  // Fetch timeline data based on params.id
  useEffect(() => {
    // Fetch timeline data here
    const dummyTimeline: Timeline = {
      id: params.id,
      title: "Sample Timeline",
      description: "This is a sample timeline description",
      type: { id: "1", type: "Course" },
      timeUnit: { id: "1", code: "weeks" },
      duration: 12,
      createdAt: "2024-03-15",
      segments: 0
    };
    setTimeline(dummyTimeline);
  }, [params.id]);

  const handleSegmentCreated = (newSegment: Segment) => {
    if (timeline) {
      // Update the segments count in the timeline
      const updatedTimeline = {
        ...timeline,
        segments: timeline.segments + 1
      };
      setTimeline(updatedTimeline);
      setShowSegmentForm(false);
    }
  };

  if (!timeline) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-purple-50)]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Timelines
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-[var(--color-shadow)] p-6 mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">{timeline.title}</h1>
          <p className="text-[var(--color-text-secondary)] mb-4">{timeline.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[var(--color-bg-purple-50)] text-[var(--color-primary)] rounded-full text-sm">
              {timeline.type.type}
            </span>
            {timeline.timeUnit && timeline.duration !== null && (
              <span className="px-3 py-1 bg-[var(--color-bg-purple-50)] text-[var(--color-primary)] rounded-full text-sm">
                {timeline.duration} {timeline.timeUnit.code}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Segments</h2>
          <button
            onClick={() => setShowSegmentForm(true)}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Create Segment
          </button>
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

        {/* Add your segments list here */}
        <div className="grid grid-cols-1 gap-4">
          {/* Map through segments and display them */}
        </div>
      </div>
    </div>
  );
} 