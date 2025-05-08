import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Timeline } from '@/lib/timelineService';
import { mapTimelineTypeToMessage } from '../utils/mapTimelineTypeToMessage';

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

const TimelineCard = ({ timeline }: TimelineCardProps) => {
  const router = useRouter();

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

export default TimelineCard; 