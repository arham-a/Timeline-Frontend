"use client"
import React, { useState } from "react";
import axios from "axios";

type Segment = {
  unitNumber: number;
  title: string;
  topics: string;
  goals: string;
  references?: string;
};

const BASE_URL = "/api/segment";

export default function SegmentForm() {
  const [timelineId, setTimelineId] = useState("");
  const [segments, setSegments] = useState<Segment[]>([
    { unitNumber: 1, title: "", topics: "", goals: "", references: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleChange = <K extends keyof Segment>(
    index: number,
    field: K,
    value: Segment[K]
  ) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };
  

  const addSegment = () => {
    setSegments([
      ...segments,
      { unitNumber: segments.length + 1, title: "", topics: "", goals: "", references: "" },
    ]);
  };

  const removeSegment = (index: number) => {
    const updated = segments.filter((_, i) => i !== index);
    setSegments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload =
      segments.length === 1
        ? {
            timelineId,
            ...segments[0],
          }
        : {
            timelineId,
            segments,
          };

    try {
      const res = await axios.post(
        `${BASE_URL}${segments.length === 1 ? "/" : "/bulk"}`,
        payload
      );
      setResponse(res.data);
    } catch (err: any) {
      setError(err.response?.data || { message: "Unknown error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Segment(s)</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Timeline ID</label>
          <input
            className="border p-2 w-full rounded"
            value={timelineId}
            onChange={(e) => setTimelineId(e.target.value)}
            required
          />
        </div>

        {segments.map((segment, index) => (
          <div key={index} className="border p-4 rounded-md space-y-4 bg-gray-50 relative">
            <h3 className="font-semibold text-lg">Segment {index + 1}</h3>
            {segments.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => removeSegment(index)}
              >
                ✖
              </button>
            )}

            <div>
              <label className="block">Unit Number</label>
              <input
                type="number"
                className="border p-2 w-full rounded"
                value={segment.unitNumber}
                onChange={(e) => handleChange(index, "unitNumber", +e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block">Title</label>
              <input
                className="border p-2 w-full rounded"
                value={segment.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block">Topics (comma separated)</label>
              <input
                className="border p-2 w-full rounded"
                value={segment.topics}
                onChange={(e) => handleChange(index, "topics", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block">Goals (comma separated)</label>
              <input
                className="border p-2 w-full rounded"
                value={segment.goals}
                onChange={(e) => handleChange(index, "goals", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block">References (comma separated, optional)</label>
              <input
                className="border p-2 w-full rounded"
                value={segment.references || ""}
                onChange={(e) => handleChange(index, "references", e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={addSegment}
          >
            + Add Another Segment
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Response / Error Handling */}
      <div className="mt-6">
        {response && (
          <pre className="bg-green-50 border border-green-300 p-4 rounded text-sm overflow-x-auto">
            ✅ Success: {JSON.stringify(response, null, 2)}
          </pre>
        )}
        {error && (
          <pre className="bg-red-50 border border-red-300 p-4 rounded text-sm overflow-x-auto">
            ❌ Error: {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
