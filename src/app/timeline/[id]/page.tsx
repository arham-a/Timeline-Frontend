"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { format } from "date-fns";
import {
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
  MinusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Timeline, timelineService } from "../../../lib/timelineService";
import {
  segmentService,
  Segment,
  SegmentCreateDto,
} from "@/lib/segmentService";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { mapTimelineTypeToMessage } from "@/app/utils/mapTimelineTypeToMessage";
import { Dialog } from "@headlessui/react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Footer from "../../components/Footer";
import Dropdown from "../../components/Dropdown";
import { BackgroundLines } from "../../components/ui/background-lines";
import { HoverBorderGradient } from "../../components/ui/hover-border-gradient";
import { Boxes } from "@/app/components/ui/background-boxes";
import TimelineInfoCard from '../../components/ui/TimelineInfoCard';
import TimelineSegmentCard from '../../components/ui/TimelineSegmentCard';
import toast from 'react-hot-toast';

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
  const { user, loading: authLoading } = useAuth();
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [segments, setSegments] = useState<Segment[] | null>(null);
  const [renderSegmentForm, setRenderSegmentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [forkError, setForkError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState<GenerateSegmentForm>({
    goal: "",
    domain: "",
    skillLevel: "",
    targetAudience: "",
  });

  const handleInputChange = (
    field: keyof GenerateSegmentForm,
    value: string
  ) => {
    setGenerateForm((prev) => ({
      ...prev,
      [field]: value,
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
        console.log("Fetched data:", { timelineData, segmentsData });
        if (mounted) {
          setTimeline(timelineData);
          setSegments(segmentsData || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (mounted) {
          setError("Failed to load timeline data");
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth');
    }
  }, [user, authLoading, router]);

  console.log("Current state:", {
    loading,
    error,
    timeline,
    segments,
    renderSegmentForm,
  });

  if (!authLoading && !user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black/[0.96] pt-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (error || !timeline) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black/[0.96] pt-16 flex items-center justify-center">
          <div className="text-red-400">{error || "Timeline not found"}</div>
        </div>
      </>
    );
  }

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const data = await timelineService.generateSegments(
        params.id as string,
        generateForm
      );
      setSegments(data || []);
      setShowGenerateModal(false);
      // Reset form after successful submission
      setGenerateForm({
        goal: "",
        domain: "",
        skillLevel: "",
        targetAudience: "",
      });
    } catch (error) {
      console.error("Error generating segments:", error);
      setError("Failed to generate segments");
    } finally {
      setIsGenerating(false);
    }
  };

  const RenderCreateButton = () => {
    return (
      <div className="w-full bg-black/[0.96] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16">
          <h3 className="mb-4 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            NO SEGMENTS
          </h3>
          <div className="mt-3 text-sm sm:text-base text-gray-400">
            Get started by adding segments.
          </div>
          <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center gap-4">
            <button
              onClick={() => setRenderSegmentForm(true)}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Segments Manually
            </button>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate with AI
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RenderSegmentsForm = () => {
    const maxSegments = timeline?.duration || 10;
    const [segmentForms, setSegmentForms] = useState<SegmentCreateDto[]>([
      {
        unitNumber: 1,
        title: "",
        description: "",
        goals: [""],
        references: [""],
        milestone: "",
      },
    ]);
    const [error, setError] = useState<string | null>(null);

    const addSegment = () => {
      if (segmentForms.length >= maxSegments) {
        setError(`Cannot add more than ${maxSegments} segments`);
        return;
      }
      setSegmentForms([
        ...segmentForms,
        {
          unitNumber: segmentForms.length + 1,
          title: "",
          description: "",
          goals: [""],
          references: [""],
          milestone: "",
        },
      ]);
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

    const updateSegment = (
      index: number,
      field: keyof SegmentCreateDto,
      value: any
    ) => {
      const newForms = [...segmentForms];
      newForms[index] = { ...newForms[index], [field]: value };
      setSegmentForms(newForms);
    };

    const addGoal = (segmentIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals.push("");
      setSegmentForms(newForms);
    };

    const removeGoal = (segmentIndex: number, goalIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals = newForms[segmentIndex].goals.filter(
        (_, i) => i !== goalIndex
      );
      setSegmentForms(newForms);
    };

    const updateGoal = (
      segmentIndex: number,
      goalIndex: number,
      value: string
    ) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].goals[goalIndex] = value;
      setSegmentForms(newForms);
    };

    const addReference = (segmentIndex: number) => {
      const newForms = [...segmentForms];
      if (!newForms[segmentIndex].references) {
        newForms[segmentIndex].references = [];
      }
      newForms[segmentIndex].references!.push("");
      setSegmentForms(newForms);
    };

    const removeReference = (segmentIndex: number, refIndex: number) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].references = newForms[
        segmentIndex
      ].references!.filter((_, i) => i !== refIndex);
      setSegmentForms(newForms);
    };

    const updateReference = (
      segmentIndex: number,
      refIndex: number,
      value: string
    ) => {
      const newForms = [...segmentForms];
      newForms[segmentIndex].references![refIndex] = value;
      setSegmentForms(newForms);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await segmentService.createSegmentsBulk({
          timelineId: params.id as string,
          segments: segmentForms,
        });
        setSegments(response || []);
        setRenderSegmentForm(false);
      } catch (err: any) {
        setError(err.message || "Failed to create segments");
      }
    };

    return (
      <div className="bg-black/50 border border-purple-500/20 shadow-xl rounded-2xl p-6 sm:p-8 mt-4 mb-8 max-w-7xl mx-auto relative z-20">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6">
          Create Timeline Segments
        </h2>
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {segmentForms.map((segment, segmentIndex) => (
            <div
              key={segmentIndex}
              className="border border-purple-500/20 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 bg-black/30 shadow-lg"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  Segment {segment.unitNumber}
                </h3>
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
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={segment.title}
                  onChange={(e) =>
                    updateSegment(segmentIndex, "title", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={segment.description}
                  onChange={(e) =>
                    updateSegment(segmentIndex, "description", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Milestone (optional)
                </label>
                <input
                  type="text"
                  value={segment.milestone || ""}
                  onChange={(e) =>
                    updateSegment(segmentIndex, "milestone", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Goals
                  </label>
                  <button
                    type="button"
                    onClick={() => addGoal(segmentIndex)}
                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-full transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {segment.goals.map((goal, goalIndex) => (
                  <div key={goalIndex} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) =>
                        updateGoal(segmentIndex, goalIndex, e.target.value)
                      }
                      className="flex-1 px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
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
                  <label className="block text-sm font-medium text-gray-200">
                    References (optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => addReference(segmentIndex)}
                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-full transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {segment.references?.map((ref, refIndex) => (
                  <div key={refIndex} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={ref}
                      onChange={(e) =>
                        updateReference(segmentIndex, refIndex, e.target.value)
                      }
                      className="flex-1 px-4 py-2 rounded-lg border border-cyan-900/40 bg-black/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur"
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

          <div className="pt-6 border-t border-purple-500/20 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={addSegment}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={segmentForms.length >= maxSegments}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Segment
            </button>
            <div className="flex flex-col w-full sm:w-auto gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setRenderSegmentForm(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-purple-500/20 bg-black/50 text-gray-200 font-semibold hover:bg-purple-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300"
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
      const forkedTimeline = await timelineService.forkTimeline(
        params.id as string
      );
      router.push(`/timeline/${forkedTimeline.id}`);
    } catch (err: any) {
      setForkError(err.response?.data?.message || "Failed to fork timeline");
    }
  };

  const getTypeColor = (
    type: string
  ): { bg: string; text: string; border: string } => {
    switch (type.toUpperCase()) {
      case "ROADMAP":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "CHRONICLE":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
        };
      case "COURSE":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case "PROJECT":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "STUDY_PLAN":
        return {
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
        };
      default:
        return {
          bg: "bg-[var(--color-primary-light)]",
          text: "text-[var(--color-primary)]",
          border: "border-[var(--color-primary-light)]",
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "ROADMAP":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
      case "CHRONICLE":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "COURSE":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "PROJECT":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "STUDY_PLAN":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
    }
  };

  const RenderTimeline = () => {
    return (
      <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] text-white overflow-hidden relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-40 pb-12">
          <TimelineInfoCard
            timeline={timeline}
            user={user}
            setIsForkModalOpen={setIsForkModalOpen}
            isForkModalOpen={isForkModalOpen}
            handleFork={handleFork} 
            forkError={null}         
           />
        </div>
      </div>
    );
  };

  const RenderSegments = () => {
    if (!segments) return null;
    return (
      <div className="w-full bg-black/[0.96] py-6 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Timeline View */}
          <div className="hidden md:block relative">
            {/* Vertical line connecting timeline points */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500/50 to-purple-600" />
          <div className="space-y-16">
            {segments.map((segment, index) => (
              <TimelineSegmentCard
                key={segment.id}
                segment={segment}
                timeline={timeline}
                user={user}
                params={params}
                index={index}
                isDesktop={true}
                onSegmentUpdate={(updatedSegment) => {
                  setSegments((prev) => prev && prev.map(s => s.id === updatedSegment.id ? updatedSegment : s));
                }}
              />
            ))}
            </div>
          </div>
          {/* Mobile Timeline View */}
          <div className="md:hidden space-y-6">
            {segments.map((segment, index) => (
              <TimelineSegmentCard
                key={segment.id}
                segment={segment}
                timeline={timeline}
                user={user}
                params={params}
                index={index}
                isDesktop={false}
                onSegmentUpdate={(updatedSegment) => {
                  setSegments((prev) => prev && prev.map(s => s.id === updatedSegment.id ? updatedSegment : s));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const conditionForCreatingSegmentsCreateButton =
    segments &&
    segments.length == 0 &&
    timeline.author.id === user?.id &&
    !renderSegmentForm;

  const conditionForRenderingSegments =
    segments && (segments.length > 0 || timeline.author.id !== user?.id);

  const GenerateModal = () => {
    const [formData, setFormData] = useState({
      goal: "",
      domain: "",
      skillLevel: "",
      targetAudience: "",
    });

    const handleChange = (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsGenerating(true);
      setError(null);
      
      try {
        console.log("Generating segments with data:", formData);
        const data = await timelineService.generateSegments(
          params.id as string,
          formData
        );
        
        console.log("Received segments:", data);
        
        if (data && data.length > 0) {
          setSegments(data);
          setShowGenerateModal(false);
          setFormData({
            goal: "",
            domain: "",
            skillLevel: "",
            targetAudience: "",
          });
          toast.success(`Successfully generated ${data.length} segments!`);
        } else {
          toast.error("No segments were generated. Please try again.");
        }
      } catch (error: any) {
        console.error("Error generating segments:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to generate segments";
        setError(errorMessage);
        toast.error(errorMessage);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-black/90 border border-purple-500/20 shadow-2xl p-6 sm:p-8">
            <Dialog.Title className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
              Generate Segments with AI
            </Dialog.Title>
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                <p className="text-gray-300">
                  Generating segments... This may take a few moments.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Goal
                  </label>
                  <input
                    type="text"
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-purple-500/20 bg-black/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                    placeholder="What do you want to achieve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => handleChange("domain", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-purple-500/20 bg-black/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                    placeholder="e.g., Web Development, Data Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Skill Level
                  </label>
                  <Dropdown
                    options={[
                      { value: "", label: "Select skill level" },
                      { value: "beginner", label: "Beginner" },
                      { value: "intermediate", label: "Intermediate" },
                      { value: "advanced", label: "Advanced" },
                    ]}
                    value={formData.skillLevel}
                    onChange={(value) => handleChange("skillLevel", value)}
                    placeholder="Select skill level"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => handleChange("targetAudience", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-purple-500/20 bg-black/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                    placeholder="Who is this timeline for?"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 rounded-lg border border-purple-500/20 bg-black/50 text-gray-200 font-semibold hover:bg-purple-500/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300"
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
