"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
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
  timeUnitId: string | null;
  duration: number | null;
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
        const res = await axios.get<MetadataResponse>('/api/timeline/metadata');
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
      timeUnitId: selectedTimeUnitId,
      duration: duration ? parseInt(duration) : null,
      title,
      description,
      isPublic,
      enableScheduling,
    };
  
    try {
      const response = await axios.post<TimelineResponse>('/api/timeline/create', timelineData);
  
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
        <div className="p-3 text-sm text-[var(--color-error)] bg-red-50 rounded-lg">{error}</div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-700 bg-green-50 rounded-lg">{successMessage}</div>
      )}

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateTimeline(); }}>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Timeline Type</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <ClockIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </span>
            <select
              className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
            >
              <option value="">Select type</option>
              {metadata?.timelineTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedType?.needsTimeUnit && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Time Unit</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <CalendarIcon className="h-5 w-5 text-[var(--color-primary)]" />
              </span>
              <select
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={selectedTimeUnitId || ''}
                onChange={(e) => setSelectedTimeUnitId(e.target.value || null)}
              >
                <option value="">Select unit</option>
                {metadata?.timeUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedType?.needsDuration && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Duration</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <ClockIcon className="h-5 w-5 text-[var(--color-primary)]" />
              </span>
              <input
                type="number"
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter timeline title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Description</label>
          <textarea
            className="w-full mt-1 p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
              className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              id="isPublic"
            />
            <label htmlFor="isPublic" className="text-sm text-[var(--color-text-secondary)]">
              <GlobeAltIcon className="h-4 w-4 inline mr-1" />
              Public Timeline
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-[var(--color-primary)] border-[var(--color-border)] rounded focus:ring-[var(--color-primary)]"
              checked={enableScheduling}
              onChange={(e) => setEnableScheduling(e.target.checked)}
              id="enableScheduling"
            />
            <label htmlFor="enableScheduling" className="text-sm text-[var(--color-text-secondary)]">
              <LockClosedIcon className="h-4 w-4 inline mr-1" />
              Enable Scheduling
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Create Timeline
        </button>
      </form>
    </div>
  );
}
