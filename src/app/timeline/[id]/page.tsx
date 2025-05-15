"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { format } from 'date-fns';
import { ClockIcon, UserGroupIcon, PlusIcon, MinusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Timeline, timelineService } from '../../../lib/timelineService';
import { segmentService, Segment, SegmentCreateDto } from '@/lib/segmentService';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { mapTimelineTypeToMessage } from '@/app/utils/mapTimelineTypeToMessage';
import { Dialog } from '@headlessui/react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';


interface TimelineType {
  id: string;
  type: string;
}

interface TimeUnit {
  id: string;
  code: string;
}

interface Author {
  id: string;
  username: string;
}

interface PageParams {
  id: string;
}

interface GenerateSegmentForm {
  goal: string;
  domain: string;
  skillLevel: string;
  targetAudience: string;
}


export default function TimelinePage() {
  const params = useParams();
  const router = useRouter();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [segments, setSegments] = useState<Segment[] | null>(null);
  const [renderSegmentForm, setRenderSegmentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [forkError, setForkError] = useState<string | null>(null);
  const { user } = useAuth();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState<GenerateSegmentForm>({
    goal: '',
    domain: '',
    skillLevel: '',
    targetAudience: ''
  });

  const handleInputChange = (field: keyof GenerateSegmentForm, value: string) => {
    setGenerateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!params.id) return;

      try {
        const [timelineData, segmentsData] = await Promise.all([
          timelineService.getTimelineById(params.id as string),
          segmentService.getTimelineSegments(params.id as string),
        ]);
        console.log('Fetched data:', { timelineData, segmentsData });
        if (mounted) {
          setTimeline(timelineData);
          setSegments(segmentsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (mounted) {
          setError('Failed to load timeline data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  console.log("Current state:", { loading, error, timeline, segments, renderSegmentForm });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !timeline) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <div className="text-red-600">{error || 'Timeline not found'}</div>
        </div>
      </>
    );
  }

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const data = await timelineService.generateSegments(params.id as string, generateForm);
      setSegments(data);
      setShowGenerateModal(false);
      // Reset form after successful submission
      setGenerateForm({
        goal: '',
        domain: '',
        skillLevel: '',
        targetAudience: ''
      });
    } catch (error) {
      console.error('Error generating segments:', error);
      setError('Failed to generate segments');
    } finally {
      setIsGenerating(false);
    }
  };

  const RenderCreateButton = () => {
    if (timeline.author.id === user?.id) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No segments</h3>
            <div className="mt-1 text-sm text-gray-500">
              Get started by adding segments.
            </div>
            <div className="mt-4 flex flex-col items-center sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setRenderSegmentForm(true)} 
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Segments Manually
              </button>
              {timeline.type.type === 'ROADMAP' && (
                <button 
                  onClick={() => setShowGenerateModal(true)} 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[var(--color-white)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Generate with AI
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No segments available</h3>
        <p className="mt-1 text-sm text-gray-500">
          This timeline doesn't have any segments yet.
        </p>
      </div>
    );
  };

  const RenderSegmentsForm = () => {
    const maxSegments = timeline?.duration || 10;
    const [segmentForms, setSegmentForms] = useState<SegmentCreateDto[]>([
      {
        unitNumber: 1,
        title: '',
        description: '',
        goals: [''],
        references: [''],
        milestone: ''
      }
    ]);
    const [error, setError] = useState<string | null>(null);

    const addSegment = () => {
      if (segmentForms.length >= maxSegments) {
        setError(`Cannot add more than ${maxSegments} segments`);
        return;
      }
      setSegmentForms([...segmentForms, {
        unitNumber: segmentForms.length + 1,
        title: '',
        description: '',
        goals: [''],
        references: [''],
        milestone: ''
      }]);
      setError(null);
    };

    const removeSegment = (index: number) => {
      const newForms = segmentForms.filter((_, i) => i !== index);
      // Update unit numbers
      newForms.forEach((form, i) => {
        form.unitNumber = i + 1;
      });
      setSegmentForms(newForms);
      setError(null);
    };

    const updateSegment = (index: number, field: keyof SegmentCreateDto, value: any) => {
      const newForms = [...segmentForms];
      newForms[index] = { ...newForms[index], [field]: value };
      setSegmentForms(newForms);
    };

    const addGoal = (segmentIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals.push('');
      setSegmentForms(newForms);
    };

    const removeGoal = (segmentIndex: number, goalIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals = newForms[segmentIndex].goals.filter((_, i) => i !== goalIndex);
      setSegmentForms(newForms);
    };

    const updateGoal = (segmentIndex: number, goalIndex: number, value: string) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals[goalIndex] = value;
      setSegmentForms(newForms);
    };

    const addReference = (segmentIndex: number) => {
      const newForms = [...segmentForms];
      if (!newForms[segmentIndex].references) {
        newForms[segmentIndex].references = [];
      }
      newForms[segmentIndex].references!.push('');
      setSegmentForms(newForms);
    };

    const removeReference = (segmentIndex: number, refIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].references = newForms[segmentIndex].references!.filter((_, i) => i !== refIndex);
      setSegmentForms(newForms);
    };

    const updateReference = (segmentIndex: number, refIndex: number, value: string) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].references![refIndex] = value;
      setSegmentForms(newForms);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await segmentService.createSegmentsBulk({
          timelineId: params.id as string,
          segments: segmentForms
        });
        setSegments(response);
        setRenderSegmentForm(false);
      } catch (err: any) {
        setError(err.message || 'Failed to create segments');
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Create Timeline Segments</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {segmentForms.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="border border-[var(--color-primary-light)] rounded-xl p-6 space-y-6 bg-[var(--color-bg-purple-50)]">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Segment {segment.unitNumber}</h3>
                {segmentForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSegment(segmentIndex)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Title</label>
                <input
                  type="text"
                  value={segment.title}
                  onChange={(e) => updateSegment(segmentIndex, 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Description</label>
                <textarea
                  value={segment.description}
                  onChange={(e) => updateSegment(segmentIndex, 'description', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Milestone (optional)</label>
                <input
                  type="text"
                  value={segment.milestone || ''}
                  onChange={(e) => updateSegment(segmentIndex, 'milestone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">Goals</label>
                  <button
                    type="button"
                    onClick={() => addGoal(segmentIndex)}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] p-2 hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {segment.goals.map((goal, goalIndex) => (
                  <div key={goalIndex} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(segmentIndex, goalIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                      placeholder="Enter goal"
                      required
                    />
                    {segment.goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(segmentIndex, goalIndex)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">References (optional)</label>
                  <button
                    type="button"
                    onClick={() => addReference(segmentIndex)}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] p-2 hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {segment.references?.map((ref, refIndex) => (
                  <div key={refIndex} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={ref}
                      onChange={(e) => updateReference(segmentIndex, refIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                      placeholder="Enter reference"
                    />
                    <button
                      type="button"
                      onClick={() => removeReference(segmentIndex, refIndex)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-[var(--color-border)] flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={addSegment}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={segmentForms.length >= maxSegments}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Segment
            </button>
            <div className="flex flex-col items-center w-full sm:w-auto space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                onClick={() => setRenderSegmentForm(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-purple-50)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Save All Segments
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const handleFork = async () => {
    try {
      setForkError(null);
      const forkedTimeline = await timelineService.forkTimeline(params.id as string);
      router.push(`/timeline/${forkedTimeline.id}`);
    } catch (err: any) {
      setForkError(err.response?.data?.message || 'Failed to fork timeline');
    }
  };

  const getTypeColor = (type: string): { bg: string; text: string; border: string } => {
    switch (type.toUpperCase()) {
      case 'ROADMAP':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'CHRONICLE':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200'
        };
      case 'COURSE':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200'
        };
      case 'PROJECT':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200'
        };
      case 'STUDY_PLAN':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200'
        };
      default:
        return {
          bg: 'bg-[var(--color-primary-light)]',
          text: 'text-[var(--color-primary)]',
          border: 'border-[var(--color-primary-light)]'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ROADMAP':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'CHRONICLE':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'COURSE':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'PROJECT':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'STUDY_PLAN':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  const RenderTimeline = () => {
    console.log('Rendering timeline with segments:', segments);
    const typeColors = getTypeColor(timeline.type.type);
    
    return (
      <div className="bg-[var(--color-bg-purple-50)] pt-16 ">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 mt-[1rem]">
            <div className="mb-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]">{timeline.title}</h1>
                    {timeline.isForked && timeline.forkDetails && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-purple-50)] text-[var(--color-primary)] rounded-full text-sm font-medium">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Forked v{timeline.forkDetails.forkedVersion}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">{timeline.description}</p>
                  {timeline.isForked && timeline.forkDetails && (
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                      <span>Forked from timeline</span>
                      <Link 
                        href={`/timeline/${timeline.forkDetails.originalTimelineId}`}
                        className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:underline"
                      >
                        {timeline.forkDetails.originalTimelineId}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-bg-white)',
                    }}>
                    {getTypeIcon(timeline.type.type)}
                    {timeline.type.type}
                  </span>
                  {user && user.id !== timeline.author.id && timeline.isPublic && (
                    <button
                      onClick={() => setIsForkModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors w-full sm:w-auto justify-center"
                    >
                      Fork Timeline
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              {timeline.duration ? (
                <div className="bg-[var(--color-bg-purple-50)] rounded-lg px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="h-5 w-5 text-[var(--color-primary)]" />
                    <span className="text-[var(--color-text-secondary)]">Duration</span>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-[var(--color-text-primary)]">
                    {timeline.duration} {mapTimelineTypeToMessage(timeline.timeUnit?.code || '', timeline.duration > 1)}
                  </p>
                </div>
              ) : null}

              <div className="bg-[var(--color-bg-purple-50)] rounded-lg px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserGroupIcon className="h-5 w-5 text-[var(--color-primary)]" />
                  <span className="text-[var(--color-text-secondary)]">Visibility</span>
                </div>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-[var(--color-text-primary)]">
                  {timeline.isPublic ? 'Public' : 'Private'}
                </p>
              </div>

              <div className="bg-[var(--color-bg-purple-50)] rounded-lg px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[var(--color-text-secondary)]">Author</span>
                </div>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-[var(--color-text-primary)]">
                  {timeline?.author?.username}
                </p>
              </div>
            </div>

            {/* Footer Section */}
            <div className="border-t border-[var(--color-border)] pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-[var(--color-text-tertiary)] gap-2">
                <div className="space-y-1">
                  <p>Created: {format(new Date(timeline.createdAt), 'MMM dd, yyyy')}</p>
                  <p>Last Updated: {format(new Date(timeline.updatedAt), 'MMM dd, yyyy')}</p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <p>Version: {timeline.version}</p>
                  {timeline.isForked ? (
                    <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>Forked Timeline</span>
                    </div>
                  ) : (
                    <p>Original Timeline</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={isForkModalOpen}
          onClose={() => setIsForkModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded-2xl bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-[var(--color-text-primary)]">
                Fork Timeline
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Are you sure you want to fork this timeline? You'll be able to modify your copy while keeping the original intact.
              </Dialog.Description>

              {forkError && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {forkError}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-purple-50)] transition-colors"
                  onClick={() => setIsForkModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                  onClick={handleFork}
                >
                  Fork
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
  };


  const RenderSegments = () => {
    if (!segments) return null;

    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Desktop Timeline View */}
        <div className="hidden md:block relative">
          {/* Vertical line connecting timeline points */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[var(--color-primary-light)] to-[var(--color-primary)]" />

          <div className="space-y-16">
            {segments.map((segment, index) => (
              <div key={segment.id} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-[var(--color-primary)] bg-white z-10" />

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-[var(--color-border)]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
                          {segment.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-tertiary)]">
                          Unit {segment.unitNumber}
                        </p>
                      </div>
                      {timeline.author.id === user?.id && (
                        <Link
                          href={`/timeline/${params.id}/segments/${segment.id}/edit`}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      )}
                    </div>

                    {/* Goals Section */}
                    {segment.goals && segment.goals.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Goals</h4>
                        <ul className="space-y-2">
                          {segment.goals.map((goal) => (
                            <li key={goal.id} className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-[var(--color-primary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-[var(--color-text-primary)]">{goal.goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Milestone Section */}
                    {segment.milestone && (
                      <div className="mb-4 bg-[var(--color-primary-light)] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          <h4 className="text-sm font-medium text-[var(--color-text-white)]">Milestone</h4>
                        </div>
                        <p className="text-sm text-[var(--color-text-white)]">{segment.milestone}</p>
                      </div>
                    )}

                    {/* References Section */}
                    {segment.references && segment.references.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">References</h4>
                        <ul className="space-y-2">
                          {segment.references.map((ref) => (
                            <li key={ref.id} className="flex items-start gap-2">
                              <svg className="h-5 w-5 text-[var(--color-text-tertiary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span className="text-sm text-[var(--color-text-tertiary)]">{ref.reference}</span>
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline View */}
        <div className="md:hidden space-y-6">
          {segments.map((segment, index) => (
            <div key={segment.id} className="relative">
              {/* Timeline node and line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary-light)] to-[var(--color-primary)]" />
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-[var(--color-primary)] bg-white z-10" />

              {/* Content */}
              <div className="ml-12">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-[var(--color-border)]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
                        {segment.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-tertiary)]">
                        Unit {segment.unitNumber}
                      </p>
                    </div>
                    {timeline.author.id === user?.id && (
                      <Link
                        href={`/timeline/${params.id}/segments/${segment.id}/edit`}
                        className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  {/* Goals Section */}
                  {segment.goals && segment.goals.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Goals</h4>
                      <ul className="space-y-2">
                        {segment.goals.map((goal) => (
                          <li key={goal.id} className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-[var(--color-primary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-[var(--color-text-primary)]">{goal.goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Milestone Section */}
                  {segment.milestone && (
                    <div className="mb-4 bg-[var(--color-primary-light)] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                        <h4 className="text-sm font-medium text-[var(--color-text-white)]">Milestone</h4>
                      </div>
                      <p className="text-sm text-[var(--color-text-white)]">{segment.milestone}</p>
                    </div>
                  )}

                  {/* References Section */}
                  {segment.references && segment.references.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">References</h4>
                      <ul className="space-y-2">
                        {segment.references.map((ref) => (
                          <li key={ref.id} className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-[var(--color-text-tertiary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="text-sm text-[var(--color-text-tertiary)]">{ref.reference}</span>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const conditionForCreatingSegmentsCreateButton = segments && segments.length == 0 && timeline.author.id === user?.id && !renderSegmentForm

  const conditionForRenderingSegments = segments && (segments.length > 0 || timeline.author.id !== user?.id)

  const GenerateModal = () => {
    const [formData, setFormData] = useState({
      goal: '',
      domain: '',
      skillLevel: '',
      targetAudience: ''
    });

    const handleChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsGenerating(true);
      try {
        const data = await timelineService.generateSegments(params.id as string, formData);
        setSegments(data);
        setShowGenerateModal(false);
        setFormData({
          goal: '',
          domain: '',
          skillLevel: '',
          targetAudience: ''
        });
      } catch (error) {
        console.error('Error generating segments:', error);
        setError('Failed to generate segments');
      } finally {
        setIsGenerating(false);
      }
    };

    if (!showGenerateModal) return null;

    return (
      <Dialog
        open={showGenerateModal}
        onClose={() => !isGenerating && setShowGenerateModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
              Generate Segments with AI
            </Dialog.Title>

            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                <p className="text-[var(--color-text-secondary)]">
                  Generating segments... This may take a few moments.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Goal
                  </label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => handleChange('goal', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    required
                    placeholder="What do you want to achieve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => handleChange('domain', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    required
                    placeholder="e.g., Web Development, Data Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Skill Level
                  </label>
                  <Dropdown
                    options={[
                      { value: '', label: 'Select skill level' },
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ]}
                    value={formData.skillLevel}
                    onChange={(value) => handleChange('skillLevel', value)}
                    placeholder="Select skill level"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleChange('targetAudience', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    required
                    placeholder="Who is this timeline for?"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-purple-50)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Generate Segments
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  };

  return (
    <>
      <Navbar />
      <RenderTimeline />
      {conditionForCreatingSegmentsCreateButton && <RenderCreateButton />}
      {conditionForRenderingSegments && <RenderSegments />}
      {renderSegmentForm && <RenderSegmentsForm />}
      {showGenerateModal && <GenerateModal />}
      <Footer />
    </>
  );
} 