'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { timelineService } from '../../lib/timelineService';
import Link from 'next/link';

interface Timeline {
  id: string;
  title: string;
  description: string;
  type: string;
  timeUnit: string;
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        const data = await timelineService.getTimelines();
        setTimelines(data);
      } catch (err) {
        setError('Failed to load timelines');
      } finally {
        setLoading(false);
      }
    };

    fetchTimelines();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Timeline App</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.name}</span>
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Timelines</h2>
            <Link
              href="/timelines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Timeline
            </Link>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {timelines.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No timelines</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new timeline.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {timelines.map((timeline) => (
                <Link
                  key={timeline.id}
                  href={`/timelines/${timeline.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{timeline.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{timeline.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="mr-2">{timeline.type}</span>
                      <span>•</span>
                      <span className="ml-2">{timeline.timeUnit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 