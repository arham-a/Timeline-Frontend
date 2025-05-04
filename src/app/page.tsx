"use client"
import { useState } from "react";
import TimelineMetadataForm from "./components/TimelineMetadatForm";
import Modal from "./components/Modal";
import { PlusIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, ClockIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';
import Navbar from "./components/Navbar";

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

// Dummy data for timelines
const dummyTimelines: Timeline[] = [
  {
    id: "1",
    title: "Web Development Bootcamp",
    description: "A comprehensive course covering HTML, CSS, JavaScript, and modern frameworks",
    type: { id: "1", type: "Course" },
    timeUnit: { id: "1", code: "weeks" },
    duration: 12,
    createdAt: "2024-03-15",
    segments: 3
  },
  {
    id: "2",
    title: "Data Science Fundamentals",
    description: "Learn Python, statistics, and machine learning basics",
    type: { id: "1", type: "Course" },
    timeUnit: { id: "1", code: "weeks" },
    duration: 8,
    createdAt: "2024-03-10",
    segments: 2
  },
  {
    id: "3",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native",
    type: { id: "1", type: "Course" },
    timeUnit: { id: "1", code: "weeks" },
    duration: 10,
    createdAt: "2024-03-05",
    segments: 4
  }
];

export default function Home() {
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [timelines, setTimelines] = useState<Timeline[]>(dummyTimelines);

  const handleTimelineCreated = (newTimeline: Timeline) => {
    const timelineWithSegments: Timeline = {
      ...newTimeline,
      segments: 0, // Initialize with 0 segments
      createdAt: new Date().toISOString()
    };
    setTimelines([...timelines, timelineWithSegments]);
    setShowTimelineForm(false);
  };

  const handleTimelineClick = (timelineId: string) => {
    window.location.href = `/timeline/${timelineId}`;
  };

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
                          <UserGroupIcon className="h-4 w-4" /> Segments
                        </span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">{timeline.segments}</span>
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
