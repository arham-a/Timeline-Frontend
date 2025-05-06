'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { timelineService } from '../../../../lib/timelineService';

interface TimelineMetadata {
  types: string[];
  timeUnits: string[];
}

interface TimelineFormData {
  title: string;
  description: string;
  type: string;
  timeUnit: string;
  startDate: string;
  endDate: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditTimelinePage({ params }: PageProps) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<TimelineMetadata | null>(null);
  const [formData, setFormData] = useState<TimelineFormData>({
    title: '',
    description: '',
    type: '',
    timeUnit: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const timelineId = Array.isArray(params.id) ? params.id[0] : params.id;
  
    const fetchData = async () => {
      if (!timelineId) return;
  
      try {
        const [metadataData, timelineData] = await Promise.all([
          timelineService.getMetadata(),
          timelineService.getTimelineById(timelineId),
        ]);
  
        if (mounted) {
          setMetadata(metadataData);
          setFormData({
            title: timelineData.title,
            description: timelineData.description,
            type: timelineData.type,
            timeUnit: timelineData.timeUnit,
            startDate: timelineData.startDate,
            endDate: timelineData.endDate,
          });
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load timeline data');
        }
      }
    };
  
    fetchData();
  
    return () => {
      mounted = false;
    };
  }, [params.id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const timelineId = Array.isArray(params.id) ? params.id[0] : params.id;
  
    try {
      await timelineService.updateTimeline(timelineId, formData);
      router.push(`/timelines/${timelineId}`);
    } catch (err) {
      setError('Failed to update timeline');
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Edit Timeline
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Update the details of your timeline.</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {metadata.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeUnit" className="block text-sm font-medium text-gray-700">
                    Time Unit
                  </label>
                  <select
                    name="timeUnit"
                    id="timeUnit"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.timeUnit}
                    onChange={handleChange}
                  >
                    {metadata.timeUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      required
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push(`/timelines/${params.id}`)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 