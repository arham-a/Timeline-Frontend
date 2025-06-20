"use client"
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { ClockIcon, CalendarIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Define types for the metadata structure
interface TimelineType {
  id: string;
  type: string;
  needsTimeUnit: boolean;
  needsDuration: boolean;
  supportsScheduling: boolean;
}

interface TimeUnit {
  id: string;
  code: string;
}

interface MetadataResponse {
  success: boolean;
  message: string;
  data: {
    timelineTypes: TimelineType[];
    timeUnits: TimeUnit[];
  };
}

interface CreateTimelineRequest {
  typeId: string;
  timeUnitId: string | undefined;
  duration: number | undefined;
  title: string;
  description: string;
  isPublic: boolean;
  enableScheduling: boolean;
}

interface TimelineResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    type: {
      id: string;
      type: string;
    };
    timeUnit: {
      id: string;
      code: string;
    } | null;
    duration: number | null;
    title: string;
    description: string;
    isGenerated: boolean;
    isPublic: boolean;
    enableScheduling: boolean;
    version: string;
    author: {
      id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
    isForked: boolean;
    segments: number;
  };
}

interface TimelineMetadataFormProps {
  onTimelineCreated: (timeline: TimelineResponse['data']) => void;
}

export default function TimelineMetadataForm({ onTimelineCreated }: TimelineMetadataFormProps) {
  const [metadata, setMetadata] = useState<MetadataResponse['data'] | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [selectedTimeUnitId, setSelectedTimeUnitId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [enableScheduling, setEnableScheduling] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const selectedType = metadata?.timelineTypes.find(type => type.id === selectedTypeId);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get<MetadataResponse>('/timeline/metadata');
        if (res.data.success) {
          setMetadata(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch metadata');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Server error');
      }
    };

    fetchMetadata();
  }, []);

  const handleCreateTimeline = async () => {
    const timelineData: CreateTimelineRequest = {
      typeId: selectedTypeId,
      timeUnitId: selectedTimeUnitId || undefined,
      duration: duration ? parseInt(duration) : undefined,
      title,
      description,
      isPublic,
      enableScheduling,
    };
  
    try {
      const response = await api.post<TimelineResponse>('/timeline/', timelineData);
  
      if (response.data.success) {
        setSuccessMessage('Timeline created successfully!');
        onTimelineCreated(response.data.data);
      } else {
        setError(response.data.message || 'Failed to create timeline');
      }
    } catch (err: any) {
      if (err.response) {
        const { data } = err.response;
  
        switch (data.error?.code) {
          case 'VALIDATION_ERROR':
            setError('Input validation failed');
            break;
          case 'UNAUTHORIZED_ERROR':
            setError('Missing / Invalid Token');
            break;
          case 'EXPIRED_TOKEN':
            setError('Token is expired');
            break;
          case 'NOT_FOUND':
            setError('Could Not Find User with given details');
            break;
          case 'FORBIDDEN_ERROR':
            setError('Timeline is Private (cannot be accessed by others)');
            break;
          case 'CONFLICT_ERROR':
            setError('Fork already exists');
            break;
          default:
            setError(data.message || 'Server error');
            break;
        }
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-200 bg-red-900/20 border border-red-500/30 rounded-lg">{error}</div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-200 bg-green-900/20 border border-green-500/30 rounded-lg">{successMessage}</div>
      )}

      <form className="space-y-6 text-white" onSubmit={(e) => { e.preventDefault(); handleCreateTimeline(); }}>
        <div>
          <label className="block text-sm font-medium text-white">Timeline Type</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300">
              <ClockIcon className="h-5 w-5" />
            </span>
            <select
              className="w-full pl-10 pr-3 py-2 border border-cyan-900/40 rounded-lg bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur"
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
            >
              <option value="" className="bg-black/80 text-gray-300">Select type</option>
              {metadata?.timelineTypes.map((type) => (
                <option key={type.id} value={type.id} className="bg-black/80 text-white">{type.type}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedType?.needsTimeUnit && (
          <div>
            <label className="block text-sm font-medium text-white">Time Unit</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <select
                className="w-full pl-10 pr-3 py-2 border border-cyan-900/40 rounded-lg bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur"
                value={selectedTimeUnitId || ''}
                onChange={(e) => setSelectedTimeUnitId(e.target.value || null)}
              >
                <option value="" className="bg-black/80 text-gray-300">Select unit</option>
                {metadata?.timeUnits.map((unit) => (
                  <option key={unit.id} value={unit.id} className="bg-black/80 text-white">{unit.code}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedType?.needsDuration && (
          <div>
            <label className="block text-sm font-medium text-white">Duration</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300">
                <ClockIcon className="h-5 w-5" />
              </span>
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 border border-cyan-900/40 rounded-lg bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white">Title</label>
          <input
            type="text"
            className="w-full mt-1 px-4 py-2 border border-cyan-900/40 rounded-lg bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter timeline title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Description</label>
          <textarea
            className="w-full mt-1 px-4 py-2 border border-cyan-900/40 rounded-lg bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter timeline description"
            rows={3}
            required
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-cyan-500 border-cyan-900/40 bg-black/40 rounded focus:ring-cyan-500"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              id="isPublic"
            />
            <label htmlFor="isPublic" className="text-sm text-white">
              <GlobeAltIcon className="h-4 w-4 inline mr-1 text-cyan-300" />
              Public Timeline
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-cyan-500 border-cyan-900/40 bg-black/40 rounded focus:ring-cyan-500"
              checked={enableScheduling}
              onChange={(e) => setEnableScheduling(e.target.checked)}
              id="enableScheduling"
            />
            <label htmlFor="enableScheduling" className="text-sm text-white">
              <LockClosedIcon className="h-4 w-4 inline mr-1 text-cyan-300" />
              Enable Scheduling
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
        >
          Create Timeline
        </button>
      </form>
    </div>
  );
}
