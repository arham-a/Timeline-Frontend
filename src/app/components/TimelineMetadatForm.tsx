"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    };
    duration: number;
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
  };
}

export default function TimelineMetadataForm() {
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
      // Make the API request to create the timeline
      const response = await axios.post<TimelineResponse>('/api/timeline/create', timelineData);
  
      if (response.data.success) {
        setSuccessMessage('Timeline created successfully!');
        // You can display the created timeline data or perform additional actions here
        console.log(response.data.data);
      } else {
        setError(response.data.message || 'Failed to create timeline');
      }
    } catch (err: any) {
      // Handle different error types based on the status and error code
      if (err.response) {
        const { status, data } = err.response;
  
        // Check for different error statuses and codes
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
            // Handle other cases or generic error
            setError(data.message || 'Server error');
            break;
        }
      } else {
        // If no response from the server, show a generic error message
        setError('Server error');
      }
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Timeline</h2>

      {error && (
        <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">{successMessage}</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium">Timeline Type</label>
        <select
          className="w-full mt-1 p-2 border rounded"
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

      {selectedType?.needsTimeUnit && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Time Unit</label>
          <select
            className="w-full mt-1 p-2 border rounded"
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
      )}

      {selectedType?.needsDuration && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Duration</label>
          <input
            type="number"
            className="w-full mt-1 p-2 border rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter timeline title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="w-full mt-1 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter timeline description"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public Timeline
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={enableScheduling}
            onChange={(e) => setEnableScheduling(e.target.checked)}
          />
          Enable Scheduling
        </label>
      </div>

      <button
        className="w-full mt-4 bg-blue-600 text-white p-2 rounded"
        onClick={handleCreateTimeline}
      >
        Create Timeline
      </button>
    </div>
  );
}
