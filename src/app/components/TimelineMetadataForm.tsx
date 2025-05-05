'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { timelineService, Timeline, CreateTimelineDto } from '@/lib/timelineService';

interface TimelineMetadataFormProps {
  onTimelineCreated: (timeline: Timeline) => void;
}

export default function TimelineMetadataForm({ onTimelineCreated }: TimelineMetadataFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [formData, setFormData] = useState<CreateTimelineDto>({
    title: '',
    description: '',
    typeId: '',
    timeUnitId: '',
    isPublic: false,
    enableScheduling: false,
    duration: 0,
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await timelineService.getMetadata();
        setMetadata(data);
        if (data?.timelineTypes?.length > 0 && data?.timeUnits?.length > 0) {
          setFormData(prev => ({
            ...prev,
            typeId: data.timelineTypes[0].id,
            timeUnitId: data.timeUnits[0].id,
          }));
        }
      } catch (err) {
        setError('Failed to load form data');
      }
    };

    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newTimeline = await timelineService.createTimeline(formData);
      onTimelineCreated(newTimeline);
    } catch (err) {
      setError('Failed to create timeline');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!metadata) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            {metadata.timelineTypes.map((type: any) => (
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
            {metadata.timeUnits.map((unit: any) => (
              <option key={unit.id} value={unit.id}>
                {unit.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="duration"
            id="duration"
            min="1"
            required
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.duration}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Make timeline public
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="enableScheduling"
            id="enableScheduling"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={formData.enableScheduling}
            onChange={handleChange}
          />
          <label htmlFor="enableScheduling" className="ml-2 block text-sm text-gray-700">
            Enable scheduling
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Timeline'}
        </button>
      </div>
    </form>
  );
} 