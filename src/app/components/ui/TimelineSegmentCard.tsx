import Link from 'next/link';
import React from 'react';
import type { User } from '@/contexts/AuthContext';
import type { Timeline } from '@/lib/timelineService';
import type { Segment } from '@/lib/segmentService';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { segmentService } from '@/lib/segmentService';

interface TimelineSegmentCardProps {
  segment: Segment;
  timeline: Timeline;
  user: User | null;
  params: any;
  index: number;
  isDesktop: boolean;
  onSegmentUpdate?: (updatedSegment: Segment) => void;
}

export default function TimelineSegmentCard(props: TimelineSegmentCardProps) {
  const { segment, timeline, user, params, index, isDesktop, onSegmentUpdate } = props;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: segment.title,
    milestone: segment.milestone || '',
    goals: segment.goals.map((g: any) => g.goal),
    references: segment.references.map((r: any) => r.reference),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (idx: number, value: string) => {
    const newGoals = [...editData.goals];
    newGoals[idx] = value;
    setEditData((prev) => ({ ...prev, goals: newGoals }));
  };
  const handleReferenceChange = (idx: number, value: string) => {
    const newRefs = [...editData.references];
    newRefs[idx] = value;
    setEditData((prev) => ({ ...prev, references: newRefs }));
  };
  const addGoal = () => setEditData((prev) => ({ ...prev, goals: [...prev.goals, ''] }));
  const removeGoal = (idx: number) => setEditData((prev) => ({ ...prev, goals: prev.goals.filter((_, i) => i !== idx) }));
  const addReference = () => setEditData((prev) => ({ ...prev, references: [...prev.references, ''] }));
  const removeReference = (idx: number) => setEditData((prev) => ({ ...prev, references: prev.references.filter((_, i) => i !== idx) }));

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await segmentService.updateSegment(segment.id, {
        title: editData.title,
        description: segment.description,
        milestone: editData.milestone,
        goals: editData.goals,
        references: editData.references,
      });
      // Instead of fetching from backend, update the UI with local changes
      const locallyUpdatedSegment = {
        ...segment,
        title: editData.title,
        milestone: editData.milestone,
        goals: editData.goals.map((goal, i) => ({ id: segment.goals[i]?.id || Math.random().toString(), goal })),
        references: editData.references.map((reference, i) => ({ id: segment.references[i]?.id || Math.random().toString(), reference })),
        updatedAt: new Date(),
      };
      setIsEditOpen(false);
      if (onSegmentUpdate) onSegmentUpdate(locallyUpdatedSegment);
    } catch (err: any) {
      setError(err.message || 'Failed to update segment');
    } finally {
      setSaving(false);
    }
  };

  // Desktop and mobile rendering logic
  const card = (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-purple-950 border border-cyan-900/40 shadow-lg hover:ring-1 hover:ring-cyan-700/30 transition-all duration-200 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{segment.title}</h3>
          <p className="text-sm text-cyan-200">Unit {segment.unitNumber}</p>
        </div>
        {timeline.author.id === user?.id && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-900/20 rounded-lg transition-colors"
            title="Edit Segment"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
      {/* Goals Section */}
      {segment.goals && segment.goals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-2">Goals</h4>
          <ul className="space-y-2">
            {segment.goals.map((goal: any) => (
              <li key={goal.id} className="flex items-start gap-2">
                <svg className="h-5 w-5 text-[#007bff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[#b2eaf2]">{goal.goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Milestone Section */}
      {segment.milestone && (
        <div className="mb-4 bg-[var(--color-primary-light)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-[#007bff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <h4 className="text-sm font-bold text-white">Milestone</h4>
          </div>
          <p className="text-sm text-[#b2eaf2]">{segment.milestone}</p>
        </div>
      )}
      {/* References Section */}
      {segment.references && segment.references.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-white mb-2">References</h4>
          <ul className="space-y-2">
            {segment.references.map((ref: any) => (
              <li key={ref.id} className="flex items-start gap-2">
                <svg className="h-5 w-5 text-[#007bff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {/https?:\/\//.test(ref.reference) ? (
                  <a
                    href={ref.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={ref.reference}
                    className="text-sm text-[#b2eaf2] break-words truncate max-w-xs hover:underline hover:text-cyan-300 transition-colors"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {ref.reference}
                  </a>
                ) : (
                  <span
                    className="text-sm text-[#b2eaf2] break-words truncate max-w-xs"
                    title={ref.reference}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {ref.reference}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
          <span>Created: {new Date(segment.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(segment.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isDesktop ? (
        <div className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Timeline node */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[var(--color-primary)] bg-white z-10" />
          <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>{card}</div>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline node and line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary-light)] to-[var(--color-primary)]" />
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-[var(--color-primary)] bg-white z-10" />
          <div className="ml-12">{card}</div>
        </div>
      )}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-purple-950/90 border border-cyan-900/40 shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              Edit Segment
            </Dialog.Title>
            {error && <div className="bg-red-900/20 text-red-400 p-3 rounded-xl mb-4 border border-red-500/30">{error}</div>}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={e => handleEditChange('title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Milestone (optional)</label>
                <input
                  type="text"
                  value={editData.milestone}
                  onChange={e => handleEditChange('milestone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-200">Goals</label>
                  <button type="button" onClick={addGoal} className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-900/20 rounded-full transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                </div>
                {editData.goals.map((goal, idx) => (
                  <div key={idx} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={e => handleGoalChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                      placeholder="Enter goal"
                      required
                    />
                    {editData.goals.length > 1 && (
                      <button type="button" onClick={() => removeGoal(idx)} className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-200">References (optional)</label>
                  <button type="button" onClick={addReference} className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-900/20 rounded-full transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                </div>
                {editData.references.map((ref, idx) => (
                  <div key={idx} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={ref}
                      onChange={e => handleReferenceChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                      placeholder="Enter reference"
                    />
                    {editData.references.length > 1 && (
                      <button type="button" onClick={() => removeReference(idx)} className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-xl border border-cyan-900/40 bg-black/40 text-gray-200 font-semibold hover:bg-cyan-900/20 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 