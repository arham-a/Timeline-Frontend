'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { timelineService, Timeline, CreateTimelineDto } from '@/lib/timelineService';
import LoadingSpinner from './LoadingSpinner';
import Dropdown from './Dropdown';

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
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-500/30">
          <div className="text-sm text-red-200">{error}</div>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            required
            className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Description
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="typeId" className="block text-sm font-medium text-white">
            Type
          </label>
          <Dropdown
            options={[{ value: '', label: 'Select a type' }, ...metadata.timelineTypes.map((t: any) => ({ value: t.id, label: t.type }))]}
            value={formData.typeId}
            onChange={(value) => setFormData(prev => ({ ...prev, typeId: value }))}
            placeholder="Select a type"
          />
        </div>

        <div>
          <label htmlFor="timeUnitId" className="block text-sm font-medium text-white">
            Time Unit
          </label>
          <Dropdown
            options={[{ value: '', label: 'Select a time unit' }, ...metadata.timeUnits.map((u: any) => ({ value: u.id, label: u.code }))]}
            value={formData.timeUnitId}
            onChange={(value) => setFormData(prev => ({ ...prev, timeUnitId: value }))}
            placeholder="Select a time unit"
          />
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-white">
          Duration
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="duration"
            id="duration"
            min="1"
            required
            className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
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
            className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-cyan-900/40 bg-black/40 rounded"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-white">
            Make timeline public
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="enableScheduling"
            id="enableScheduling"
            className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-cyan-900/40 bg-black/40 rounded"
            checked={formData.enableScheduling}
            onChange={handleChange}
          />
          <label htmlFor="enableScheduling" className="ml-2 block text-sm text-white">
            Enable scheduling
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Timeline'}
        </button>
      </div>
    </form>
  );
} 