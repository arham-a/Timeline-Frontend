"use client"
import { useState } from 'react';
import axios from 'axios';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface SegmentFormProps {
  timelineId: string;
  onSegmentCreated: () => void;
}

interface SegmentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    references: string[];
    timelineId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function SegmentForm({ timelineId, onSegmentCreated }: SegmentFormProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleCreateSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    const referencesArray = references.split(',').map(ref => ref.trim()).filter(ref => ref);

    try {
      const response = await axios.post<SegmentResponse>('/api/segment/create', {
        timelineId,
        title,
        description,
        startDate,
        endDate,
        references: referencesArray,
      });

      if (response.data.success) {
        setSuccessMessage('Segment created successfully!');
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setReferences('');
        onSegmentCreated();
      } else {
        setError(response.data.message || 'Failed to create segment');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error');
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

      <form className="space-y-4" onSubmit={handleCreateSegment}>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter segment title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Description</label>
          <textarea
            className="w-full mt-1 p-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter segment description"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Start Date</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <CalendarIcon className="h-5 w-5 text-[var(--color-primary)]" />
              </span>
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">End Date</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                <CalendarIcon className="h-5 w-5 text-[var(--color-primary)]" />
              </span>
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">References (comma-separated)</label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <ClockIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="Enter references separated by commas"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Create Segment
        </button>
      </form>
    </div>
  );
}
