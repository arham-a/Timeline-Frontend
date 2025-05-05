'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { timelineService } from '../../../lib/timelineService';
import { segmentService } from '../../../lib/segmentService';
import Link from 'next/link';
import { Timeline } from '../../../lib/timelineService';
import { useAuth } from '@/contexts/AuthContext';
import { Segment } from '../../../lib/segmentService';
import { mapTimelineTypeToMessage } from '@/app/utils/mapTimelineTypeToMessage';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TimelineDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!params.id) return;

      try {
        const [timelineData, segmentsData] = await Promise.all([
          timelineService.getTimelineById(params.id),
          segmentService.getTimelineSegments(params.id),
        ]);

        console.log(segmentsData);

        if (mounted) {
          setTimeline(timelineData);
          if (segmentsData) {
            setSegments(segmentsData);
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load timeline data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this timeline?')) {
      try {
        await timelineService.deleteTimeline(params.id);
        router.push('/dashboard');
      } catch (err) {
        setError('Failed to delete timeline');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const RenderCreateButton = () => {
    if (timeline?.author?.id === user?.id) {
      return (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No segments</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new segment.
          </p>
        </div>
      )

    }
  }

  if (!timeline) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Timeline not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{timeline.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{timeline.description}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/timelines/${params.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Timeline
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete Timeline
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Timeline Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {timeline.type?.type}
                  </dd>
                </div>
             {   timeline?.duration && <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Time Unit</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {mapTimelineTypeToMessage(timeline.timeUnit?.code || '', timeline.duration > 1)}
                  </dd>
                </div>}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created: </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(timeline.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(timeline.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Segments</h2>
              <Link
                href={`/timelines/${params.id}/segments/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Segment
              </Link>
            </div>

            {segments.length === 0 ? (
              <RenderCreateButton />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {segment.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {segment.goals.map((goal) => (
                          <p key={goal.id}>{goal.goal}</p>
                        ))}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {segment.references?.map((reference) => (
                          <p key={reference.id}>{reference.reference}</p>
                        ))}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span>•</span>
                        <span className="ml-2">
                          {new Date(segment.createdAt).toLocaleDateString()} -{' '}
                          {new Date(segment.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/timelines/${params.id}/segments/${segment.id}/edit`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 