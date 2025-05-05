'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { timelineService, Timeline } from '@/lib/timelineService';
import { TimelineMetadata } from '@/lib/timelineService';
import { CreateTimelineDto } from '@/lib/timelineService';
import Navbar from '@/app/components/Navbar';

interface TimelineFormData extends CreateTimelineDto {}

export default function NewTimelinePage() {
  const router = useRouter();
  const [metadata, setMetadata] = useState<TimelineMetadata | null>(null);
  const [formData, setFormData] = useState<TimelineFormData>({
    title: '',
    description: '',
    typeId: '',
    timeUnitId: '',
    isPublic: false,
    enableScheduling: false,
    duration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await timelineService.getMetadata();
        console.log(data);
        setMetadata(data);
        // Set default values if metadata is available
        if (data?.timelineTypes?.length > 0 && data?.timeUnits?.length > 0) {
          setFormData(prev => ({
            ...prev,
            typeId: data.timelineTypes[0].id,
            timeUnitId: data.timeUnits[0].id,
          }));
        }
      } catch (err) {
        setError('Failed to load timeline metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await timelineService.createTimeline(formData);
      router.push('/user');
    } catch (err) {
      setError('Failed to create timeline');
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

  if (loading || !metadata) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Timeline
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Fill in the details to create a new timeline.</p>
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
                    <label htmlFor="typeId" className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      name="typeId"
                      id="typeId"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={formData.typeId}
                      onChange={handleChange}
                    >
                      <option value="">Select a type</option>
                      {metadata?.timelineTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timeUnitId" className="block text-sm font-medium text-gray-700">
                      Time Unit
                    </label>
                    <select
                      name="timeUnitId"
                      id="timeUnitId"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={formData.timeUnitId}
                      onChange={handleChange}
                    >
                      <option value="">Select a time unit</option>
                      {metadata.timeUnits.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/user')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Timeline'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 